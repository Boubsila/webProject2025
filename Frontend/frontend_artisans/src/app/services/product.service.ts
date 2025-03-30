import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  produitUrl = 'https://localhost:7128/api/Produit/getAllProducts';
  changeStatusProductUrl = 'https://localhost:7128/api/Produit/changeStatus?id=';
  deleteProductUrl = 'https://localhost:7128/api/Produit/deleteProduct?id=';

  constructor(private http: HttpClient) { }

  getProducts(): any {
    return this.http.get<any[]>(this.produitUrl);
  }

  changeProductStatus(id: number): any {
    return this.http.put(`${this.changeStatusProductUrl}${id}`, {}); 

  }

  deleteProduct(id: number): any {
    return this.http.delete(`${this.deleteProductUrl}${id}`);
  }
}