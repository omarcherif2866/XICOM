import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LivrableComponent } from './livrable.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    LivrableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: LivrableComponent
  
       } // ← route par défaut du module
    ])    
  ]
})
export class LivrableModule { }
