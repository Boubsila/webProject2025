import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { AvisService } from '../../../services/avis.service';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from './../../../Authentification/auth.service';
import { ErreurAlertService } from './../../../Authentification/alerts/erreur-alert.service';
import { SuccessAlertService } from './../../../Authentification/alerts/success-alert.service';

@Component({
  selector: 'app-avis-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avis-client.component.html',
  styleUrls: ['./avis-client.component.css']
})
export class AvisClientComponent implements OnInit {
  orders: any[] = [];
  user: string | null = null;
  newComment: string = '';
  isLoading: boolean = false;
  hoverRating: { [key: string]: number } = {};

  constructor(
    private router: Router,
    private orderService: OrderService,
    private avisService: AvisService,
    private authService: AuthService,
    private erreurAlertService: ErreurAlertService,
    private successAlertService: SuccessAlertService,
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUserName();
    if (!this.user) {
      this.erreurAlertService.erreurAlert('Vous devez être connecté pour accéder à cette page.');
      this.router.navigate(['/login']);
      return;
    }
    this.getClientOrdersForReview();
  }

  getClientOrdersForReview() {
    this.isLoading = true;
    if (this.user) {
      this.orderService.getOrders().subscribe({
        next: (data: any[]) => {
          const clientOrdersForReview = data.filter((item: any) =>



            item.clientName === this.user && item.statut === 'Livré');

          const commandesGrouped: { [key: string]: any } = {};

          clientOrdersForReview.forEach((item: any) => {
            const numeroCommande = item.numeroCommande;
            if (!commandesGrouped[numeroCommande]) {
              commandesGrouped[numeroCommande] = {
                orderNumber: numeroCommande,
                orderDate: item.dateCommande,
                artisanName: item.artisanName,
                items: [],
              };
            }

            commandesGrouped[numeroCommande].items.push({
              id: item.produitId,
              artisanName: item.artisanName,
              name: item.produitName,
              rating: 0,
              comment: '',
              avisSubmitted: false,
              existingComments: [],
              note: null,
              isLoadingComments: false,
              isSubmitting: false,
              isAddingComment: false
            });
          });

          this.orders = Object.values(commandesGrouped);
          this.loadAllProductData();
        },
        error: (error: any) => {
          this.erreurAlertService.erreurAlert('Erreur lors de la récupération de l\'historique des commandes.');
          this.orders = [];
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.erreurAlertService.erreurAlert('Nom d\'utilisateur non trouvé.');
      this.orders = [];
      this.isLoading = false;
    }
  }

  loadAllProductData() {
    this.orders.forEach(order => {
      order.items.forEach((item: any) => {
        this.loadProductData(order.orderNumber, item);
      });
    });
  }

  loadProductData(orderNumber: string, item: any) {
    item.isLoadingComments = true;

    const commentRequest = this.avisService.getAvisList(orderNumber, item.name).pipe(
      catchError(error => {
        console.error('Erreur de chargement des commentaires:', error);
        return of([]);
      })
    );

    const noteRequest = this.avisService.getNote(orderNumber, item.name).pipe(
      catchError(error => {
        console.error('Erreur de chargement de la note:', error);
        return of(0);
      })
    );

    forkJoin({
      comments: this.avisService.getAvisList(orderNumber, item.name),
      note: this.avisService.getNote(orderNumber, item.name)
    }).subscribe({
      next: (result) => {
        item.existingComments = result.comments;
        item.note = result.note;
        item.rating = result.note > 0 ? result.note : 0;
        item.avisSubmitted = result.comments.length > 0;
      },
      error: (error) => {
        if (error.status === 404) {
          this.erreurAlertService.erreurAlert("Aucun avis ou note trouvée.");
        } else if (error.status === 500) {
          this.erreurAlertService.erreurAlert("Erreur serveur lors du chargement des données du produit.");
        } else {
          this.erreurAlertService.erreurAlert("Erreur inconnue lors du chargement des données.");
        }
        
      },
      complete: () => {
        item.isLoadingComments = false;
      }
    });

  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  setRating(rating: number, orderIndex: number, itemIndex: number) {
    if (!this.orders[orderIndex].items[itemIndex].avisSubmitted) {
      this.orders[orderIndex].items[itemIndex].rating = rating;
    }
  }

  setHoverRating(rating: number, orderIndex: number, itemIndex: number) {
    if (!this.orders[orderIndex].items[itemIndex].avisSubmitted) {
      const itemId = `${orderIndex}-${itemIndex}`;
      this.hoverRating[itemId] = rating;
    }
  }

  clearHoverRating(orderIndex: number, itemIndex: number) {
    const itemId = `${orderIndex}-${itemIndex}`;
    delete this.hoverRating[itemId];
  }

  getRatingText(rating: number): string {
    const ratingTexts = {
      1: 'Très mauvais',
      2: 'Mauvais',
      3: 'Moyen',
      4: 'Bon',
      5: 'Excellent'
    };
    return `(${rating} / 5) - ${ratingTexts[rating as keyof typeof ratingTexts]}`;
  }

  formatDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear().toString().slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  submitFirstReview(orderIndex: number, itemIndex: number) {
    const item = this.orders[orderIndex].items[itemIndex];

    if (item.rating <= 0) {
      this.erreurAlertService.erreurAlert('Veuillez sélectionner une note.');
      return;
    }

    if (!item.comment || item.comment.trim() === '') {
      this.erreurAlertService.erreurAlert('Veuillez écrire un commentaire.');
      return;
    }

    // Formatage du commentaire avec le nom d'utilisateur
    const formattedComment = `${this.user}: ${item.comment.trim()}, ${this.formatDate(new Date())}`;

    const avis = {
      id: 0,
      numeroCommande: this.orders[orderIndex].orderNumber,
      produitName: item.name,
      userName: this.user,
      note: item.rating,
      commentaire: [formattedComment],
      dateAvis: this.formatDate(new Date())
    };

    item.isSubmitting = true;

    this.avisService.addAvis(avis).subscribe({
      next: () => {
        item.avisSubmitted = true;
        item.isSubmitting = false;
        this.successAlertService.successAlert('Votre avis a été soumis avec succès !');
        item.comment = '';
        this.loadProductData(this.orders[orderIndex].orderNumber, item);
      },
      error: (error) => {
        item.isSubmitting = false;

        if (error.status === 400) {
          this.erreurAlertService.erreurAlert("Les données de l'avis ne sont pas valides ou l'avis a déjà été soumis.");
        } else if (error.status === 500) {
          this.erreurAlertService.erreurAlert("Erreur interne du serveur lors de la soumission de l'avis.");
        } else {
          this.erreurAlertService.erreurAlert("Une erreur inconnue est survenue.");
        }

        
      }
    });

  }

  addCommentToProduct(orderIndex: number, itemIndex: number) {
    const order = this.orders[orderIndex];
    const item = order.items[itemIndex];

    if (!this.newComment || this.newComment.trim() === '') {
      this.erreurAlertService.erreurAlert('Veuillez entrer un commentaire.');
      return;
    }

    // Formatage du nouveau commentaire avec le nom d'utilisateur
    const formattedComment = `${this.user}: ${this.newComment.trim()}, ${this.formatDate(new Date())}`;

    item.isAddingComment = true;

    this.avisService.addComment(order.orderNumber, item.name, formattedComment).subscribe({
      next: () => {
        this.successAlertService.successAlert('Commentaire ajouté avec succès !');
        this.newComment = '';
        this.loadProductData(order.orderNumber, item);
      },
      error: (error) => {
        item.isAddingComment = false;
        if (error.status === 0) {     
          this.erreurAlertService.erreurAlert("Impossible de joindre le serveur.");
        }
        else if (error.status === 400) {
          this.erreurAlertService.erreurAlert("Le commentaire est vide ou vous devez d'abord soumettre un avis.");
        } else if (error.status === 404) {
          this.erreurAlertService.erreurAlert("Produit ou commande non trouvés.");
        } else if (error.status === 500) {
          this.erreurAlertService.erreurAlert("Erreur serveur lors de l'ajout du commentaire.");
        } else {
          this.erreurAlertService.erreurAlert("Une erreur inconnue est survenue.");
        }

        
      },
      complete: () => {
        item.isAddingComment = false;
      }
    });

  }

  getStarClass(star: number, currentRating: number, hoverRating: number | null, isDisabled: boolean): string {
    const filled = star <= (hoverRating || currentRating || 0);
    if (isDisabled) {
      return filled ? 'bi-star-fill text-secondary' : 'bi-star text-light';
    }
    return filled ? 'bi-star-fill text-warning' : 'bi-star text-muted';
  }

  getCommentColor(index: number): string {
    const colors = ['#6366f1', '#10b981', '#0ea5e9', '#f59e0b', '#ef4444'];
    return colors[index % colors.length];
  }

  getCommentAuthor(comment: string): string {
    const parts = comment.split(':');
    return parts[0]?.trim() || 'Utilisateur';
  }

  getCommentText(comment: string): string {
    const parts = comment.split(':');
    if (parts.length < 2) return comment;

    const textParts = parts[1].split(',');
    return textParts[0]?.trim() || '';
  }

  getFormattedDateFromComment(comment: string): string {
    const parts = comment.split(',');
    if (parts.length < 2) return '';

    const dateTime = parts[1]?.trim();
    if (!dateTime) return '';

    const [date, time] = dateTime.split(' ');
    return `${date} à ${time}`;
  }
}