import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { AvisService } from '../../../services/avis.service';  
import { AuthService } from '../../../Authentification/auth.service';

@Component({
  selector: 'app-avis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avis.component.html',
  styleUrls: ['./avis.component.css']
})
export class AvisComponent implements OnInit {
  reviews: any[] = [];
  selectedReview: any = null;
  response: string = '';
  artisanName: string = '';

  constructor(
    private router: Router,
    private orderService: OrderService,
    private avisService: AvisService,
    private authService: AuthService 
  ) {}

  ngOnInit(): void {
    const artisanName = this.authService.getUserName();
    this.loadReviewsFromOrders(artisanName);
  }

  loadReviewsFromOrders(artisanName: string): void {
    this.orderService.getOrdersByArtisan(artisanName).subscribe({
      next: (orders: any[]) => {
        const avisList: any[] = [];
  
        orders.forEach(order => {
          this.avisService.getAvisList(order.numeroCommande, order.produitName).subscribe({
            next: (commentaires: string[]) => {
              this.avisService.getNote(order.numeroCommande, order.produitName).subscribe({
                next: (note: number) => {
                  if (commentaires && commentaires.length > 0) {
                    avisList.push({
                      numeroCommande: order.numeroCommande,
                      clientName: order.clientName || 'Client inconnu',
                      productName: order.produitName || 'Produit inconnu',
                      rating: note || 0,
                      comments: commentaires,
                      date: order.dateCommande 
                    });
  
                    this.reviews = [...avisList];
                  }
                },
                error: err => console.error('Erreur getNote:', err)
              });
            },
            error: err => console.error('Erreur getAvisList:', err)
          });
        });
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des commandes :', error);
      }
    });
  }
  
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  respondToReview(review: any) {
    this.selectedReview = { ...review };
    this.response = '';
    this.openModal();
  }

  saveResponse() {
    if (this.selectedReview && this.response.trim()) {
      const numeroCommande = this.selectedReview.numeroCommande;
      const produitName = this.selectedReview.productName;
      const auteur = this.authService.getUserName();
      const dateNow = new Date();
      
      // Format: "user: message, DD-MM-YY HH:mm:ss"
      const commentaireFinal = `${auteur}: ${this.response.trim()}, ${this.formatDate(dateNow)}`;
  
      this.avisService.addComment(numeroCommande, produitName, commentaireFinal).subscribe({
        next: () => {
          this.selectedReview.comments.push(commentaireFinal);
          this.response = '';
          this.closeModal();
        },
        error: (err) => {
          console.error('Erreur lors de lajout du commentaire :', err);
        }
      });
    }
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStarArray(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }

  openModal() {
    const modal = document.getElementById('respondModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeModal() {
    const modal = document.getElementById('respondModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.selectedReview = null;
    this.response = '';
  }

  // Nouvelle méthode pour formater la date complète
  getFormattedDate(dateString: string): string {
    if (!dateString) return 'Date inconnue';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Méthode pour extraire et formater la date depuis un commentaire
  getFullDateFromComment(comment: string): string {
    const parts = comment.split(',');
    if (parts.length < 2) return 'Date inconnue';
    
    const dateTime = parts[1].trim();
    const [datePart, timePart] = dateTime.split(' ');
    
    if (!datePart || !timePart) return dateTime;
    
    const [day, month, year] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    
    const fullDate = new Date(`20${year}-${month}-${day}T${hours}:${minutes}:00`);
    
    if (isNaN(fullDate.getTime())) return dateTime;
    
    return fullDate.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getAuthor(comment: string): string {
    const parts = comment.split(':');
    return parts[0]?.trim() || 'Anonyme';
  }

  getText(comment: string): string {
    const parts = comment.split(':');
    if (parts.length < 2) return comment;
    
    const textParts = parts[1].split(',');
    return textParts[0]?.trim() || '';
  }

  // Formatage de date pour le stockage (DD-MM-YY HH:mm:ss)
  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear().toString().slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  // Méthode pour l'affichage relatif (ex: "il y a 2 heures")
  getRelativeTime(comment: string): string {
    const parts = comment.split(',');
    if (parts.length < 2) return 'Récemment';
    
    const dateTime = parts[1].trim();
    const [datePart, timePart] = dateTime.split(' ');
    
    if (!datePart || !timePart) return 'Récemment';
    
    const [day, month, year] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    
    const commentDate = new Date(`20${year}-${month}-${day}T${hours}:${minutes}:00`);
    
    if (isNaN(commentDate.getTime())) return 'Récemment';
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
    
    return this.getFullDateFromComment(comment);
  }
}