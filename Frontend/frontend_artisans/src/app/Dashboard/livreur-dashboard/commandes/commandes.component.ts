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
        // Filtrer par livreur
        const filteredOrders = apiOrders.filter(order =>
          order.livreurName === this.currentUser || order.livreurName === ''
        );

        if (filteredOrders.length === 0) {
          this.errorMessage = 'Aucune commande trouvée pour ce livreur';
        }

        this.groupOrdersByNumber(filteredOrders);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des commandes:', err);
        this.errorMessage = 'Erreur lors du chargement des commandes';
        this.isLoading = false;
      }
    });
  }

  groupOrdersByNumber(orders: any[]): void {
    const grouped: { [key: string]: any } = {};

    orders.forEach(order => {
      if (!grouped[order.numeroCommande]) {
        grouped[order.numeroCommande] = {
          orderNumber: order.numeroCommande,
          orderDate: order.dateCommande,
          status: order.statut,
          items: [],
          totalPrice: 0,
          totalQuantity: 0,
          artisanName: order.artisanName,
          clientName: order.clientName,
          shippingAddress: order.adresseLivraison,
          pickupAddress: order.adresseDenlevement || '',
          deliveryPerson: order.livreurName || '',
          dateLivraison: order.dateLivraison || ''
        };
      }

      grouped[order.numeroCommande].items.push({
        productId: order.produitId,
        productName: order.produitName,
        quantity: order.quantite,
        unitPrice: order.prix
      });

      grouped[order.numeroCommande].totalPrice += order.prix * order.quantite;
      grouped[order.numeroCommande].totalQuantity += order.quantite;
    });

    this.groupedOrders = Object.values(grouped);
    this.orders = this.groupedOrders;
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

    if (this.selectedOrder.status === 'Expédiée') {
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
}
