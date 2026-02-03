import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffersComponent } from './offers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    OffersComponent
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: OffersComponent } // ← route par défaut du module
    ])
  ]
})
export class OffersModule { }
