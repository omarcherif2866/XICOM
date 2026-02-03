import { Component, OnInit } from '@angular/core';
import { Role, User } from 'src/app/models/user';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private userservice: AuthService) {
   
  }
  user: User = new User("","", "", false,"", "", Role.SIMPLEU);

  ngOnInit(): void {
  }


  addUser() {
    // Supprimer la propriété Role n'est plus nécessaire
    this.userservice.addUser(this.user).subscribe(
      newUser => {
        this.user = newUser;
        Swal.fire({
          icon: 'success',
          title: 'Utilisateur ajouté avec succès',
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
