import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';


import { Router } from '@angular/router';
import { Role, User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
declare const google: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit,AfterViewInit {

    constructor(private authService:AuthService,    private router: Router, private ngZone: NgZone){

   
  }
  user: User = new User("","", "", false,"", "", Role.SIMPLEU);

  ngOnInit(): void {
  }

ngAfterViewInit(): void {
    this.waitForGoogle();
  }

  private waitForGoogle(retries: number = 20): void {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
      this.initGoogleSignIn();
    } else if (retries > 0) {
      setTimeout(() => this.waitForGoogle(retries - 1), 200);
    } else {
      console.error('Google Identity Services n\'a pas pu être chargé.');
    }
  }

private initGoogleSignIn(): void {
  google.accounts.id.initialize({
    client_id: '508243367638-nj9sa34dqn7ue861hnv7hf9mklkfcn5q.apps.googleusercontent.com',
    callback: (response: any) => {
      this.ngZone.run(() => this.handleGoogleSignIn(response));
    }
  });

  google.accounts.id.renderButton(
    document.getElementById('google-signin-btn'),
    { theme: 'outline', size: 'large', width: 240 }
  );
}

  triggerGoogleSignIn(): void {
    google.accounts.id.prompt();
  }

  handleGoogleSignIn(response: any): void {
    const credential = response.credential;

    this.authService.googleSignIn(credential).subscribe(
      (res: any) => {
        this.ngZone.run(() => {
          this.authService.saveGoogleAuth(res);
          Swal.fire({
            icon: 'success',
            title: 'Connexion réussie',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/commande_service']);
        });
      },
      error => {
        this.ngZone.run(() => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur lors de la connexion avec Google',
            showConfirmButton: false,
            timer: 1500
          });
        });
      }
    );
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
