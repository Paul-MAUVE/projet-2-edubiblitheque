import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
 const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (token) {
    return true;
  }

  return router.createUrlTree(['/login']);
};