import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PartenaireComponent } from './partenaires.component';



@NgModule({
  declarations: [
    PartenaireComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: PartenaireComponent } // ← route par défaut du module
    ])    
  ]
})
export class PartenairesModule { }
