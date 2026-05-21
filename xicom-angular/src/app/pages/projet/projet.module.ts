import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetComponent } from './projet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [ProjetComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // RouterModule.forChild([
    //   { path: '', component: ProjetComponent } // ← route par défaut du module
    // ])
  ],
  exports: [ProjetComponent]
})
export class ProjetModule { }
