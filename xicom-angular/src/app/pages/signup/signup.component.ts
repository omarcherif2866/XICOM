import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Role, User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
declare const google: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, AfterViewInit  {

  constructor(private userservice: AuthService,    private router: Router, private ngZone: NgZone) {
   
  }
  user: User = new User("","", "", false,"", "", Role.SIMPLEU);
  confirmPassword: string = '';

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

    this.userservice.googleSignIn(credential).subscribe(
      (res: any) => {
        this.ngZone.run(() => {
          this.userservice.saveGoogleAuth(res);
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


  addUser() {
    if (!this.user.Password || this.user.Password.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Le mot de passe est obligatoire',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    if (this.user.Password !== this.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Les mots de passe ne correspondent pas',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    this.userservice.addUser(this.user).subscribe(
      newUser => {
        this.user = newUser;
        this.confirmPassword = '';
        Swal.fire({
          icon: 'success',
          title: 'Votre compte a été créé avec succès',
          showConfirmButton: false,
          timer: 1500
        });
      },
      error => {
        let errorMessage = 'Erreur lors de l\'ajout de l\'utilisateur';
        if (error.error && error.error.message) {
          if (error.error.message.includes('Name')) {
            errorMessage = 'Name existe déjà!';
          } else if (error.error.message.includes('Email')) {
            errorMessage = 'Email existe déjà!';
          }
        }
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: errorMessage,
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }

}
