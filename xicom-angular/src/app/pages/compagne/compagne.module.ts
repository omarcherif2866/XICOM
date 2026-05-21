import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompagneComponent } from './compagne.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [CompagneComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // RouterModule.forChild([
    //   { path: '', component: ProjetComponent } // ← route par défaut du module
    // ])
  ],
  exports: [CompagneComponent]
})
export class CompagneModule { }
