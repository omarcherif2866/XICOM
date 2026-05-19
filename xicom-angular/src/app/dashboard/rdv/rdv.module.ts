import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RdvComponent } from './rdv.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';



@NgModule({
  declarations: [
    RdvComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule,
    RouterModule.forChild([
      { path: '', component: RdvComponent } // ← route par défaut du module
    ])    
  ]
})
export class RdvModule { }
