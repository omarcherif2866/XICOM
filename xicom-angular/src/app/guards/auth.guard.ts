import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    const role = this.authService.getRoleFromToken();
    if (role) return true;
    this.router.navigate(['/signin']);
    return false;
  }
}