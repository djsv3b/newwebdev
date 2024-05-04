import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const isAuthenticated = this.authService.isAuth();
    const isLoginOrSignUp = route.routeConfig?.path === 'login' || route.routeConfig?.path === 'sign-up';

    if (isAuthenticated && isLoginOrSignUp) {
      this.router.navigate(['/']);  // Redirect authenticated users away from login and sign-up to home
      return false;
    } else if (!isAuthenticated && !isLoginOrSignUp) {
      this.router.navigate(['/sign-up']);  // Redirect unauthenticated users away from protected routes to sign-up
      return false;
    }

    return true;  // Allow access if the conditions for redirection are not met
  }
}
