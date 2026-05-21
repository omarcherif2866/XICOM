import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ← AJOUTER
import { TopBarComponent } from './top-bar/top-bar.component';
import { FooterComponent } from './footer/footer.component';
import { ProjetModule } from '../projet/projet.module';
import { CompagneModule } from '../compagne/compagne.module';

@NgModule({
  declarations: [
    TopBarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule, // ← indispensable pour routerLink
    ProjetModule,
    CompagneModule
  ],
  exports: [
    TopBarComponent,
    FooterComponent
  ]
})
export class SharedModule { }
