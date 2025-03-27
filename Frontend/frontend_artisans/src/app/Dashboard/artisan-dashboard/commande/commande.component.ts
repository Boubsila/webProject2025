import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande.component.html',
  styleUrl: './commande.component.css'
})
export class CommandeComponent implements OnInit {
  orders: any[] = [
    {
      orderNumber: 'ORD123',
      customerName: 'Client A',
      orderDate: new Date(),
      status: 'pending',
      items: [{ productName: 'Produit X', quantity: 2, unitPrice: 25 }],
      shippingAddress: 'Adresse A'
    },
    {
      orderNumber: 'ORD456',
      customerName: 'Client B',
      orderDate: new Date(),
      status: 'processing',
      items: [{ productName: 'Produit Y', quantity: 1, unitPrice: 30 }],
      shippingAddress: 'Adresse B'
    },
    {
      orderNumber: 'ORD789',
      customerName: 'Client C',
      orderDate: new Date(),
      status: 'shipped',
      items: [{ productName: 'Produit Z', quantity: 3, unitPrice: 40 }],
      shippingAddress: 'Adresse C'
    }
  ];

  selectedOrder: any = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Récupérer les commandes de l'artisan (API)
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
    // Mettre à jour le statut de la commande (API)
    const index = this.orders.findIndex(o => o.orderNumber === this.selectedOrder.orderNumber);
    if (index !== -1) {
      this.orders[index] = { ...this.selectedOrder };
    }
    this.closeModal();
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