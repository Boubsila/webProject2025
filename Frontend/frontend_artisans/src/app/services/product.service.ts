import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  produitUrl = 'https://localhost:7128/api/Produit/getAllProducts';
  changeStatusProductUrl = 'https://localhost:7128/api/Produit/changeStatus?id=';
  addProductUrl = 'https://localhost:7128/api/Produit/AddProduct';
  deleteProductUrl = 'https://localhost:7128/api/Produit/deleteProduct?id=';
  productByArtisanUrl = 'https://localhost:7128/api/Produit/getProductsByArtisanName?artisanName=';
  updateProductUrl = 'https://localhost:7128/api/Produit/UpdateProduct'
  updateQuantiteProductUrl ='https://localhost:7128/api/Produit/updateQuantity';

  constructor(private http: HttpClient) { }

  updateQuantity(id: number, nouvelleQuantite: number): any {
    return this.http.put(`${this.updateQuantiteProductUrl}?id=${id}&nouvelleQuantite=${nouvelleQuantite}`,{});
  }

  getProducts(): any {
    return this.http.get<any[]>(this.produitUrl);
  }
  getProductsByArtisanName(artisanName: string): any {
    return this.http.get<any[]>(`${this.productByArtisanUrl}${artisanName}`);
  }

  changeProductStatus(id: number): any {
    return this.http.put(`${this.changeStatusProductUrl}${id}`, {}); 

  }

  deleteProduct(id: number): any {
    return this.http.delete(`${this.deleteProductUrl}${id}`);
  }

  addProduct(product: any): any {
    const url = `${this.addProductUrl}?nom=${product.nom}&description=${product.description}&prix=${product.prix}&categorie=${product.categorie}&image=${product.image}&quantite=${product.quantite}&artisan=${product.artisanName}&statut=${product.statut}`;
    
    return this.http.post(url, {});
  }

  updateProduct(product: any): any {
    const url = `${this.updateProductUrl}?id=${product.id}&nom=${product.nom}&description=${product.description}&prix=${product.prix}&categorie=${product.categorie}&image=${product.image}&quantite=${product.quantite}`;
    
    return this.http.put(url, {});
  }
}