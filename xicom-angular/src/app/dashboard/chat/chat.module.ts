import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';



@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChatComponent,
        canActivate: [AuthGuard]  // ✅ protéger la route
      }
    ])
  ]
})
export class ChatModule {}
