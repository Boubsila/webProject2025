import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-avis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avis.component.html',
  styleUrl: './avis.component.css'
})
export class AvisComponent implements OnInit {
  reviews: any[] = [
    { id: 1, customerName: 'Client X', productName: 'Produit A', rating: 4, comment: 'Bon produit !', response: '' },
    { id: 2, customerName: 'Client Y', productName: 'Produit B', rating: 5, comment: 'Excellent produit !', response: '' },
    { id: 3, customerName: 'Client Z', productName: 'Produit C', rating: 3, comment: 'Produit moyen.', response: '' }
  ];

  selectedReview: any = null;
  response: string = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Récupérer les avis des clients (API)
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  respondToReview(review: any) {
    this.selectedReview = { ...review };
    this.response = review.response || '';
    this.openModal();
  }

  saveResponse() {
    if (this.selectedReview) {
      // Enregistrer la réponse (API)
      this.selectedReview.response = this.response;
      const index = this.reviews.findIndex(r => r.id === this.selectedReview.id);
      if (index !== -1) {
        this.reviews[index] = { ...this.selectedReview };
      }
      this.closeModal();
    }
  }

  getStarArray(rating: number): any[] {
    return Array(rating).fill(0);
  }

  getEmptyStarArray(rating: number): any[] {
    return Array(5 - rating).fill(0);
  }

  openModal() {
    const modal = document.getElementById('respondModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeModal() {
    const modal = document.getElementById('respondModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.selectedReview = null;
    this.response = '';
  }
}