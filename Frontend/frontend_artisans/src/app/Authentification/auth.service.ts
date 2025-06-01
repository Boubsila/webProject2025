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
    return this.http.post(`https://localhost:7128/api/Authentication/Login?login=${email}&password=${password}`, null);
  }


  // Méthode pour l'enregistrement d'un nouvel utilisateur
  // Nouveau code
  Register(email: string, password: string, role: string): Observable<any> {
    return this.http.post(`https://localhost:7128/api/Authentication/Register?login=${email}&password=${password}&role=${role}`, null);
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
      this.erreur.erreurAlert('Le jeton JWT est invalide ou corrompu.');
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
          let errorMessage = 'Erreur lors de la récupération des utilisateurs';

          if (error.error && typeof error.error === 'string') {
            const match = error.error.match(/System\.Exception: (.*)\r\n/);
            if (match && match[1]) {
              errorMessage = match[1];
            } else {
              errorMessage = error.error;
            }
          } else if (error.status === 0) {
            errorMessage = 'Connexion impossible au serveur.';
          }

          this.erreur.erreurAlert(errorMessage);
          return throwError(() => error);
        })
      );
  }


}
