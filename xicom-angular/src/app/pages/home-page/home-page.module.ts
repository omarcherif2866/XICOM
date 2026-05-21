import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { ComponentsModule } from 'src/app/components/components.module'
import { HomePage, TruncatePipe } from './home-page.component'
import { ProjetModule } from '../projet/projet.module'

const routes = [
  {
    path: '',
    component: HomePage,
  },
]

@NgModule({
  declarations: [HomePage,TruncatePipe],
  imports: [CommonModule, ComponentsModule, ProjetModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(routes)],
  exports: [HomePage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {}
