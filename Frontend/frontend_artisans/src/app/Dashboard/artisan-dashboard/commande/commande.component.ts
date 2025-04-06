import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Authentification/auth.service';
import { OrderService } from '../../../services/order.service';
import { tap } from 'rxjs/operators'; // Importer l'opérateur tap pour déboguer

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  orders: any[] = []; // Tableau pour stocker les commandes regroupées
  selectedOrder: any = null; // Pour stocker la commande sélectionnée

  user: any = null; // Nom de l'artisan

  constructor(private router: Router, private artisanName: AuthService, private ordersByArtisan: OrderService) { }

  ngOnInit(): void {
    // Récupérer le nom de l'artisan
    this.user = this.artisanName.getUserName();

    // Récupérer les commandes associées à cet artisan
    this.ordersByArtisan.getOrdersByArtisan(this.user).pipe(
      tap(data => console.log('Données reçues de l\'API :', data)) // Log des données pour le débogage
    ).subscribe({
      next: (data: any[]) => {
        // Regrouper les items par numéro de commande
        const commandesGrouped: { [key: string]: any } = {};

        data.forEach((item: any) => {
          const numeroCommande = item.numeroCommande;

          // Si un groupe pour ce numéro de commande n'existe pas, on le crée
          if (!commandesGrouped[numeroCommande]) {
            commandesGrouped[numeroCommande] = {
              orderNumber: numeroCommande,
              orderDate: item.dateCommande,
              status: item.statut,
              items: [], // Tableau pour stocker les produits de cette commande
              totalPrice: 0,
              totalQuantity: 0,
              artisanName: item.artisanName,
              shippingAddress: item.adresseLivraison || 'Adresse inconnue',
            };
          }

          // Ajouter l'item actuel au tableau des items de la commande correspondante
          commandesGrouped[numeroCommande].items.push({
            productName: item.produitName,
            quantity: item.quantite,
            unitPrice: item.prix,
          });

          // Mettre à jour le prix total et la quantité totale de la commande
          commandesGrouped[numeroCommande].totalPrice += item.prix * item.quantite;
          commandesGrouped[numeroCommande].totalQuantity += item.quantite;
        });

        // Convertir l'objet de commandes regroupées en un tableau pour l'affichage
        this.orders = Object.values(commandesGrouped).map(order => {
          // Ajouter les frais de port si le prix total est inférieur à 100
          if (order.totalPrice < 100) {
            order.totalPrice += 5;
          }
          return order;
        });

        console.log('Commandes regroupées :', this.orders); // Log des commandes regroupées
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des commandes :', err);
      }
    });
  }

  // Méthode pour naviguer vers le tableau de bord
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Afficher les détails de la commande
  viewOrderDetails(order: any) {
    this.selectedOrder = { ...order };
    this.openModal('orderDetailsModal');
  }

  // Mise à jour du statut de la commande
  updateOrderStatus(order: any) {
    this.selectedOrder = { ...order };
    this.openModal('updateStatusModal');
  }

  // Sauvegarder le statut de la commande
  saveOrderStatus() {
    const index = this.orders.findIndex(o => o.orderNumber === this.selectedOrder.orderNumber);
    if (index !== -1) {
      this.orders[index] = { ...this.selectedOrder };
    }
    this.closeModal();
  }

  // Ouvrir une modal
  openModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  // Fermer la modal
  closeModal() {
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    const updateStatusModal = document.getElementById('updateStatusModal');

    if (orderDetailsModal && orderDetailsModal.classList.contains('show')) {
      orderDetailsModal.classList.remove('show');
      orderDetailsModal.style.display = 'none';
    }

    if (updateStatusModal && updateStatusModal.classList.contains('show')) {
      updateStatusModal.classList.remove('show');
      updateStatusModal.style.display = 'none';
    }

    document.body.classList.remove('modal-open');
    this.selectedOrder = null;
  }
}
