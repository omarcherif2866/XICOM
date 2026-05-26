import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule } from '@angular/router'

import { ComponentsModule } from './components/components.module'
import { AppComponent } from './app.component'
import { BrowserModule } from '@angular/platform-browser'
import { SharedModule } from './pages/shared/shared.module';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { AdminGuard } from './guards/admin.guard'
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommandeStatusComponent } from './dashboard/commande-status/commande-status.component';



export function tokenGetter() {  // ✅ Ajouter
  return localStorage.getItem('accessToken');
}

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
    canActivate: [AdminGuard]  // ✅ Ajouter
  },
  {
    path: 'commande_status',
    loadChildren: () =>
      import('./dashboard/commande-status/commande-status.module').then(
        (m) => m.CommandeStatusModule
      )
  },
  {
  path: 'actualites',
  loadChildren: () =>
    import('./dashboard/actualite/actualite.module').then(
      (m) => m.ActualiteModule
    ),
    canActivate: [AdminGuard]  // ✅ Ajouter
},

  {
  path: 'rdv',
  loadChildren: () =>
    import('./dashboard/rdv/rdv.module').then(
      (m) => m.RdvModule
    ),
    canActivate: [AdminGuard]  // ✅ Ajouter
},
  {
  path: 'abonnee',
  loadChildren: () =>
    import('./dashboard/abonnee/abonnee.module').then(
      (m) => m.AbonneeModule
    ),
    canActivate: [AdminGuard]  // ✅ Ajouter
},
    {
    path: 'partenaires',
    loadChildren: () =>
      import('./dashboard/partenaires/partenaires.module').then(
        (m) => m.PartenairesModule
      ),
      canActivate: [AdminGuard] 
  },

    {
    path: 'commande_service',
    loadChildren: () =>
      import('./dashboard/commande-service/commande-service.module').then(
        (m) => m.CommandeServiceModule
      )
  },

  {
    path: 'offers',
    loadChildren: () =>
      import('./pages/offers/offers.module').then(
        (m) => m.OffersModule
      ),
  },
   {
    path: 'allActualites',
    loadChildren: () =>
      import('./pages/all-actualite/all-actualite.module').then(
        (m) => m.AllActualiteModule
      ),
  }, 
  {
    path: 'compagne',
    loadChildren: () =>
      import('./pages/compagne/compagne.module').then(
        (m) => m.CompagneModule
      ),
  },
  {
    path: 'serviceDetails/:id',
    loadChildren: () =>
      import('./pages/service-details/service-details.module').then(
        (m) => m.ServiceDetailsModule
      ),
  },

    {
    path: 'actualiteDetails/:id',
    loadChildren: () =>
      import('./pages/actualite-details/actualite-details.module').then(
        (m) => m.ActualiteDetailsModule
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
    FormsModule,
    BrowserAnimationsModule,
    JwtModule.forRoot({          // ✅ Ajouter
      config: {
        tokenGetter: tokenGetter,
      }
    })    
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}