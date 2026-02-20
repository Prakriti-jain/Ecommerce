import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.getUser()?.role
  if (role === 'ADMIN') {
    return true
  }

  router.navigate(['./login']);
  return false;
};
