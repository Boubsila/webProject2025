import { SuccessAlertService } from './../../../Authentification/alerts/success-alert.service';
import { ErreurAlertService } from './../../../Authentification/alerts/erreur-alert.service';
import { AuthService } from './../../../Authentification/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-commande-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande-client.component.html',
  styleUrls: ['./commande-client.component.css']
})
export class CommandeClientComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  user: string | null = null;

  colors = [
    'rgba(227, 242, 253, 0.5)',
    'rgba(255, 248, 225, 0.5)',
    'rgba(241, 248, 233, 0.5)',
    'rgba(252, 228, 236, 0.5)',
    'rgba(232, 245, 233, 0.5)',
    'rgba(255, 243, 224, 0.5)'
  ];

  borderColors = [
    '#2196F3',
    '#FFC107',
    '#4CAF50',
    '#E91E63',
    '#00E676',
    '#FF9800'
  ];

  constructor(
    private router: Router,
    private orderService: OrderService,
    private AuthService: AuthService,
    private ErreurAlertService: ErreurAlertService,
    private SuccessAlertService: SuccessAlertService,
  ) {}

  ngOnInit(): void {
    this.user = this.AuthService.getUserName();
    this.getClientOrders();
  }

  // Cette méthode récupère les commandes du client
  getClientOrders() {
    if (this.user) {
      this.orderService.getOrders().subscribe({
        next: (data: any[]) => {
          const clientOrders = data.filter(item => item.clientName === this.user && item.isOrderd);
          const ordersGrouped: { [key: string]: any } = {};

          // Regroupement des commandes par numéro de commande et artisan
          clientOrders.forEach(item => {
            const orderKey = `${item.numeroCommande}_${item.artisanName}`;

            if (!ordersGrouped[orderKey]) {
              ordersGrouped[orderKey] = {
                orderNumber: item.numeroCommande,
                orderDate: item.dateCommande,
                status: item.statut,
                items: [],
                subtotal: 0,
                totalQuantity: 0,
                artisanName: item.artisanName,
                shippingAddress: item.adresseLivraison || 'Adresse inconnue'
              };
            }

            const itemTotal = item.prix * item.quantite;
            ordersGrouped[orderKey].items.push({
              productName: item.produitName,
              quantity: item.quantite,
              unitPrice: item.prix
            });

            ordersGrouped[orderKey].subtotal += itemTotal;
            ordersGrouped[orderKey].totalQuantity += item.quantite;
          });

          this.orders = Object.values(ordersGrouped).sort((a, b) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          );
        },
        error: (error: any) => {
          this.ErreurAlertService.erreurAlert('Erreur lors de la récupération des commandes.');
        }
      });
    } else {
      this.ErreurAlertService.erreurAlert('Nom d\'utilisateur non trouvé.');
      this.orders = [];
    }
  }

  // Cette méthode groupe les commandes par numéro de commande
  getOrderGroups() {
    const groups: { [key: string]: any[] } = {};

    this.orders.forEach(order => {
      if (!groups[order.orderNumber]) {
        groups[order.orderNumber] = [];
      }
      groups[order.orderNumber].push(order);
    });

    return Object.values(groups);
  }

  // Cette méthode définit la couleur de fond des groupes de commandes
  getGroupBackgroundColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  // Cette méthode définit la couleur de bordure des groupes de commandes
  getGroupBorderColor(index: number): string {
    return this.borderColors[index % this.borderColors.length];
  }

  // Cette méthode calcule le total d'un groupe de commandes
  getGroupTotal(group: any[]): number {
    return group.reduce((total, order) => total + order.subtotal, 0);
  }

  // Navigue vers le tableau de bord
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // Affiche les détails d'une commande dans un modal
  viewOrderDetails(order: any) {
    this.selectedOrder = { ...order };
    this.openModal('orderDetailsModal');
  }

  // Ouvre un modal en fonction de l'ID
  openModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  // Ferme le modal et réinitialise les détails de la commande sélectionnée
  closeModal() {
    const modal = document.getElementById('orderDetailsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.selectedOrder = null;
  }
}
