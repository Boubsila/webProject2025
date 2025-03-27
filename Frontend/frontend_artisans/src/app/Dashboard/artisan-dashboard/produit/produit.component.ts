import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produit.component.html',
  styleUrl: './produit.component.css'
})
export class ProduitComponent implements OnInit {
  products: any[] = [
    { id: 1, name: 'Produit 1', description: 'Description 1', price: 25, imageUrl: '/images/1.jpg', status: 'approved' },
    { id: 2, name: 'Produit 2', description: 'Description 2', price: 30, imageUrl: '/images/2.jpg', status: 'pending' },
    { id: 3, name: 'Produit 3', description: 'Description 3', price: 40, imageUrl: '/images/3.jpg', status: 'rejected' }
  ];

  selectedProduct: any = { name: '', description: '', price: 0, imageUrl: '', status: 'pending' };
  selectedFile: File | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Récupérer les produits de l'artisan (API)
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  openAddProductModal() {
    this.selectedProduct = { name: '', description: '', price: 0, imageUrl: '', status: 'pending' };
    this.selectedFile = null;
    this.openModal();
  }

  openEditProductModal(product: any) {
    this.selectedProduct = { ...product };
    this.selectedFile = null;
    this.openModal();
  }

  saveProduct() {
    if (this.selectedProduct.id) {
      // Mettre à jour le produit existant (API)
      const index = this.products.findIndex(p => p.id === this.selectedProduct.id);
      if (index !== -1) {
        this.products[index] = { ...this.selectedProduct };
      }
    } else {
      // Ajouter un nouveau produit (API)
      this.selectedProduct.id = this.products.length + 1;
      this.products.push({ ...this.selectedProduct });
    }
    this.closeModal();
  }

  deleteProduct(productId: number) {
    // Supprimer le produit (API)
    this.products = this.products.filter(p => p.id !== productId);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedProduct.imageUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  openModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
  }

    closeModalFromButton() { // nouvelle fonction pour fermer la modal
      this.closeModal();
    }
}