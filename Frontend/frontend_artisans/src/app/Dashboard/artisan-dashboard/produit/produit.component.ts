import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../Authentification/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-produit',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './produit.component.html',
    styleUrl: './produit.component.css'
})
export class ProduitComponent implements OnInit {
    products: any[] = [];
    selectedProduct: any = { nom: '', description: '', prix: 0, image: '', statut: 'pending', quantite: 0, categorie: '' };
    selectedFile: File | null = null;
    imageOptions: string[] = [];
    categories: string[] = [
        "Poterie et Céramique",
        "Tissage et Tapis",
        "Travail du Cuir (Tanneries)",
        "Travail du Bois (Menuiserie et Marqueterie)",
        "Métallurgie et Ferronnerie",
        "Bijouterie et Orfèvrerie",
        "Autres"
    ];

    showId = true;
    showImage = true;
    showName = true;
    showDescription = true;
    showPrice = true;
    showQuantity = true;
    showArtisan = true;
    showCategory = true;
    showStatus = true;
    isModalOpen = false;
    

    @ViewChild('productModal') productModal: ElementRef | undefined;
    @ViewChild('firstInput') firstInput: ElementRef | undefined;

    constructor(private userService: UserService, private authservice: AuthService, private productService: ProductService, private router: Router) { }

    userConnected: string = '';

    ngOnInit(): void {
        this.userConnected = this.authservice.getUserName();
        console.log(this.userConnected);

        const imageNames = ['vase1','vase2','vase3','vase4',
                            'tapis1','tapis2','tapis3','tapis4',
                            'sac1','sac2','sac3','sac4',
                            'table1','table2','table3','table4',
                            'collier1','collier2','collier3','collier4',
                            'echarpe1','echarpe2','echarpe3','echarpe4',
                            'panier1','panier2','panier3','panier4',
                            'panneau1','panneau2','panneau3',
                            'laterne1','laterne2','laterne3','laterne4',
                            'lampe1','lampe2','lampe3','lampe4'
                            ];

        this.imageOptions = imageNames.map(name => `/images/produits/${name}.png`);

        

        this.updateProductList(); 
    }



    //mise à jour du tableau produit
    updateProductList() {
        this.productService.getProductsByArtisanName(this.userConnected).subscribe((data: any[]) => {
            this.products = data;
        });
    }

    goToDashboard() {
        this.router.navigate(['/dashboard']);
    }

    openAddProductModal() {
        this.selectedProduct = { nom: '', description: '', prix: 0, image: this.imageOptions[0], statut: 'pending', quantite: 0, categorie: this.categories[0] };
        this.selectedFile = null;
        this.openModal();
    }

    openEditProductModal(product: any) {
        this.selectedProduct = { ...product };
        this.selectedFile = null;
        this.openModal();
    }

    saveProduct() {
        this.selectedProduct.artisanName = this.userConnected;
    
        if (this.selectedProduct.id) {
            // Cas : modification
            this.productService.updateProduct(this.selectedProduct).subscribe(() => {
                this.updateProductList(); //  recharge la liste après modification
                this.closeModal();
            });
        } else {
            // Cas : ajout
            this.productService.addProduct(this.selectedProduct).subscribe(() => {
                this.updateProductList(); //  recharge la liste après ajout
                this.closeModal();
            });
        }
    }
    
    

    deleteProduct(productId: number) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            this.productService.deleteProduct(productId).subscribe({
                next: () => {
                    this.updateProductList(); // Recharge les produits après suppression
                },
                error: (err: any) => {
                    console.error('Erreur lors de la suppression du produit :', err);
                    alert("Une erreur est survenue lors de la suppression.");
                }
            });
        }
    }
    

    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
        if (this.selectedFile) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.selectedProduct.image = e.target.result;
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    openModal() {
        this.isModalOpen = true; // Dynamically update modal state
        if (this.productModal && this.productModal.nativeElement) {
            this.productModal.nativeElement.classList.add('show');
            this.productModal.nativeElement.style.display = 'block';
            this.productModal.nativeElement.setAttribute('inert', 'false'); // Ensure modal elements are interactive
            document.body.classList.add('modal-open');
            if (this.firstInput && this.firstInput.nativeElement) {
                setTimeout(() => {
                    if (this.firstInput && this.firstInput.nativeElement) {
                        this.firstInput.nativeElement.focus();
                    }
                }, 0);
            }
        }
    }

    closeModal() {
        this.isModalOpen = false; // Dynamically update modal state
        if (this.productModal && this.productModal.nativeElement) {
            this.productModal.nativeElement.classList.remove('show');
            this.productModal.nativeElement.style.display = 'none';
            this.productModal.nativeElement.setAttribute('inert', 'true'); // Prevent interaction with closed modal
            document.body.classList.remove('modal-open');
        }
    }

    closeModalFromButton() {
        this.closeModal();
    }
}
