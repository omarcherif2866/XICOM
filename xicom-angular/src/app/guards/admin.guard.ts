import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): boolean {
    const role = this.authService.getRoleFromToken(); // ← même méthode que isAdminOrSuperAdmin
    if (role === 'Admin' || role === 'SUPERADMIN') {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}