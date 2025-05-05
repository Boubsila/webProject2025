import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getOrdersUrl = 'https://localhost:7128/api/Commande/GetOrder';
  
  getOrdersByArtisanUrl = 'https://localhost:7128/api/Commande/GetCommandesByArtisan'; // Ajout de l'URL pour récupérer les commandes par artisan


  deleteOrderUrl = 'https://localhost:7128/api/Commande/Delete';

  updateOrderUrl = 'https://localhost:7128/api/Commande/updateOrder'

  updateOrderStatusUrl = 'https://localhost:7128/api/Commande/ChangeOrderStatus';

  updateOrderStatusMultiUrl = 'https://localhost:7128/api/Commande/ChangeCommandeStatut';

 
addPickupUrl = 'https://localhost:7128/api/Commande/Pickup';
  
addpickupAddress(order : string, address : string): any {
    return this.http.put(`${this.addPickupUrl}/${order}/${address}`,null);
  
}


getOrders(): any {

    return this.http.get<any[]>(this.getOrdersUrl);
  }

  // Méthode pour récupérer les commandes par artisan
  getOrdersByArtisan(artisanName: string): any {
    return this.http.get<any[]>(`${this.getOrdersByArtisanUrl}/${artisanName}`);
  }

  deleteOrder(id: number): any {
    return this.http.delete(`${this.deleteOrderUrl}/${id}`);
  }

  updateOrder(order: any): any {
    return this.http.put(`${this.updateOrderUrl}/${order.id}`, order);
  }
  

  updateOrderStatus(order: string, status: string): any {
    return this.http.put(`${this.updateOrderStatusUrl}/${order}/${status}`,null);
  }

  updateOrderStatusMulti(orderNumber: string, artisanName:string, status:string): any {
    return this.http.put(`${this.updateOrderStatusMultiUrl}/${orderNumber}/${artisanName}/${status}`,null);
  }

}
