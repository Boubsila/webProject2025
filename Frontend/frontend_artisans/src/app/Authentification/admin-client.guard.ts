import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const adminClientGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);
  const role = authSvc.getUserRoles();
  const isAdminOrClient = role === 'Admin' || role === 'client';
  return isAdminOrClient;
};
