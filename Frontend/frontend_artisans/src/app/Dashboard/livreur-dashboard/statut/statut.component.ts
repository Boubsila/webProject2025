import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-statut',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './statut.component.html',
  styleUrl: './statut.component.css'
})
export class StatutComponent implements OnInit {
  orders: any[] = [
    {
      orderNumber: 'ORD123',
      orderDate: new Date(),
      deliveryStatus: 'pending pickup'
    },
    {
      orderNumber: 'ORD456',
      orderDate: new Date(),
      deliveryStatus: 'in transit'
    },
    {
      orderNumber: 'ORD789',
      orderDate: new Date(),
      deliveryStatus: 'delivered'
    }
  ];

  selectedOrder: any = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Récupérer les commandes assignées au livreur (API)
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  updateDeliveryStatus(order: any) {
    this.selectedOrder = { ...order };
    this.openModal();
  }

  saveDeliveryStatus() {
    // Mettre à jour le statut de livraison (API)
    const index = this.orders.findIndex(o => o.orderNumber === this.selectedOrder.orderNumber);
    if (index !== -1) {
      this.orders[index] = { ...this.selectedOrder };
    }
    this.closeModal();
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