import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.cookieExists()) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const isSessionValid = await authService.verifySession();
    
    if (!isSessionValid) {
      authService.removeCookies();
      router.navigate(['/login']);
      return false;
    }

    router.navigate(['/home']);
    return true;
    
  } catch (error) {
    console.error(error);
    authService.removeCookies();
    router.navigate(['/login']);
    return false;
  }
};
