import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-avis-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './avis-client.component.html',
  styleUrl: './avis-client.component.css'
})
export class AvisClientComponent implements OnInit {
  orders: any= [
    {
      orderNumber: 'ORD123',
      orderDate: new Date(),
      items: [
        { id: 1, name: 'Produit A', rating: 0, comment: '' },
        { id: 2, name: 'Produit B', rating: 0, comment: '' },
      ],
    },
    {
      orderNumber: 'ORD456',
      orderDate: new Date(),
      items: [{ id: 3, name: 'Produit C', rating: 0, comment: '' }],
    },
  ];


  constructor(private router: Router) {}

  ngOnInit(): void {
    // Récupérer les commandes du client (API)
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  setRating(rating: number, orderIndex: number, itemIndex: number) {
    this.orders[orderIndex].items[itemIndex].rating = rating;
  }

  getRating(orderIndex: number, itemIndex: number): number {
    return this.orders[orderIndex].items[itemIndex].rating;
  }

  submitReview(orderIndex: number, itemIndex: number) {
    const item = this.orders[orderIndex].items[itemIndex];
    if (item.rating > 0 && item.comment) {
      // Envoyer l'avis (API)
      console.log('Avis envoyé :', item);
      // Réinitialiser le formulaire (facultatif - ne pas réinitialiser ici pour permettre la modification)
      // item.rating = 0;
      // item.comment = '';
    } else {
      console.log('Veuillez remplir tous les champs.');
    }
  }
}