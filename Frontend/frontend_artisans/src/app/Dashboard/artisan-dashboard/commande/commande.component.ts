import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Authentification/auth.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  user: any = null;
  totalSales: number = 0;
  today: Date = new Date();
  constructor(
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUserName();
    console.log(this.user);
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrdersByArtisan(this.user).subscribe({
      next: (data: any[]) => {
        this.orders = this.processOrders(data);
        this.calculateTotalSales();
      },
      error: (err: any) => {
        console.error('Erreur lors de la récupération des commandes :', err);
      }
    });
  }

  processOrders(data: any[]): any[] {
    const processedOrders: any[] = [];

    data.forEach((item: any) => {
      const orderKey = `${item.numeroCommande}_${item.artisanName}`;

      let existingOrder = processedOrders.find(o => o.orderKey === orderKey);

      if (!existingOrder) {
        existingOrder = {
          orderKey: orderKey,
          orderNumber: item.numeroCommande,
          orderDate: item.dateCommande,
          status: item.statut,
          items: [],
          totalPrice: 0,
          totalQuantity: 0,
          artisanName: item.artisanName,
          shippingAddress: item.adresseLivraison || 'Adresse inconnue',
          clientName: item.clientName || 'Client inconnu',
        };
        processedOrders.push(existingOrder);
      }

      existingOrder.items.push({
        productName: item.produitName,
        quantity: item.quantite,
        unitPrice: item.prix
      });

      existingOrder.totalPrice += item.prix * item.quantite;
      existingOrder.totalQuantity += item.quantite;
    });

    return processedOrders;
  }

  calculateTotalSales(): void {
    this.totalSales = this.orders.reduce((total, order) => {
      if (order.status !== 'Annulée') {
        return total + order.totalPrice;
      }
      return total;
    }, 0);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  viewOrderDetails(order: any) {
    this.selectedOrder = { ...order };
    this.openModal('orderDetailsModal');
  }

  updateOrderStatus(order: any) {
    this.selectedOrder = { ...order };
    this.openModal('updateStatusModal');
  }

  saveOrderStatus() {
    if (this.selectedOrder && this.selectedOrder.status) {
      this.orderService.updateOrderStatusMulti(
        this.selectedOrder.orderNumber,
        this.selectedOrder.artisanName,
        this.selectedOrder.status
      ).subscribe({
        next: () => {
          const index = this.orders.findIndex(o => o.orderKey === this.selectedOrder.orderKey);
          if (index !== -1) {
            this.orders[index].status = this.selectedOrder.status;
          }
          this.calculateTotalSales();
          this.closeModal();
        },
        error: (error: any) => {
          console.error('Erreur lors de la mise à jour du statut:', error);
        }
      });
    }
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
    const modals = ['orderDetailsModal', 'updateStatusModal'];
    modals.forEach(id => {
      const modal = document.getElementById(id);
      if (modal && modal.classList.contains('show')) {
        modal.classList.remove('show');
        modal.style.display = 'none';
      }
    });
    document.body.classList.remove('modal-open');
    this.selectedOrder = null;
  }

  getSalesProgress(): number {
    if (!this.orders || this.orders.length === 0) return 0;
    const validOrders = this.orders.filter(o => o.status !== 'Annulée');
    const maxPossible = this.orders.length * 100; // Suppose que chaque commande pourrait valoir 100€ max
    return Math.min((this.totalSales / maxPossible) * 100, 100);
  }

  get validatedOrdersCount(): number {
    return this.orders.filter(o => o.status !== 'Annulée').length;
  }
  
  get averageOrderValue(): number {
    const validOrders = this.orders.filter(o => o.status !== 'Annulée');
    return validOrders.length > 0 ? this.totalSales / validOrders.length : 0;
  }

  
  
  get cancelledOrdersCount(): number {
    return this.orders.filter(o => o.status === 'Annulée').length;
  }
  
  
}