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
  

  constructor(private http: HttpClient) { }

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
    //'https://localhost:7128/api/Produit/UpdateProduct?id=2&nom=test%20update&description=updated&prix=21&categorie=autre&image=%2Fimages%2F3.jpg&quantite=40'
    const url = `${this.updateProductUrl}?id=${product.id}&nom=${product.nom}&description=${product.description}&prix=${product.prix}&categorie=${product.categorie}&image=${product.image}&quantite=${product.quantite}`;
    
    return this.http.put(url, {});
  }
}