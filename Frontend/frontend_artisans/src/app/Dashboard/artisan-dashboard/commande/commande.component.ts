import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Authentification/auth.service';
import { OrderService } from '../../../services/order.service';
import { ErreurAlertService } from '../../../Authentification/alerts/erreur-alert.service';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  selectedOrder: any = null;
  user: any = null;
  totalSales: number = 0;
  today: Date = new Date();
  livreurlist: string[] = [];
  searchTerm: string = '';

  statusOptions = [
    { value: 'En attente', label: 'En attente', color: 'warning' },
    { value: 'En traitement', label: 'En traitement', color: 'info' },
    { value: 'Prêt au ramassage', label: 'Prêt au ramassage', color: 'primary' },
    { value: 'Annulée', label: 'Annulée', color: 'danger' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService,
    private erreurAlertService: ErreurAlertService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUserName();
    this.loadOrders();

    this.authService.getAllUsers().subscribe((users: any[]) => {
      this.livreurlist = users
        .filter(user => user.role === 'livreur')
        .map(user => user.username);
    });
  }

  loadOrders(): void {
    this.orderService.getOrdersByArtisan(this.user).subscribe({
      next: (data: any[]) => {
        this.orders = this.processOrders(data);
        this.filteredOrders = [...this.orders];
        this.calculateTotalSales();
      },
      error: (err: any) => {
        if (err.status === 0) {
          this.erreurAlertService.erreurAlert('Impossible de joindre le serveur');
        }
        else if (err.status === 404) {
          this.erreurAlertService.erreurAlert('Aucune commande trouvée');
        } else if (err.status === 500) {
          this.erreurAlertService.erreurAlert('Erreur interne du serveur');
        } else {
          this.erreurAlertService.erreurAlert('Erreur inconnue');
        }
      }
    });
  }


deleteOrder(order: any) {
  if (order && order.orderNumber) {
    this.erreurAlertService.confirmDelete(
      `Voulez-vous vraiment supprimer la commande ${order.orderNumber} ?`,
      () => {
        this.orderService.deleteOrder(order.orderNumber).subscribe({
          next: () => {
            this.orders = this.orders.filter(o => o.orderNumber !== order.orderNumber);
            this.filterOrders();
            this.calculateTotalSales();
          },
          error: (error: any) => {
            if (error.status === 0) {
              this.erreurAlertService.erreurAlert('Impossible de joindre le serveur');
            } else if (error.status === 404) {
              this.erreurAlertService.erreurAlert('Commande non trouvée');
            } else {
              this.erreurAlertService.erreurAlert('Erreur inconnue');
            }
          }
        });
      }
    );
  } else {
    
    this.erreurAlertService.erreurAlert('ID de la commande invalide');
  }
}


  

  filterOrders(): void {
    if (!this.searchTerm) {
      this.filteredOrders = [...this.orders];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredOrders = this.orders.filter(order =>
        order.orderNumber.toLowerCase().includes(term) ||
        order.clientName.toLowerCase().includes(term) ||
        order.artisanName.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term)
      );
    }
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
          status: item.statut === 'Expédiée' ? 'Prêt au ramassage' : item.statut,
          items: [],
          totalPrice: 0,
          totalQuantity: 0,
          artisanName: item.artisanName,
          shippingAddress: item.adresseLivraison || 'Adresse inconnue',
          clientName: item.clientName || 'Client inconnu',
          pickupAddress: item.adresseDenlevement || '',
          livreur: item.livreurName || ''
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
    if (this.selectedOrder.status !== 'Prêt au ramassage') {
      this.selectedOrder.pickupAddress = '';
      this.selectedOrder.livreur = '';
    }
  }

  saveOrderStatus() {
    if (this.selectedOrder && this.selectedOrder.status) {
      if (this.selectedOrder.status === 'Prêt au ramassage') {
        if (!this.selectedOrder.pickupAddress || !this.selectedOrder.livreur) {
          alert('Veuillez saisir une adresse d\'enlèvement et sélectionner un livreur pour les commandes prêtes au ramassage');
          return;
        }

        this.orderService.addpickupAddress(
          this.selectedOrder.orderNumber,
          this.selectedOrder.pickupAddress,
          this.selectedOrder.livreur
        )
          .subscribe({
            next: () => {
              this.updateOrderStatusAfterAddressAdded();
            },
            error: (error: any) => {

              if (error.status === 0) {
                this.erreurAlertService.erreurAlert('Impossible de joindre le serveur');
              }
              else if (error.status === 400) {
                this.erreurAlertService.erreurAlert('Données invalides');
              } else if (error.status === 404) {
                this.erreurAlertService.erreurAlert('Commande non trouvée');
              } else if (error.status === 500) {
                this.erreurAlertService.erreurAlert('Erreur interne du serveur');
              } else {
                this.erreurAlertService.erreurAlert('Erreur inconnue');
              }
            }
          });
      } else {
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
        const index = this.orders.findIndex(o => o.orderKey === this.selectedOrder.orderKey);
        if (index !== -1) {
          this.orders[index].status = this.selectedOrder.status;
          this.orders[index].pickupAddress = this.selectedOrder.pickupAddress;
          this.orders[index].livreur = this.selectedOrder.livreur;
        }
        this.filterOrders();
        this.calculateTotalSales();
        this.closeModal();
      },
      error: (error: any) => {
        if (error.status === 0) {
          this.erreurAlertService.erreurAlert('Impossible de joindre le serveur');
        }
        else if (error.status === 400) {
          this.erreurAlertService.erreurAlert('Données invalides');
        } else if (error.status === 404) {
          this.erreurAlertService.erreurAlert('Commande non trouvée');
        } else if (error.status === 500) {
          this.erreurAlertService.erreurAlert('Erreur interne du serveur');
        } else {
          this.erreurAlertService.erreurAlert('Erreur inconnue');
        }
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

  getStatusColor(status: string): string {
    const statusOption = this.statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.color : 'secondary';
  }

  getStatusLabel(status: string): string {
    const statusOption = this.statusOptions.find(opt => opt.value === status);
    return statusOption ? statusOption.label : status;
  }
}