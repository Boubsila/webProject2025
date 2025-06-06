import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Authentification/auth.service';
import { SuccessAlertService } from '../../../Authentification/alerts/success-alert.service';
import { OrderService } from '../../../services/order.service';
import { ErreurAlertService } from '../../../Authentification/alerts/erreur-alert.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent implements OnInit {
  cartItems: any[] = [];
  cartItemCount: number = 0;
  avaibleQuantity: number = 0;
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

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToCatalog(): void {
    this.router.navigate(['/produits']);

  }


  validateQuantity(item: any): void {
    if (item.quantity < 1) {
      item.quantity = 1;
    } else if (item.quantity > item.avaibleQuantity) {
      item.quantity = item.avaibleQuantity;
      
      this.erreurAlert.erreurAlert('La quantité demandée est supérieure à la quantité disponible !');
    }
    this.calculateTotal();
  }

  increaseQuantity(item: any): void {
    if (item.quantity < item.avaibleQuantity) {
      item.quantity++;
      this.calculateTotal();
    } else {
      console.log(item.avaibleQuantity)
      this.erreurAlert.erreurAlert('La quantité demandée est supérieure à la quantité disponible !');
    }
  }

  decreaseQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotal();
    }
  }

  getcartItems(): void {
    this.orderService.getOrders().subscribe({
      next: (data: any[]) => {
        const commandesNonValidees = data.filter((item: any) => !item.isOrderd);

        this.cartItems = commandesNonValidees.map((item: any) => ({
          id: item.id,
          produitId: item.produitId,
          name: item.produitName,
          avaibleQuantity: item.quantite,
          quantity: 1,
          unitPrice: item.prix,
          numeroCommande: item.numeroCommande,
          artisanName: item.artisanName,
          clientName: item.clientName,
          livreurName: item.livreurName,
          dateLivraison: item.dateLivraison
        }));

        this.cartItemCount = this.cartItems.length;
        this.calculateTotal();
      },
      error: (error: any) => {
        if (error.status === 404) {
          this.erreurAlert.erreurAlert('Aucun produit dans le panier');
        } else {
          this.erreurAlert.erreurAlert('Erreur lors du chargement du panier');
        }
      }

    });
  }

  removeFromCart(item: any): void {
    this.orderService.deleteOrderCart(item.id).subscribe({
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

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }

  Commander(): void {
    if (this.cartItems.length === 0 || !this.adresseLivraison) {
      this.erreurAlert.erreurAlert('Veuillez vérifier votre panier et votre adresse de livraison');
      return;
    }

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
    let hasError = false;

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
        adresseLivraison: this.adresseLivraison,
        dateLivraison: item.dateLivraison || '',
      };
      

      this.orderService.updateOrder(updatedOrder).subscribe({
        next: () => {
          this.productService.updateQuantity(item.produitId, item.quantity).subscribe({
            next: () => {
              processedCount++;
              if (processedCount === this.cartItems.length && !hasError) {
                this.handleOrderSuccess(orderNummer);
              }
            },
            error: () => {
              hasError = true;
              this.erreurAlert.erreurAlert(`Erreur lors de la mise à jour de la quantité pour ${item.name}`);
            }
          });
        },
        error: () => {
          hasError = true;
          this.erreurAlert.erreurAlert(`Erreur lors de la mise à jour de la commande pour ${item.name}`);
        }
      });
    });
  }

  private handleOrderSuccess(orderNumber: string): void {
    this.succeAlert.successAlert(
      `Commande ${orderNumber} passée avec succès pour un montant de ${this.total.toFixed(2)} €`
    );
    this.cartItems = [];
    this.calculateTotal();
    this.cartItemCount = 0;
    this.adresseLivraison = '';
    this.router.navigate(['/dashboard']);
  }
}