import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SuccessAlertService } from '../../../Authentification/alerts/success-alert.service';
import { ErreurAlertService } from '../../../Authentification/alerts/erreur-alert.service';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moderation.component.html',
  styleUrl: './moderation.component.css'
})
export class ModerationComponent implements OnInit {

  allProducts: any[] = [];

  constructor(private router: Router,private successAlert : SuccessAlertService , private product : ProductService) { }

  
  pendingProducts: number = 0;
  approvedProducts: number = 0;

  ngOnInit(): void {
    this.product.getProducts().subscribe(
      (products: any[]) => {
        this.allProducts = products.map(prod => ({
          id: prod.id,
          nom: prod.nom,
          imageUrl: prod.image,
          artisanName: prod.artisanName,
          categorie: prod.categorie,
          quantite: prod.quantite,
          description: prod.description,
          prix: prod.prix,
          statut: prod.statut ==='approved'? 'approved' : 'pending'
        }));
        
        this.pendingProducts = this.getPendingProducts().length;
        this.approvedProducts = this.getApprovedProducts().length;
        

      },
     
    );
  }

  approveProduct(productId: number): void {
    this.product.changeProductStatus(productId).subscribe(
      () => {
       
        const product = this.allProducts.find(p => p.id === productId);
        if (product) {
          product.statut = 'approved';
        }
        this.pendingProducts = this.getPendingProducts().length;
        this.approvedProducts = this.getApprovedProducts().length;
        this.successAlert.successAlert(`Produit : ${productId} approuvé avec succès !`);
      },
      
    );
  }

  deleteProduct(productId: number): void {
    this.product.deleteProduct(productId).subscribe({
      next: () => {
        
        this.allProducts = this.allProducts.filter(p => p.id !== productId);
  
        this.pendingProducts = this.getPendingProducts().length;
        this.approvedProducts = this.getApprovedProducts().length;
        this.successAlert.successAlert(`Produit : ${productId} supprimé avec succès !`);
      },
      error: (error: unknown) => {
        
        console.error('Erreur lors de la suppression du produit :', error);
        
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  getPendingProducts(): any[] {
    return this.allProducts.filter(p => p.statut === 'pending');
    
  }

  getApprovedProducts(): any[] {
    return this.allProducts.filter(p => p.statut === 'approved');
  }
}