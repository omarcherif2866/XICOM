import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceDetailsComponent } from './service-details.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactComponent } from '../contact/contact.component';
import { ContactModule } from '../contact/contact.module';



@NgModule({
  declarations: [ServiceDetailsComponent],
  imports: [
    CommonModule,FormsModule, ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: ServiceDetailsComponent } // ← route par défaut du module
    ])
  ]
})
export class ServiceDetailsModule { }
