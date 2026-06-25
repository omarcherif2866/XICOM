import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestServiceComponent } from './test-service.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    TestServiceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    RouterModule.forChild([
      { path: '', component: TestServiceComponent } // ← route par défaut du module
    ])    
  ]
})
export class TestServiceModule { }
