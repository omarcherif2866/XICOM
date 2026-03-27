import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllActualiteComponent } from './all-actualite.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [AllActualiteComponent],
  imports: [
    CommonModule,FormsModule, ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: AllActualiteComponent } // ← route par défaut du module
    ])
  ]
})
export class AllActualiteModule { }
