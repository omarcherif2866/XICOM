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
  isDialogOpen = false;
  isDialogCOpen = false;
  
  constructor(private router: Router, private authService: AuthService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  signin() {
    this.router.navigate(['/signin']);
    this.menuOpen = false;
  }

  closeMenu() {
    this.menuOpen = false;
  }

get isAdminOrSuperAdmin(): boolean {
  const role = this.authService.getRoleFromToken();
  return role === 'Admin' || role === 'SUPERADMIN'; // ← vérifiez ces valeurs exactes
}

get isLoggedIn(): boolean {
    return !!this.authService.getToken();
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


navigateToDashboard() {
  this.router.navigate(['/services']);
  this.menuOpen = false;
}

navigateToDashboardClient() {
  this.router.navigate(['/test_commande_service']);
  this.menuOpen = false;
}

goToService() {
  const token = this.authService.getToken();

  if (!token) {
    Swal.fire({
      title: 'Connexion requise',
      text: 'Vous devez être connecté pour accéder à cette page.',
      icon: 'warning',
      confirmButtonText: 'Se connecter',
      cancelButtonText: 'Annuler',
      showCancelButton: true,
      confirmButtonColor: '#6863BF',
      cancelButtonColor: '#aaa',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/signin']);
      }
    });
  } else {
    this.router.navigate(['/commande_service']);
  }
}

  openDialog(): void {
    this.isDialogOpen = true;
  }

  closeDialog(): void {
    this.isDialogOpen = false;
  }

checkAuthAndOpenDialog() {
  const token = localStorage.getItem('token');
  if (!token) {
    Swal.fire({
      title: 'Connexion requise',
      text: 'Vous devez être connecté pour démarrer un projet.',
      icon: 'warning',
      confirmButtonText: 'Se connecter',
      confirmButtonColor: '#7c3aed',
      showCancelButton: true,
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/signin'], {
          queryParams: { returnAction: 'openDialog' }
        });
      }
    });
  } else {
    this.openDialog();
  }
}

    openDialogC(): void {
    this.isDialogCOpen = true;
  }

  closeDialogC(): void {
    this.isDialogCOpen = false;
  }

}