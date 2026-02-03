import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { ComponentsModule } from 'src/app/components/components.module'
import { HomePage } from './home-page.component'

const routes = [
  {
    path: '',
    component: HomePage,
  },
]

@NgModule({
  declarations: [HomePage],
  imports: [CommonModule, ComponentsModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  exports: [HomePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {}
