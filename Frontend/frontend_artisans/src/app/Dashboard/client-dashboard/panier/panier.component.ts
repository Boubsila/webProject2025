import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuccessAlertService } from '../../../Authentification/alerts/success-alert.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.css'
})
export class PanierComponent implements OnInit {
  cartItems: any[] = []; // Liste des articles du panier
  cartItemCount: number = 0; // Nombre d'articles, initialisé à 0

  subtotal: number = 0; // Total sans frais de livraison
  deliveryFee: any = 5; // Frais de livraison
  total: number = 0; // Total final à payer
  adresseLivraison: string = '';

  constructor(
    private router: Router,
    private succeAlert: SuccessAlertService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Init : récupérer les articles et calculer le total
    this.getcartItems();
  }

  goToDashboard() {
    // Rediriger vers le dashboard
    this.router.navigate(['/dashboard']);
  }

  increaseQuantity(item: any) {
    // Augmenter la quantité
     item.quantity++;
    this.calculateTotals();
  }

  decreaseQuantity(item: any) {
    // Diminuer la quantité (min 1)
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotals();
    }
  }

  getcartItems() {
    // Récupérer les commandes depuis le service
    this.orderService.getOrders().subscribe((data: any[]) => {
      // Garder seulement celles non encore commandées
      const commandesNonValidees = data.filter((item: any) => !item.isOrderd);

      // Formater les données pour l'affichage
      this.cartItems = commandesNonValidees.map((item: any) => {
        return {
          id: item.id,
          produitId: item.produitId, // Assurez-vous que produitId est présent
          name: item.produitName,
          quantity: item.quantite,
          unitPrice: item.prix,
          numeroCommande: item.numeroCommande, // Conserver le numeroCommande existant
          artisanName: item.artisanName,
          clientName: item.clientName,
          livreurName: item.livreurName,
          dateLivraison: item.dateLivraison
        };
      });

      this.cartItemCount = this.cartItems.length;
      this.calculateTotals();
    }, (error: any) => {
      console.error('Erreur lors de la récupération des éléments du panier:', error);
    });
  }

  removeFromCart(item: any) {
    // Supprimer un article via le backend
    this.orderService.deleteOrder(item.id).subscribe({
      next: () => {
        // Mettre à jour la liste locale
        this.cartItems = this.cartItems.filter(i => i.id !== item.id);
        this.calculateTotals();
        this.cartItemCount = this.cartItems.length;
      },
      error: (error: any) => {
        console.error('Erreur lors de la suppression de la commande :', error);
      }
    });
  }

  calculateTotals() {
    // Calculer le total sans et avec livraison
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    this.deliveryFee = this.subtotal < 100 ? 5 : 'Free';
    if (this.deliveryFee === 'Free')
      this.total = this.subtotal;
    else
      this.total = this.subtotal + this.deliveryFee;
  }

  Commander() {
    // Générer un numéro de commande unique
    const now = new Date();
    const orderNummer = 'ORD' +
      String(now.getDate()).padStart(2, '0') +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getFullYear()).slice(-2) +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');

    // Format court de la date
    const dateCommande = now.toISOString();
      

    // Mettre à jour chaque article comme "commandé" avec la quantité actuelle du panier
    this.cartItems.forEach(item => {
      const updatedOrder = {
        id: item.id,
        numeroCommande: item.numeroCommande || orderNummer,
        produitId: item.produitId,
        produitName: item.name,
        artisanName: item.artisanName || '',
        clientName: item.clientName || '',
        livreurName: item.livreurName || '',
        dateCommande: dateCommande,
        statut: 'pending',
        isOrderd: true,
        quantite: item.quantity,
        prix: item.unitPrice,
        adresseLivraison: this.adresseLivraison || '',
        dateLivraison: item.dateLivraison || ''
      };
      

      // Envoyer la mise à jour à l'API
      this.orderService.updateOrder(updatedOrder).subscribe({
        next: () => {
          console.log(`Commande ${updatedOrder.numeroCommande} mise à jour avec succès.`);
        },
        error: (err: any) => {
          console.error(`Erreur mise à jour commande ${item.id} :`, err);
        }
      });
    });

    // Afficher une alerte de succès
    this.succeAlert.successAlert('Commande ' + orderNummer + ' avec le montant de : ' + this.total + ' € passée avec succès !');

    // Réinitialiser le panier
    this.cartItems = [];
    this.calculateTotals();
    this.cartItemCount = 0;
    this.adresseLivraison = ''; // Réinitialiser l'adresse de livraison

    // Rediriger vers le dashboard
    this.router.navigate(['/dashboard']);
  }
}