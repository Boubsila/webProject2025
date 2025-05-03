import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvisService {

  private baseUrl = 'https://localhost:7128/api/Avis';

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste des commentaires pour un produit et une commande spécifiques
   */
  getAvisList(numeroCommande: string, produitName: string): Observable<string[]> {
    const params = new HttpParams()
      .set('ORD', numeroCommande)
      .set('produitName', produitName);
    return this.http.get<string[]>(`${this.baseUrl}/GetComent`, { params });
  }

  /**
   * Ajoute un commentaire supplémentaire à un avis existant
   */
  addComment(numeroCommande: string, produitName: string, commentaire: string): Observable<any> {
    const params = new HttpParams()
      .set('ORD', numeroCommande)
      .set('produitName', produitName)
      .set('commentaire', commentaire);
    return this.http.post<any>(`${this.baseUrl}/ajouterCommentaire`, {}, { params });
  }

  /**
   * Récupère la note d'un produit pour une commande spécifique
   */
  getNote(numeroCommande: string, produitName: string): Observable<number> {
    const params = new HttpParams()
      .set('ORD', numeroCommande)
      .set('produitName', produitName);
    return this.http.get<number>(`${this.baseUrl}/GetNote`, { params });
  }

  /**
   * Ajoute un nouvel avis
   */
  addAvis(avis: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/AjouterAvis`, avis);
  }



}