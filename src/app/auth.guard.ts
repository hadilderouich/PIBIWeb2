import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const url: string = state.url;

    return new Promise<boolean>((resolve) => {
      if (url.includes('/dashboard/')) {
        if (!this.authService.isLoggedIn()) {
          this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
          resolve(false);
          return;
        }

        const currentUser = this.authService.currentUserValue;
        const dashboard = url.split('/')[2];
        
        if (currentUser.dashboard !== dashboard) {
          this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
          resolve(false);
          return;
        }
      }

      resolve(true);
    });
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  const authGuardService = inject(AuthGuard);
  return authGuardService.canActivate(route, state);
};
