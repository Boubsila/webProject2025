import { ErreurAlertService } from './../../Authentification/alerts/erreur-alert.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../Authentification/auth.service';
import { SuccessAlertService } from '../../Authentification/alerts/success-alert.service';
import { FormsModule } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten',
  standalone: true
})
export class ShortenPipe implements PipeTransform {
  transform(value: string | null | undefined, maxLength: number = 50, ellipsis: string = '...'): string {
    if (value == null) return '';
    if (value.length <= maxLength) return value;

    let shortened = value.substring(0, maxLength);
    const lastSpace = shortened.lastIndexOf(' ');

    if (lastSpace > 0) {
      shortened = shortened.substring(0, lastSpace);
    }

    return shortened + ellipsis;
  }
}

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, FormsModule, ShortenPipe],
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
  isLoading: boolean = true;

  categorieSelectionnee: string = '';
  artisanSelectionne: string = '';

  constructor(
    private productService: ProductService,
    private successAlert: SuccessAlertService,
    private ErreurAlertService: ErreurAlertService,
    private authService: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.isLoading = true;
    this.chargerProduits();
    this.chargerArtisans();
  }

  chargerProduits(): void {
    this.productService.getProducts().subscribe({
      next: (data: any[]) => {
        this.produits = data
          .filter(p => p.statut === 'approved')
          .map(p => ({
            id: p.id,
            nom: p.nom,
            description: p.description,
            prix: p.prix,
            categorie: p.categorie,
            url: p.image || 'assets/images/default-product.jpg',
            quantite: p.quantite || 0,
            ArtisanName: p.artisanName || 'Artisan inconnu',
            statut: p.statut
          }));

        if (!this.categorieSelectionnee && this.categories.length > 0) {
          this.categorieSelectionnee = this.categories[0];
        }

        this.filtrerProduits();
      },
      error: (error: any) => {
        if (error.status === 0) {
          this.ErreurAlertService.erreurAlert('Impossible de joindre le serveur');
        } else if (error.status === 404) {
          this.ErreurAlertService.erreurAlert('Aucun produit trouvé');
        } else if (error.status === 500) {
          this.ErreurAlertService.erreurAlert('Erreur interne du serveur');
        } else {
          this.ErreurAlertService.erreurAlert('Erreur inconnue');
        }
      }
    });
  }


  chargerArtisans(): void {
    this.authService.getAllUsers().subscribe({
      next: (users: any[]) => {
        this.artisans = users
          .filter(u => u.role === 'artisan')
          .map(u => u.username);

        if (this.artisans.length > 0 && !this.artisanSelectionne) {
          this.artisanSelectionne = this.artisans[0];
        }

        this.filtrerProduits();
      },
      error: (error: any) => {
        if (error.status === 0) {
          this.ErreurAlertService.erreurAlert('Impossible de joindre le serveur');
        } else if (error.status === 404) {
          this.ErreurAlertService.erreurAlert('Aucun artisan trouvé');
        } else if (error.status === 500) {
          this.ErreurAlertService.erreurAlert('Erreur interne du serveur');
        } else {
          this.ErreurAlertService.erreurAlert('Erreur inconnue');
        }
      }
    });
  }


  filtrerProduits(): void {
    if (!this.categorieSelectionnee || !this.artisanSelectionne) return;

    this.produitsFiltres = this.produits.filter(produit => {
      const matchCategorie = this.categorieSelectionnee === 'Autres'
        ? !this.categories.slice(0, 6).includes(produit.categorie)
        : produit.categorie === this.categorieSelectionnee;

      const matchArtisan = produit.ArtisanName === this.artisanSelectionne;

      return matchCategorie && matchArtisan;
    });
  }

  ajouterAuPanier(produit: any): void {
    if (produit.quantite <= 0) return;

    const commande = {
      id: 0,
      produitId: produit.id,
      produitName: produit.nom,
      artisanName: produit.ArtisanName,
      clientName: this.authService.getUserName(),
      livreurName: '',
      dateCommande: new Date().toISOString(),
      statut: 'pending',
      isOrderd: false,
      quantite: produit.quantite,
      prix: produit.prix,
      adresseLivraison: '',
      dateLivraison: ''
    };



    this.http.post('https://localhost:7128/api/Commande/addOrder', commande)
      .pipe(
        catchError(error => {
          if (error.status === 0) {
            this.ErreurAlertService.erreurAlert('Impossible de joindre le serveur');
          } else if (error.status === 400) {
            this.ErreurAlertService.erreurAlert('Données invalides');
          } else if (error.status === 404) {
            this.ErreurAlertService.erreurAlert('Commande non trouvée');
          } else if (error.status === 500) {
            this.ErreurAlertService.erreurAlert('Erreur interne du serveur');
          } else {
            this.ErreurAlertService.erreurAlert('Erreur inconnue');
          }
          return throwError(() => new Error('Erreur lors de l\'ajout au panier'));
        })
      )

      .subscribe({
        next: () => {

          this.successAlert.successAlert(`✓ "${produit.nom}" ajouté au panier!`);
          this.jouerAnimationAjout(produit.id);
        },
        error: (err) => {
          this.ErreurAlertService.erreurAlert('Erreur lors de l\'ajout au panier');

        }
      });
  }

  private jouerAnimationAjout(productId: number): void {
    const button = document.querySelector(`button[data-product-id="${productId}"]`);
    if (button) {
      button.classList.add('added-to-cart');
      setTimeout(() => button.classList.remove('added-to-cart'), 1000);
    }
  }
}