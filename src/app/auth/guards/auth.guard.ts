import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard fonctionnel qui vérifie l'authentification avant l'accès aux routes protégées
// POURQUOI: redirige vers /login si aucun token n'est présent dans localStorage
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router      = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
