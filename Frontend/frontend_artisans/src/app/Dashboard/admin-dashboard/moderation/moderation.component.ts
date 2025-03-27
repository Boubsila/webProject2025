import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moderation.component.html',
  styleUrl: './moderation.component.css'
})
export class ModerationComponent implements OnInit {

  urlProduits = 'https://th.bing.com/th/id/OIP.VWalo9NbcK994cYqeV-tDAHaH7?w=171&h=183&c=7&r=0&o=5&dpr=1.4&pid=1.7';

  pendingProducts: any[] = [
    { id: 1, name: 'Produit 1', description: 'Description du produit 1', artisanName: 'Artisan A', status: 'pending', imageUrl: '/images/1.jpg' },
    { id: 2, name: 'Produit 2', description: 'Description du produit 2', artisanName: 'Artisan B', status: 'pending', imageUrl: '/images/2.jpg' },
    ];

  products: any[] = [
    { id: 1, name: 'Produit 1', description: 'Description du produit 1', status: 'approved', imageUrl: '/images/3.jpg' },
    { id: 2, name: 'Produit 2', description: 'Description du produit 2', status: 'pending', imageUrl: '/images/4.jpg' },
    { id: 3, name: 'Produit 3', description: 'Description du produit 3', status: 'approved', imageUrl: '/images/5.jpg' },
    { id: 4, name: 'Produit 4', description: 'Description du produit 4', status: 'pending', imageUrl: '/images/6.jpg' },
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Vous pouvez ajouter ici des appels API pour récupérer les produits
  }

  approveProduct(productId: number): void {
    const product = this.pendingProducts.find(p => p.id === productId);
    if (product) {
      product.status = 'approved';
      this.products.push({ ...product, status: 'approved' }); // Ajoute le produit approuvé à la liste des produits
      this.pendingProducts = this.pendingProducts.filter(p => p.id !== productId); // Retire le produit de la liste des produits en attente
      console.log('Produit approuvé :', productId);
    }
  }

  deleteProduct(productId: number): void {
    this.pendingProducts = this.pendingProducts.filter(p => p.id !== productId);
    this.products = this.products.filter(p => p.id !== productId);
    console.log('Produit supprimé :', productId);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}