import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../Authentification/auth.service';
import { SuccessAlertService } from '../../Authentification/alerts/success-alert.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  categories = [
    'Poterie et Céramique',
    'Tissage et Tapis',
    'Travail du Cuir (Tanneries)',
    'Travail du Bois (Menuiserie et Marqueterie)',
    'Métallurgie et Ferronnerie',
    'Bijouterie et Orfèvrerie',
    'Autres'
  ];

  artisans: string[] = [];
  produits: any[] = [];
  produitsFiltres: any[] = [];

  categorieSelectionnee: string = '';
  artisanSelectionne: string = '';

  constructor(
    private productService: ProductService,
    private successAlert: SuccessAlertService,
    private userName: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.chargerProduits();
    this.chargerArtisans();
  }

  // Charger les produits
  chargerProduits(): void {
    this.productService.getProducts().subscribe(
      (data: any[]) => {
        this.produits = data
          .filter(p => p.statut === 'approved')
          .map(p => ({
            id: p.id,
            nom: p.nom,
            description: p.description,
            prix: p.prix,
            categorie: p.categorie,
            url: p.image,
            quantite: p.quantite || 0,
            ArtisanName: p.artisanName,
            statut: p.statut || 'pending'
          }));

        // Définir la catégorie par défaut si elle n'est pas déjà sélectionnée
        if (!this.categorieSelectionnee && this.categories.length > 0) {
          this.categorieSelectionnee = this.categories[0];
        }

        // Appliquer le filtre par catégorie et artisan
        this.filtrerProduits();
      },
      (error: any) => console.error('Erreur chargement produits', error)
    );
  }

  // Charger les artisans
  chargerArtisans(): void {
    this.userName.getAllUsers().subscribe(
      (users: any[]) => {
        const artisansFiltrés = users.filter(u => u.role === 'artisan');
        this.artisans = artisansFiltrés.map(u => u.username);

        if (this.artisans.length > 0) {
          this.artisanSelectionne = this.artisans[0];
        }

        this.filtrerProduits();
      },
      error => console.error('Erreur chargement artisans', error)
    );
  }

  // Filtrer les produits par catégorie et artisan
  filtrerProduits(): void {
    this.produitsFiltres = this.produits.filter(produit =>
      (this.categorieSelectionnee === 'Autres'
        ? !this.categories.slice(0, 6).includes(produit.categorie)
        : produit.categorie === this.categorieSelectionnee) &&
      produit.ArtisanName === this.artisanSelectionne
    );
  }

  // Ajouter un produit au panier
  ajouterAuPanier(produit: any): void {
    const commande = {
      id: 0,
      produitId: produit.id,
      produitName: produit.nom,
      artisanName: produit.ArtisanName,
      clientName: this.userName.getUserName(),
      livreurName: '',
      dateCommande: new Date().toISOString(),
      statut: 'pending',
      isOrderd: false,
      quantite: 1,
      prix: produit.prix,
      adresseLivraison: '',
      dateLivraison: ''
    };

    this.http.post('https://localhost:7128/api/Commande/addOrder', commande)
      .pipe(
        catchError(error => {
          console.error('Erreur ajout commande', error);
          return throwError(error);
        })
      )
      .subscribe(() => {
        this.successAlert.successAlert(`${produit.nom} ajouté au panier avec succès!`);
      });
  }
}
