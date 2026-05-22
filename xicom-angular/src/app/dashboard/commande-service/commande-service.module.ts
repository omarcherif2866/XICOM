import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandeServiceComponent } from './commande-service.component';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    CommandeServiceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule,
    RouterModule.forChild([
      { path: '', component: CommandeServiceComponent } // ← route par défaut du module
    ])    
  ]
})
export class CommandeServiceModule { }
