import { SuccessAlertService } from './../../../Authentification/alerts/success-alert.service';
import { ErreurAlertService } from './../../../Authentification/alerts/erreur-alert.service';
import { AuthService } from './../../../Authentification/auth.service';
import { UserService } from './../../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-avis-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avis-client.component.html',
  styleUrl: './avis-client.component.css'
})
export class AvisClientComponent implements OnInit {
  orders: any[] = [];
  user: string | null = null;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private AuthService: AuthService,
    private ErreurAlertService: ErreurAlertService,
    private SuccessAlertService: SuccessAlertService,
  ) { }

  ngOnInit(): void {
    this.user = this.AuthService.getUserName();
    this.getClientOrdersForReview();
  }

  getClientOrdersForReview() {
    if (this.user) {
      this.orderService.getOrders().subscribe((data: any[]) => {
        // Filtrer les commandes pour l'utilisateur connecté qui ont été livrées (ou un autre statut pertinent pour les avis)
        const clientOrdersForReview = data.filter((item: any) => item.clientName === this.user && item.statut === 'Expédiée'); // Ajuster le statut selon votre besoin

        // Utiliser un objet pour regrouper les produits par numéro de commande
        const commandesGrouped: { [key: string]: any } = {};

        clientOrdersForReview.forEach((item: any) => {
          const numeroCommande = item.numeroCommande;
          if (!commandesGrouped[numeroCommande]) {
            commandesGrouped[numeroCommande] = {
              orderNumber: numeroCommande,
              orderDate: item.dateCommande,
              items: [],
            };
          }
          commandesGrouped[numeroCommande].items.push({
            id: item.produitId, // Assurez-vous d'avoir un identifiant de produit
            name: item.produitName,
            rating: 0, // Initialiser la note
            comment: '', // Initialiser le commentaire
            avis: item.avisClient // Si l'avis existe déjà
          });
        });

        this.orders = Object.values(commandesGrouped);
        console.log('Commandes récupérées pour les avis:', this.orders);

      }, (error: any) => {
        this.ErreurAlertService.erreurAlert('Erreur lors de la récupération de l\'historique des commandes.');
        this.orders = [];
      });
    } else {
      this.ErreurAlertService.erreurAlert('Nom d\'utilisateur non trouvé.');
      this.orders = [];
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  setRating(rating: number, orderIndex: number, itemIndex: number) {
    this.orders[orderIndex].items[itemIndex].rating = rating;
  }

  getRating(orderIndex: number, itemIndex: number): number {
    return this.orders[orderIndex].items[itemIndex].rating;
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

  submitReview(orderIndex: number, itemIndex: number) {
    const item = this.orders[orderIndex].items[itemIndex];
    if (item.rating > 0 && item.comment) {
      const reviewData = {
        commandeId: this.orders[orderIndex].orderNumber, // Vous pouvez utiliser un autre identifiant de commande si nécessaire
        produitId: item.id,
        clientId: this.user, // Utilisez le nom d'utilisateur comme identifiant client (si c'est ce que votre backend attend)
        rating: item.rating,
        commentaireClient: item.comment,
        date : this.formatDate(new Date()), 
      };
      console.log('Avis à envoyer:', reviewData);
      
    } else {
      this.ErreurAlertService.erreurAlert('Veuillez sélectionner une note et écrire un commentaire.');
    }
  }
}