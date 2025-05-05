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
          pickupAddress: item.adresseDenlevement || ''
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

  onStatusChange() {
    if (this.selectedOrder.status !== 'Expédiée') {
      this.selectedOrder.pickupAddress = '';
    }
  }

  saveOrderStatus() {
    if (this.selectedOrder && this.selectedOrder.status) {
      if (this.selectedOrder.status === 'Expédiée') {
        if (!this.selectedOrder.pickupAddress) {
          
          alert('Veuillez saisir une adresse d\'enlèvement pour les commandes expédiées');
          return;
        }

        // Appel à la nouvelle méthode pour ajouter l'adresse d'enlèvement
        this.orderService.addpickupAddress(
          this.selectedOrder.orderNumber,
          this.selectedOrder.pickupAddress
        ).subscribe({
          next: () => {
            // Mise à jour du statut après l'ajout de l'adresse
            this.updateOrderStatusAfterAddressAdded();
          },
          error: (error: any) => {
            console.error('Erreur lors de l\'ajout de l\'adresse:', error);
            alert('Erreur lors de l\'enregistrement de l\'adresse d\'enlèvement');
          }
        });
      } else {
        // Si le statut n'est pas "Expédiée", mettre à jour normalement
        this.updateOrderStatusAfterAddressAdded();
      }
    }
  }

  private updateOrderStatusAfterAddressAdded() {
    this.orderService.updateOrderStatusMulti(
      this.selectedOrder.orderNumber,
      this.selectedOrder.artisanName,
      this.selectedOrder.status
    ).subscribe({
      next: () => {
        // Mise à jour de l'interface
        const index = this.orders.findIndex(o => o.orderKey === this.selectedOrder.orderKey);
        if (index !== -1) {
          this.orders[index].status = this.selectedOrder.status;
          if (this.selectedOrder.pickupAddress) {
            this.orders[index].pickupAddress = this.selectedOrder.pickupAddress;
          }
        }
        this.calculateTotalSales();
        this.closeModal();
      },
      error: (error:any) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        alert('Erreur lors de la mise à jour du statut');
      }
    });
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