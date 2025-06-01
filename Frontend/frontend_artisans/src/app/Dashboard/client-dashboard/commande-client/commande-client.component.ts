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
  ) { }

  ngOnInit(): void {
    this.user = this.AuthService.getUserName();
    this.getClientOrders();
  }

  getClientOrders() {
    if (this.user) {
      this.orderService.getOrders().subscribe({
        next: (data: any[]) => {
          const clientOrders = data.filter(item => item.clientName === this.user && item.isOrderd);
          const ordersGrouped: { [key: string]: any } = {};

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
          if (error.status === 0) {
            this.ErreurAlertService.erreurAlert('Impossible de joindre le serveur');
          } else if (error.status === 404) {
            this.ErreurAlertService.erreurAlert('Aucune commande trouvée');
          } else if (error.status === 500) {
            this.ErreurAlertService.erreurAlert('Erreur interne du serveur');
          } else {
            this.ErreurAlertService.erreurAlert('Erreur inconnue');
          }
        }
      });
    } else {
      this.ErreurAlertService.erreurAlert('Nom d\'utilisateur non trouvé.');
      this.orders = [];
    }
  }


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

  getGroupBackgroundColor(index: number): string {
    return this.colors[index % this.colors.length];
  }

  getGroupBorderColor(index: number): string {
    return this.borderColors[index % this.borderColors.length];
  }

  getGroupTotal(group: any[]): number {
    return group.reduce((total, order) => total + order.subtotal, 0);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  viewOrderDetails(order: any) {
    this.selectedOrder = { ...order };
    this.openModal('orderDetailsModal');
  }

  openModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeModal() {
    const modal = document.getElementById('orderDetailsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.selectedOrder = null;
  }


  isStatusActive(currentStatus: string, statusToCheck: string): boolean {
    const statusOrder = [
      'En attente',
      'En traitement',
      'Prêt au ramassage',
      'Prélevé',
      'En cours de livraison',
      'Livré'
    ];

    const currentIndex = statusOrder.indexOf(currentStatus);
    const checkIndex = statusOrder.indexOf(statusToCheck);

    return currentIndex >= checkIndex;
  }


  getProgressWidth(status: string): string {
    const statusOrder = [
      'En attente',
      'En traitement',
      'Prêt au ramassage',
      'Prélevé',
      'En cours de livraison',
      'Livré'
    ];

    const currentIndex = statusOrder.indexOf(status);
    const totalSteps = statusOrder.length - 1;

    if (currentIndex <= 0) return '0%';
    if (currentIndex >= totalSteps) return '100%';

    const width = ((currentIndex + 0.2) / totalSteps) * 100;
    return `${width}%`;
  }
  getExpectedDeliveryDate(orderDate: string | Date): Date {
    const order = new Date(orderDate);
    const expected = new Date(order);
    expected.setDate(order.getDate() + 2);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // pour comparaison sans heure
    if (expected < today) {
      return today;
    }
    return expected;
  }


}