import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandeStatusComponent } from './commande-status.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    CommandeStatusComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: CommandeStatusComponent } // ← route par défaut du module
    ])    
  ]
})
export class CommandeStatusModule { }
