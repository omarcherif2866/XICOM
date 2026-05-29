import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FicheClientProjetComponent } from './fiche-client-projet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    FicheClientProjetComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: FicheClientProjetComponent
  
       } // ← route par défaut du module
    ])    
  ]
})
export class FicheClientProjetModule { }
