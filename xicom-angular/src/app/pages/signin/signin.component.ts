import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role, User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

    constructor(private authService:AuthService, private router:Router ){

   
  }
  user: User = new User("","", "", false,"", "", Role.SIMPLEU);

  ngOnInit(): void {
  }

login() {
  const loginData = { email: this.user.Email, password: this.user.Password };

  this.authService.login(loginData).subscribe(
    (response: any) => {
      if (response && response.role && response.accessToken) {

        // ❌ Supprimer ces lignes — le service s'en occupe déjà avec chiffrement
        // localStorage.setItem("userRole", response.role);
        // localStorage.setItem("accessToken", response.accessToken);

        // ✅ Uniquement stocker le userId (déjà chiffré dans le service)
        this.authService.storeUserIdFromToken();

        // ✅ Lire le rôle depuis le service (déchiffré proprement)
        const role = this.authService.getRoleFromToken();

        if (role === 'Admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'SIMPLEU') {
          this.router.navigate(['/']);
        }

        Swal.fire({
          icon: 'success',
          title: 'Connected',
          showConfirmButton: false,
          timer: 1500
        });

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred during login'
        });
      }
    },
    error => {
      if (error.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Incorrect username or password'
        });
      } else if (error.status === 403) {
        Swal.fire({
          icon: 'warning',
          title: 'Votre Compte est bloqué',
          text: 'Votre compte a été bloqué. Veuillez contacter l\'assistance.'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred during login'
        });
      }
    }
  );
}

}
