import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {
  menuOpen = false;

  constructor(private router: Router, private authService: AuthService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  signup() {
    this.router.navigate(['/signup']);
    this.menuOpen = false;
  }

  closeMenu() {
    this.menuOpen = false;
  }

get isAdminOrSuperAdmin(): boolean {
    const role = localStorage.getItem('userRole');
    return role === 'Admin' || role === 'SUPERADMIN';
}

get isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
}

  logout(): void {
    this.authService.logout();
    Swal.fire({
      icon: 'info',
      title: 'Déconnexion',
      text: 'Vous êtes déconnecté',
      showConfirmButton: false,
      timer: 1500
    });
    this.router.navigate(['/']);
  }

}