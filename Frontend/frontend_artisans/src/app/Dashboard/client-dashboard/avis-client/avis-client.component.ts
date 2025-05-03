import { PanierComponent } from './../panier/panier.component';
import { SuccessAlertService } from './../../../Authentification/alerts/success-alert.service';
import { ErreurAlertService } from './../../../Authentification/alerts/erreur-alert.service';
import { AuthService } from './../../../Authentification/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { AvisService } from '../../../services/avis.service';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

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
            item.clientName === this.user && item.statut === 'Expédiée');

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
      comments: commentRequest,
      note: noteRequest
    }).subscribe({
      next: (result) => {
        item.existingComments = result.comments;
        item.note = result.note;
        item.rating = result.note > 0 ? result.note : 0;
        item.avisSubmitted = result.comments.length > 0;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données du produit:', error);
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

    const avis = {
      id: 0,
      numeroCommande: this.orders[orderIndex].orderNumber,
      produitName: item.name,
      userName: this.user,
      note: item.rating,
      commentaire: [item.comment],
      dateAvis: this.formatDate(new Date())
    };

    item.isSubmitting = true;

    this.avisService.addAvis(avis).subscribe({
      next: () => {
        item.avisSubmitted = true;
        item.isSubmitting = false;

        this.successAlertService.successAlert('Votre avis a été soumis avec succès !');
        item.comment = '';

        // Recharger les données au lieu de naviguer
        this.loadProductData(this.orders[orderIndex].orderNumber, item);
      },
      error: (error) => {
        item.isSubmitting = false;
        if (error.status === 400) {
          this.erreurAlertService.erreurAlert("Vous avez déjà soumis un avis pour ce produit.");
        } else {
          this.erreurAlertService.erreurAlert("Une erreur est survenue lors de la soumission de l'avis.");
          console.log(error);
        }
      }
    });
  }


  //******************************************************************************************* */
  addCommentToProduct(orderIndex: number, itemIndex: number) {
    const order = this.orders[orderIndex];
    const item = order.items[itemIndex];

    if (!this.newComment || this.newComment.trim() === '') {
      this.erreurAlertService.erreurAlert('Veuillez entrer un commentaire.');
      return;
    }

    item.isAddingComment = true;
    this.avisService.addComment(order.orderNumber, item.name, this.newComment).subscribe({
      next: () => {
        this.successAlertService.successAlert('Commentaire ajouté avec succès !');
        this.newComment = '';
        // Recharger les données au lieu de naviguer
        this.loadProductData(order.orderNumber, item);

      },
      error: (error) => {
        item.isAddingComment = false;
        if (error.status === 400) {
          this.erreurAlertService.erreurAlert("Vous devez d'abord soumettre un avis initial.");
        } else {

          this.erreurAlertService.erreurAlert('Erreur lors de l\'ajout du commentaire.ici erreur');

        }
      }
    });

    item.isAddingComment = false;
  }

  getStarClass(star: number, currentRating: number, hoverRating: number | null, isDisabled: boolean): string {
    const filled = star <= (hoverRating || currentRating || 0);
    if (isDisabled) {
      return filled ? 'bi-star-fill text-secondary' : 'bi-star text-light';
    }
    return filled ? 'bi-star-fill text-warning' : 'bi-star text-muted';
  }


  getCommentBorderStyle(index: number): string {
    const colors = [
      '5px solid #0d6efd',  // Bleu Bootstrap
      '5px solid #198754',  // Vert Bootstrap
      '5px solid #6f42c1',  // Violet Bootstrap
      '5px solid #fd7e14',  // Orange Bootstrap
      '5px solid #d63384'   // Rose Bootstrap
    ];
    return colors[index % colors.length];
  }
  // Méthodes utilitaires pour le nouveau design
  getCommentColor(index: number): string {
    const colors = ['#6366f1', '#10b981', '#0ea5e9', '#f59e0b', '#ef4444'];
    return colors[index % colors.length];
  }



  extractCommentText(comment: string): string {
    const parts = comment.split(',');
    return parts[0]?.trim() || '';
  }
  
  

  getFormattedDateFromComment(comment: string): string {
    const parts = comment.split(',');
    if (parts.length < 3) return '';
  
    const date = parts[1].trim(); // "03-05-25"
    const time = parts[2].trim(); // "15:49:29"
  
    return `${date} à ${time}`;
  }
  

}