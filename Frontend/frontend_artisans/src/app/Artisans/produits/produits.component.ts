import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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

    produits = [
        { id: 1, nom: 'Vase en Céramique Tourné à la Main', prix: 85, description: 'Vase unique en céramique, tourné et décoré à la main avec des motifs traditionnels.', url: 'images/1.jpg', categorie: 'Poterie et Céramique' },
        { id: 2, nom: 'Tapis Berbère en Laine Naturelle', prix: 250, description: 'Tapis berbère authentique, tissé à la main avec de la laine naturelle et des motifs géométriques.', url: 'images/2.jpg', categorie: 'Tissage et Tapis' },
        { id: 3, nom: 'Sac à Main en Cuir Véritable', prix: 120, description: 'Sac à main élégant en cuir véritable, tanné et cousu à la main par des artisans locaux.', url: 'images/3.jpg', categorie: 'Travail du Cuir (Tanneries)' },
        { id: 4, nom: 'Table Basse en Bois de Cèdre Sculpté', prix: 350, description: 'Table basse unique en bois de cèdre, sculptée à la main avec des motifs floraux et géométriques.', url: 'images/4.jpg', categorie: 'Travail du Bois (Menuiserie et Marqueterie)' },
        { id: 5, nom: 'Lanterne en Fer Forgé', prix: 180, description: 'Lanterne artisanale en fer forgé, réalisée à la main avec des motifs traditionnels.', url: 'https://m.media-amazon.com/images/I/71b29X149HL._AC_UF894,1000_QL80_.jpg', categorie: 'Métallurgie et Ferronnerie' },
        { id: 6, nom: 'Collier en Argent et Pierres Précieuses', prix: 220, description: 'Collier artisanal en argent, orné de pierres précieuses et réalisé avec des techniques traditionnelles.', url: 'https://m.media-amazon.com/images/I/61NlJ0v46KL._AC_UF894,1000_QL80_.jpg', categorie: 'Bijouterie et Orfèvrerie' },
        { id: 7, nom: 'Écharpe Brodée à la Main', prix: 60, description: 'Écharpe en laine douce, brodée à la main avec des motifs colorés et traditionnels.', url: 'https://m.media-amazon.com/images/I/71618r35F9L._AC_UF894,1000_QL80_.jpg', categorie: 'Autres' },
        { id: 8, nom: 'Panier en Osier Tressé', prix: 45, description: 'Panier artisanal en osier, tressé à la main avec des techniques traditionnelles.', url: 'https://m.media-amazon.com/images/I/71b29X149HL._AC_UF894,1000_QL80_.jpg', categorie: 'Autres' },
        { id: 9, nom: 'Panneau Mural en Zellige', prix: 300, description: 'Panneau mural décoratif en zellige, réalisé à la main avec des motifs géométriques complexes.', url: 'https://m.media-amazon.com/images/I/718712aE7wL._AC_UF894,1000_QL80_.jpg', categorie: 'Autres' },
        { id: 10, nom: 'Lampe en Tadelakt', prix: 150, description: 'Lampe artisanale en tadelakt, réalisée à la main avec des techniques traditionnelles.', url: 'images/10.jpg', categorie: 'Poterie et Céramique' }
    ];

    produitsFiltres: any[] = [];
    categorieSelectionnee: string = '';
    client: any = { id: 1, nom: 'Nom du client', email: 'email@client.com' };

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.filtrerParCategorie(this.categories[0]);
    }

    filtrerParCategorie(categorie: string): void {
        this.categorieSelectionnee = categorie;
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
            clientId: this.client.id,
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
        // Logique pour ajouter le produit au panier
        console.log('Produit ajouté au panier :', produit);
        // Vous pouvez ajouter ici une logique pour stocker le produit dans un panier (par exemple, dans un service de panier)
    }
}