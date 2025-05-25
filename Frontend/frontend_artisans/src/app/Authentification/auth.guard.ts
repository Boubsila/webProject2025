import { SuccessAlertService } from './alerts/success-alert.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ErreurAlertService } from './alerts/erreur-alert.service';

export const authGuard: CanActivateFn = (route, state) => {

  const alert = inject(ErreurAlertService);  
  const router = inject(Router);
  const jwt = sessionStorage.getItem('jwt');

  if (jwt) {
    const payload = parseJwt(jwt);

    if (payload && payload.exp) {
      const now = Math.floor(Date.now() / 1000); // temps actuel en secondes

      if (payload.exp > now) {
        return true; // token valide
      }
    }

    // token expiré ou mal formé
    sessionStorage.removeItem('jwt');
  }

  alert.erreurAlert(" token expiré");
  router.navigate(['/login']);
  return false;
};

//  Fonction pour décoder le token JWT (partie payload)
function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}
