import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';
import { tap } from 'rxjs/operators'; // Importez l'opérateur tap pour le débogage

@Component({
  selector: 'app-commande-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commande-client.component.html',
  styleUrl: './commande-client.component.css'
})
export class CommandeClientComponent implements OnInit {
  orders: any[] = []; // Tableau pour stocker les commandes regroupées
  selectedOrder: any = null; // Utilisé pour stocker la commande sélectionnée pour afficher les détails

  constructor(private router: Router, private orderService: OrderService) { }

  ngOnInit(): void {
    // Récupérer l'historique des commandes du client (API) au chargement du composant
    this.getOrderedItems();
  }

  getOrderedItems() {
    this.orderService.getOrders().pipe(
      tap(data => console.log('Données brutes reçues de l\'API :', data)) // Log des données brutes pour le débogage
    ).subscribe((data: any[]) => {
      // Filtrer uniquement les éléments marqués comme ayant été commandés (isOrderd à true)
      const commandesValidees = data.filter((item: any) => item.isOrderd);
      console.log('Commandes validées (isOrderd à true) :', commandesValidees); // Log des commandes filtrées

      // Utiliser un objet pour regrouper les produits par numéro de commande
      const commandesGrouped: { [key: string]: any } = {};

      // Parcourir les commandes validées pour les regrouper
      commandesValidees.forEach((item: any) => {
        const numeroCommande = item.numeroCommande;
        // Si un groupe pour ce numéro de commande n'existe pas, le créer
        if (!commandesGrouped[numeroCommande]) {
          commandesGrouped[numeroCommande] = {
            orderNumber: numeroCommande,
            orderDate: item.dateCommande,
            status: item.statut,
            items: [], // Tableau pour stocker les produits de cette commande
            totalPrice: 0,
            totalQuantity: 0,
            artisanName: item.artisanName,
            shippingAddress: item.adresseLivraison || 'Adresse inconnue',
          };
        }
        // Ajouter l'item actuel au tableau des items de la commande correspondante
        commandesGrouped[numeroCommande].items.push({
          productName: item.produitName,
          quantity: item.quantite,
          unitPrice: item.prix,
        });
        // Mettre à jour le prix total et la quantité totale de la commande
        commandesGrouped[numeroCommande].totalPrice += item.prix * item.quantite;
        commandesGrouped[numeroCommande].totalQuantity += item.quantite;
      });

      console.log('Commandes regroupées par numeroCommande :', commandesGrouped); // Log des commandes regroupées

      // Convertir l'objet de commandes regroupées en un tableau pour l'affichage
      this.orders = Object.values(commandesGrouped).map(order => {
        // Ajouter les frais de port si le prix total est inférieur à 100
        if (order.totalPrice < 100) {
          order.totalPrice += 5;
        }
        return order;
      });

      console.log('Tableau final des commandes à afficher :', this.orders); // Log du tableau final des commandes
    }, (error: any) => {
      console.error('Erreur lors de la récupération des commandes:', error);
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  viewOrderDetails(order: any) {
    // Lorsqu'on clique sur le bouton "Détails", on stocke la commande sélectionnée
    this.selectedOrder = { ...order };
    // Et on ouvre la modal
    this.openModal();
  }

  openModal() {
    // Méthode pour afficher la modal des détails de la commande
    const modal = document.getElementById('orderDetailsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeModal() {
    // Méthode pour fermer la modal des détails de la commande
    const modal = document.getElementById('orderDetailsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    // Réinitialiser la commande sélectionnée après la fermeture de la modal
    this.selectedOrder = null;
  }
}