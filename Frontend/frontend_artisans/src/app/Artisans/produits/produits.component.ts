import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-produits',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './produits.component.html',
    styleUrl: './produits.component.css'
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

    produits: any[] = [];
    produitsFiltres: any[] = [];
    categorieSelectionnee: string = '';
    //client: any = { id: 1, nom: 'Nom du client', email: 'email@client.com' };

    constructor(private productService: ProductService, private http: HttpClient) { }

    ngOnInit(): void {
        this.chargerProduits();
    }

    chargerProduits(): void {
        this.productService.getProducts().subscribe(
            (data: any[]) => {
                this.produits = data.map(produit => ({
                    id: produit.id,
                    nom: produit.nom,
                    description: produit.description,
                    prix: produit.prix,
                    categorie: produit.categorie,
                    url: produit.image || 'assets/images/default-product.jpg', // Image par défaut si non fournie
                    quantite: produit.quantite || 0,
                    artisan: produit.artisan || '',
                    statut: produit.statut || 'pending'
                }));
                this.filtrerParCategorie(this.categories[0]);
            },
            (error: any) => {
                console.error('Erreur lors du chargement des produits', error);
            }
        );
    }

    filtrerParCategorie(categorie: string): void {
        this.categorieSelectionnee = categorie;
        if (!this.produits.length) return;

        if (categorie === 'Autres') {
            this.produitsFiltres = this.produits.filter(produit =>
                !this.categories.slice(0, 6).includes(produit.categorie)
            );
        } else {
            this.produitsFiltres = this.produits.filter(produit => produit.categorie === categorie);
        }
    }

    commanderProduit(produit: any): void {
        const commande = {
            produitId: produit.id,
            clientId: 1, // Remplacez par l'ID du client connecté ',
            quantite: 1,
            dateCommande: new Date()
        };

        this.http.post('URL_DE_VOTRE_BACKEND/commandes', commande)
            .pipe(
                catchError(error => {
                    console.error('Erreur lors de l\'envoi de la commande', error);
                    return throwError(error);
                })
            )
            .subscribe(
                response => {
                    console.log('Commande envoyée avec succès', response);
                }
            );
    }
    
    ajouterAuPanier(produit: any): void {
        console.log('Produit ajouté au panier :', produit);
    }
}