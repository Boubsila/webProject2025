import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const clientGuard: CanActivateFn = (route, state) => {
   const authSvc = inject(AuthService);
  
    return authSvc.getUserRoles() == 'client'&& authSvc.getUserRoles()=='admin';
}
