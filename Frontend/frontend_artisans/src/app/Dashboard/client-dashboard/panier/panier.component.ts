import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuccessAlertService } from '../../../Authentification/alerts/success-alert.service';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.css'
})
export class PanierComponent implements OnInit {
  cartItems: any[] = [
    { id: 1, productName: 'Produit A', quantity: 2, unitPrice: 25 },
    { id: 2, productName: 'Produit B', quantity: 1, unitPrice: 30 }
  ];
  cartItemCount: number = this.cartItems.length; // Exemple: nombre d'articles dans le panier

  subtotal: number = 0;
  deliveryFee: number = 5;
  total: number = 0;

  constructor(private router: Router,private succeAlert: SuccessAlertService) { }

  ngOnInit(): void {
    this.calculateTotals();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  increaseQuantity(item: any) {
    item.quantity++;
    this.calculateTotals();
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotals();
    }
  }

  removeFromCart(item: any) {
    // Supprimer l'élément du panier (API)
    this.cartItems = this.cartItems.filter(i => i.id !== item.id);
    this.calculateTotals();
  }

  calculateTotals() {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    this.total = this.subtotal + this.deliveryFee;
  }

  proceedToCheckout() {
    // Logique pour procéder au paiement (API)
    this.succeAlert.successAlert('Commande avec le montant de : ' + this.total + ' € passée avec succès !');
    // Réinitialiser le panier après la commande
    this.cartItems = [];
    this.calculateTotals();
    this.cartItemCount = 0; // Réinitialiser le nombre d'articles dans le panier

    
  }
}