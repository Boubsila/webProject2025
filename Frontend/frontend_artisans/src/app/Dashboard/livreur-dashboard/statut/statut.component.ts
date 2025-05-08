import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-statut',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statut.component.html',
  styleUrls: ['./statut.component.css']
})
export class StatutComponent implements OnInit {
  orders: any[] = [
    {
      orderNumber: 'ORD123',
      customerName: 'Jean Dupont',
      orderDate: new Date('2023-05-15'),
      deliveryAddress: '12 Rue de la Paix, Paris',
      deliveryStatus: 'pending pickup',
      estimatedDelivery: new Date('2023-05-20')
    },
    {
      orderNumber: 'ORD456',
      customerName: 'Marie Lambert',
      orderDate: new Date('2023-05-16'),
      deliveryAddress: '34 Avenue des Champs, Lyon',
      deliveryStatus: 'in transit',
      estimatedDelivery: new Date('2023-05-22')
    },
    {
      orderNumber: 'ORD789',
      customerName: 'Pierre Martin',
      orderDate: new Date('2023-05-17'),
      deliveryAddress: '56 Boulevard Voltaire, Marseille',
      deliveryStatus: 'delivered',
      estimatedDelivery: new Date('2023-05-23')
    }
  ];

  statusOptions = [
    { value: 'pending pickup', label: 'En attente de ramassage', color: 'warning' },
    { value: 'in transit', label: 'En cours de livraison', color: 'info' },
    { value: 'delivered', label: 'Livré', color: 'success' },
    { value: 'delayed', label: 'Retardé', color: 'danger' }
  ];

  selectedOrder: any = null;
  searchTerm: string = '';
  filteredOrders: any[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.filteredOrders = [...this.orders];
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  updateDeliveryStatus(order: any) {
    this.selectedOrder = { ...order };
    this.openModal();
  }

  saveDeliveryStatus() {
    const index = this.orders.findIndex(o => o.orderNumber === this.selectedOrder.orderNumber);
    if (index !== -1) {
      this.orders[index] = { ...this.selectedOrder };
      
      // Si le statut est "livré", mettre à jour la date de livraison
      if (this.selectedOrder.deliveryStatus === 'delivered') {
        this.orders[index].deliveryDate = new Date();
      }
    }
    this.filterOrders();
    this.closeModal();
  }

  filterOrders() {
    if (!this.searchTerm) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => 
        order.orderNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.deliveryStatus.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  getStatusLabel(statusValue: string): string {
    const status = this.statusOptions.find(s => s.value === statusValue);
    return status ? status.label : statusValue;
  }

  getStatusColor(statusValue: string): string {
    const status = this.statusOptions.find(s => s.value === statusValue);
    return status ? status.color : 'secondary';
  }

  openModal() {
    const modal = document.getElementById('updateStatusModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeModal() {
    const modal = document.getElementById('updateStatusModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.selectedOrder = null;
  }
}