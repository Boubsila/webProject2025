import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-commande-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande-client.component.html',
  styleUrl: './commande-client.component.css'
})
export class CommandeClientComponent implements OnInit {
  orders: any[] = [
    {
      orderNumber: 'ORD123',
      orderDate: new Date(),
      status: 'pending',
      items: [{ productName: 'Produit X', quantity: 2, unitPrice: 25 }],
      shippingAddress: 'Adresse A'
    },
    {
      orderNumber: 'ORD456',
      orderDate: new Date(),
      status: 'processing',
      items: [{ productName: 'Produit Y', quantity: 1, unitPrice: 30 }],
      shippingAddress: 'Adresse B'
    },
    {
      orderNumber: 'ORD789',
      orderDate: new Date(),
      status: 'shipped',
      items: [{ productName: 'Produit Z', quantity: 3, unitPrice: 40 }],
      shippingAddress: 'Adresse C'
    }
  ];

  selectedOrder: any = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Récupérer l'historique des commandes du client (API)
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  viewOrderDetails(order: any) {
    this.selectedOrder = { ...order };
    this.openModal();
  }

  openModal() {
    const modal = document.getElementById('orderDetailsModal');
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
}