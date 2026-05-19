import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbonneeComponent } from './abonnee.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AbonneeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: AbonneeComponent } // ← route par défaut du module
    ])    
  ]
})
export class AbonneeModule { }
