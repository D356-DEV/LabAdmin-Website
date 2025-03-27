import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.cookieExists()) {
    console.warn('[AUTH GUARD] - No session cookies found. Redirecting to login.');
    await router.navigate(['/login']);
    return false;
  }

  try {
    const isSessionValid = await authService.verifySession();

    if (!isSessionValid) {
      console.warn('[AUTH GUARD] - Session verification failed. Clearing cookies and redirecting to login.');
      authService.removeCookies();
      await router.navigate(['/login']);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[AUTH GUARD] - Error verifying session:', error);
    authService.removeCookies();
    await router.navigate(['/login']);
    return false;
  }
};
