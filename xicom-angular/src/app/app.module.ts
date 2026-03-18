import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'

import { ComponentsModule } from './components/components.module'
import { AppComponent } from './app.component'
import { BrowserModule } from '@angular/platform-browser'
import { SharedModule } from './pages/shared/shared.module';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'


const routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/home-page/home-page.module').then(
        (m) => m.HomePageModule
      ),
  },
    {
    path: 'forgot-password',
    loadChildren: () =>
      import('./pages/forget-password/forget-password.module').then(
        (m) => m.ForgetPasswordModule
      ),
  },
  {
    path: 'verify-code',
    loadChildren: () =>
      import('./pages/verify-code/verify-code.module').then(
        (m) => m.VerifyCodeModule
      ),
  },
  {
    path: 'reset-password',
    loadChildren: () =>
      import('./pages/reset-password/reset-password.module').then(
        (m) => m.ResetPasswordModule
      ),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/signup/signup.module').then(
        (m) => m.SignupModule
      ),
  },
  {
    path: 'signin',
    loadChildren: () =>
      import('./pages/signin/signin.module').then(
        (m) => m.SigninModule
      ),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./pages/contact/contact.module').then(
        (m) => m.ContactModule
      ),
  },
  {
    path: 'services',
    loadChildren: () =>
      import('./dashboard/service/service.module').then(
        (m) => m.ServiceModule
      ),
  },
    {
    path: 'partenaires',
    loadChildren: () =>
      import('./dashboard/partenaires/partenaires.module').then(
        (m) => m.PartenairesModule
      ),
  },
  {
    path: 'offers',
    loadChildren: () =>
      import('./pages/offers/offers.module').then(
        (m) => m.OffersModule
      ),
  },
  {
    path: 'serviceDetails/:id',
    loadChildren: () =>
      import('./pages/service-details/service-details.module').then(
        (m) => m.ServiceDetailsModule
      ),
  },

]

@NgModule({
  declarations: [AppComponent], // ✅ Seulement AppComponent
  imports: [
    BrowserModule, 
    RouterModule.forRoot(routes), 
    ComponentsModule, 
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}