import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Authentification/auth.service';
import { OrderService } from '../../../services/order.service';
import { ErreurAlertService } from '../../../Authentification/alerts/erreur-alert.service';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesComponent implements OnInit {
  orders: any[] = [];
  groupedOrders: any[] = [];
  selectedOrder: any = null;
  currentUser: string = '';
  isLoading: boolean = true;
  errorMessage: string = '';
  searchTerm: string = '';

  statusColors: any = {
    'Prêt au ramassage': 'warning',
    'Prélevé': 'info',
    'En cours de livraison': 'primary',
    'Annulée': 'danger',
    'Livré': 'success'
  };

  constructor(
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService,
    private erreurAlertService : ErreurAlertService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getUserName();
    this.loadDeliveryPersonOrders();
  }

  loadDeliveryPersonOrders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.orderService.getOrders().subscribe({
      next: (apiOrders: any[]) => {
        const groupedByCommande: { [key: string]: any[] } = {};
        apiOrders.forEach(order => {
          if (!groupedByCommande[order.numeroCommande]) {
            groupedByCommande[order.numeroCommande] = [];
          }
          groupedByCommande[order.numeroCommande].push(order);
        });

        const filteredGroups = Object.values(groupedByCommande).filter(group => {
          const statut = group[0].statut;
          const assignedToCurrentUser = group.some(order => order.livreurName === this.currentUser);
          return (
            (statut === 'Prêt au ramassage' ||
              statut === 'Prélevé' ||
              statut === 'En cours de livraison' ||
              statut === 'Livré')
            && assignedToCurrentUser
          );
        });

        this.groupedOrders = filteredGroups.map(group => {
          const first = group[0];
          return {
            orderNumber: first.numeroCommande,
            orderDate: first.dateCommande,
            status: first.statut,
            items: group.map(order => ({
              productId: order.produitId,
              productName: order.produitName,
              quantity: order.quantite,
              unitPrice: order.prix
            })),
            totalPrice: group.reduce((sum, o) => sum + o.prix * o.quantite, 0),
            totalQuantity: group.reduce((sum, o) => sum + o.quantite, 0),
            artisanName: first.artisanName,
            clientName: first.clientName,
            shippingAddress: first.adresseLivraison,
            pickupAddress: first.adresseDenlevement || '',
            deliveryPerson: first.livreurName || '',
            dateLivraison: first.dateLivraison || ''
          };
        });

        this.orders = [...this.groupedOrders];

        if (this.orders.length === 0) {
          this.errorMessage = 'Aucune commande expédiée trouvée pour ce livreur.';
        }

        this.isLoading = false;
      },
        error: (err: any) => {
      if (err.status === 0) {
        this.erreurAlertService.erreurAlert('Impossible de joindre le serveur');
      } else if (err.status === 404) {
        this.erreurAlertService.erreurAlert('Aucune commande trouvée');
      } else if (err.status === 500) {
        this.erreurAlertService.erreurAlert('Erreur interne du serveur');
      } else {
        this.erreurAlertService.erreurAlert('Erreur inconnue');
      }
      this.isLoading = false;
    }
  });
}



  filterOrders(): void {
    if (!this.searchTerm) {
      this.orders = [...this.groupedOrders];
    } else {
      this.orders = this.groupedOrders.filter(order =>
        order.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.clientName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.artisanName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  viewOrderDetails(order: any): void {
    this.selectedOrder = { ...order };
    this.openModal('orderDetailsModal');
  }

  updateOrderStatus(order: any): void {
    this.selectedOrder = { ...order };
    this.openModal('updateStatusModal');
  }

  saveOrderStatus(): void {
    if (!this.selectedOrder) return;

    if (this.selectedOrder.status === 'Prêt au ramassage') {
      if (!this.selectedOrder.pickupAddress || !this.selectedOrder.deliveryPerson) {
        alert('Veuillez spécifier une adresse d\'enlèvement et un livreur');
        return;
      }

      this.orderService.addpickupAddress(
        this.selectedOrder.orderNumber,
        this.selectedOrder.pickupAddress,
        this.selectedOrder.deliveryPerson
      ).subscribe({
        next: () => {
          console.log('Adresse et livreur enregistrés');
        },
        error: (err: any) => {
          console.error('Erreur:', err);
        }
      });
    }

    this.orderService.updateOrderStatusMulti(
      this.selectedOrder.orderNumber,
      this.selectedOrder.artisanName,
      this.selectedOrder.status
    ).subscribe({
      next: () => {
        this.loadDeliveryPersonOrders();
        this.closeModal();
      },
      error: (err: any) => {
      if (err.status === 0) {
        this.erreurAlertService.erreurAlert('Impossible de joindre le serveur');
      } else if (err.status === 400) {
        this.erreurAlertService.erreurAlert('Données invalides');
      } else if (err.status === 404) {
        this.erreurAlertService.erreurAlert('Commande non trouvée');
      } else if (err.status === 500) {
        this.erreurAlertService.erreurAlert('Erreur interne du serveur');
      } else {
        this.erreurAlertService.erreurAlert('Erreur inconnue');
      }
    }
  });
}


  openModal(modalId: string): void {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeModal(): void {
    ['orderDetailsModal', 'updateStatusModal'].forEach(id => {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      }
    });
    document.body.classList.remove('modal-open');
    this.selectedOrder = null;
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  getStatusColor(status: string): string {
    return this.statusColors[status] || 'secondary';
  }
}