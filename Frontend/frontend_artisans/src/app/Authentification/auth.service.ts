import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { SuccessAlertService } from './alerts/success-alert.service';
import { ErreurAlertService } from './alerts/erreur-alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(private http: HttpClient, private success: SuccessAlertService, private erreur: ErreurAlertService) { }



  // Méthode pour la connexion
  login(email: string, password: string): Observable<any> {

    // Envoi de la requête POST à l'URL 'http://localhost:4200/login' avec les données email et password

    return this.http.post(`https://localhost:7128/api/Authentication/Login?login=${email}&password=${password}`, null)
      .pipe(
        catchError(error => {
          // Gestion des erreurs
          let errorMessage = ''; // Message par défaut

          if (error.error) {
            // Extraire le message d'erreur de la chaîne de caractères
            const errorMessageMatch = error.error.match(/System\.Exception: (.*)\r\n/);
            if (errorMessageMatch && errorMessageMatch.length > 1) {
              errorMessage = errorMessageMatch[1];
            } else {
              errorMessage = error.error; // Utiliser la chaîne de caractères brute si le message n'est pas trouvé
            }
          } else if (error.status === 401) {
            errorMessage = 'Identifiants invalides.'; // Message pour les erreurs d'authentification
          }

          this.erreur.erreurAlert(errorMessage); // Afficher le message d'erreur
          return throwError(error); // Propager l'erreur
        })
      );
  }


  // Méthode pour l'enregistrement d'un nouvel utilisateur
  Register(email: any, password: any, role: any): void {
    // Envoi d'une requête POST à l'API pour enregistrer un utilisateur avec email, mot de passe et rôle
    this.http.post(`https://localhost:7128/api/Authentication/Register?login=${email}&password=${password}&role=${role}`, null)
      .subscribe(
        response => {
          // Si la requête réussit, afficher une alerte de succès
          this.success.successAlert('Utilisateur enregistré avec succès');
        },
        error => {
          // Si une erreur survient, afficher une alerte d'erreur
          this.erreur.erreurAlert('Erreur lors de l\'enregistrement de l\'utilisateur');
        }
      );
  }


  /**
   * Récupère les rôles de l'utilisateur à partir du token JWT stocké dans le session storage.
   * @returns {any} Les rôles de l'utilisateur depuis la revendication 'role' du token.
   */


  getUserRoles(): any {
  let token = sessionStorage.getItem("jwt");
  if (!token) {
    return null;  // Pas de token => pas de rôle
  }

  try {
    let decodedToken: any = jwtDecode(token);
    let role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role;
  } catch (error) {
    console.error('JWT invalide ou corrompu:', error);
    return null;  // En cas d'erreur de décodage, retourne null
  }
}


  /**
   * Récupère le nom d'utilisateur à partir du token JWT stocké dans le session storage.
   * @returns {string} Le nom d'utilisateur depuis la revendication 'sub' du token.
   */

  getUserName(): string {
    let token = sessionStorage.getItem("jwt") ?? '';
    let decodedToken: any = jwtDecode(token);
    
    return decodedToken.sub;
  }

  getUserId(): string {
    let token = sessionStorage.getItem("jwt") ?? '';
    let decodedToken: any = jwtDecode(token);
    return decodedToken.UserId;
  }

  getAllUsers(): Observable<any> {
    return this.http.get<any>('https://localhost:7128/api/Authentication/GetUsers')
      .pipe(
        catchError(error => {
          this.erreur.erreurAlert('Erreur lors de la récupération des utilisateurs');
          return throwError(error);
        })
      );
  }

}
