import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Authentification/auth.service';
import { OrderService } from '../../../services/order.service';

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
    'En attente': 'warning',
    'En cours de traitement': 'info',
    'Prêt au ramassage': 'primary',
    'Annulée': 'danger',
    'Livrée': 'success'
  };

  constructor(
    private router: Router,
    private orderService: OrderService,
    private authService: AuthService
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
          return statut === 'Prêt au ramassage' && assignedToCurrentUser;
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
        console.error('Erreur lors du chargement des commandes:', err);
        this.errorMessage = 'Erreur lors du chargement des commandes. Veuillez réessayer plus tard.';
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
        console.error('Erreur:', err);
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