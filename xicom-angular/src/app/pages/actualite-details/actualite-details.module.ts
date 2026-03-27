import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActualiteDetailsComponent } from './actualite-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [ActualiteDetailsComponent],
  imports: [
    CommonModule,FormsModule, ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: ActualiteDetailsComponent } // ← route par défaut du module
    ])
  ]
})
export class ActualiteDetailsModule { }
