import { AuthService } from './../../../Authentification/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuccessAlertService } from '../../../Authentification/alerts/success-alert.service';
import { OrderService } from '../../../services/order.service';
import { ErreurAlertService } from '../../../Authentification/alerts/erreur-alert.service';
import { ProductService } from '../../../services/product.service';
@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.css'
})
export class PanierComponent implements OnInit {
  cartItems: any[] = [];
  cartItemCount: number = 0;

  total: number = 0;
  adresseLivraison: string = '';

  constructor(
    private router: Router,
    private succeAlert: SuccessAlertService,
    private erreurAlert: ErreurAlertService,
    private orderService: OrderService,
    private AuthService: AuthService,
    private productService: ProductService 
  ) { }

  ngOnInit(): void {
    this.getcartItems();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  increaseQuantity(item: any) {
    item.quantity++;
    this.calculateTotal();
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotal();
    }
  }

  getcartItems() {
    this.orderService.getOrders().subscribe((data: any[]) => {
      const commandesNonValidees = data.filter((item: any) => !item.isOrderd);

      this.cartItems = commandesNonValidees.map((item: any) => {
        return {
          id: item.id,
          produitId: item.produitId,
          name: item.produitName,
          quantity: item.quantite,
          unitPrice: item.prix,
          numeroCommande: item.numeroCommande,
          artisanName: item.artisanName,
          clientName: item.clientName,
          livreurName: item.livreurName,
          dateLivraison: item.dateLivraison
        };
      });

      this.cartItemCount = this.cartItems.length;
      this.calculateTotal();
    }, (error: any) => {
      console.error('Erreur lors de la récupération des éléments du panier:', error);
    });
  }

  removeFromCart(item: any) {
    this.orderService.deleteOrder(item.id).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(i => i.id !== item.id);
        this.calculateTotal();
        this.cartItemCount = this.cartItems.length;
        this.succeAlert.successAlert('Article supprimé avec succès !');
      },
      error: (error: any) => {
        this.erreurAlert.erreurAlert('Erreur lors de la suppression de l\'article !');
      }
    });
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  }

  Commander() {
    const now = new Date();
    const orderNummer = 'ORD' +
      String(now.getDate()).padStart(2, '0') +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getFullYear()).slice(-2) +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');
  
    const dateCommande = now.toISOString();
  
    let processedCount = 0;
  
    this.cartItems.forEach(item => {
      const updatedOrder = {
        id: item.id,
        numeroCommande: item.numeroCommande || orderNummer,
        produitId: item.produitId,
        produitName: item.name,
        artisanName: item.artisanName || '',
        clientName: this.AuthService.getUserName(),
        livreurName: item.livreurName || '',
        dateCommande: dateCommande,
        statut: 'En attente',
        isOrderd: true,
        quantite: item.quantity,
        prix: item.unitPrice,
        adresseLivraison: this.adresseLivraison || '',
        dateLivraison: item.dateLivraison || '',
      };
  
      this.orderService.updateOrder(updatedOrder).subscribe({
        next: () => {
          this.productService.updateQuantity(item.produitId, item.quantity).subscribe({
            next: () => {
              processedCount++;
  
              if (processedCount === this.cartItems.length) {
                // Tout est terminé avec succès
                this.succeAlert.successAlert('Commande ' + orderNummer + ' avec le montant de : ' + this.total + ' € passée avec succès !');
                this.cartItems = [];
                this.calculateTotal();
                this.cartItemCount = 0;
                this.adresseLivraison = '';
                this.router.navigate(['/dashboard']);
              }
            },
            error: () => {
              this.erreurAlert.erreurAlert('Erreur lors de la mise à jour de la quantité pour le produit ' + item.name);
            }
          });
        },
        error: () => {
          this.erreurAlert.erreurAlert('Erreur lors de la mise à jour de la commande pour le produit ' + item.name);
        }
      });
    });
  }
  
}
