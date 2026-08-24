import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterModule, PreloadAllModules } from '@angular/router'

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
import { FicheClientProjetComponent } from './dashboard/fiche-client-projet/fiche-client-projet.component';
import { TestServiceComponent } from './dashboard/test-service/test-service.component';
import { AuthGuard } from './guards/auth.guard'

// ✅ Import EAGER de HomePageModule (plus de lazy loading pour la home)
import { HomePageModule } from './pages/home-page/home-page.module';


export function tokenGetter() {  // ✅ Ajouter
  return localStorage.getItem('accessToken');
}

const routes = [
  // ❌ SUPPRIMÉ : l'entrée lazy pour path '' — HomePageModule.forChild()
  // enregistre déjà cette route automatiquement puisqu'on l'importe en eager ci-dessous.
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
    canActivate: [AdminGuard]
  },
  {
    path: 'commande_status',
    loadChildren: () =>
      import('./dashboard/commande-status/commande-status.module').then(
        (m) => m.CommandeStatusModule
      )
  },
  {
    path: 'livrables/:id',
    loadChildren: () =>
      import('./dashboard/livrable/livrable.module').then(
        (m) => m.LivrableModule
      )
  },
  {
    path: 'livrables',
    loadChildren: () =>
      import('./dashboard/livrable/livrable.module').then(m => m.LivrableModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'factures/:id',
    loadChildren: () =>
      import('./dashboard/facture/facture.module').then(
        (m) => m.FactureModule
      )
  },
  {
    path: 'factures',
    loadChildren: () =>
      import('./dashboard/facture/facture.module').then(m => m.FactureModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'fiche_client/:id',
    loadChildren: () =>
      import('./dashboard/fiche-client-projet/fiche-client-projet.module').then(
        (m) => m.FicheClientProjetModule
      )
  },
  {
    path: 'actualites',
    loadChildren: () =>
      import('./dashboard/actualite/actualite.module').then(
        (m) => m.ActualiteModule
      ),
    canActivate: [AdminGuard]
  },
  {
    path: 'rdv',
    loadChildren: () =>
      import('./dashboard/rdv/rdv.module').then(
        (m) => m.RdvModule
      ),
    canActivate: [AdminGuard]
  },
  {
    path: 'abonnee',
    loadChildren: () =>
      import('./dashboard/abonnee/abonnee.module').then(
        (m) => m.AbonneeModule
      ),
    canActivate: [AdminGuard]
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
    path: 'test_commande_service',
    loadChildren: () =>
      import('./dashboard/test-service/test-service.module').then(
        (m) => m.TestServiceModule
      )
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./dashboard/chat/chat.module').then(m => m.ChatModule),
    canActivate: [AuthGuard]
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
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // ✅ preloadingStrategy: télécharge les autres modules lazy en arrière-plan
    //    une fois la home affichée, sans bloquer le premier rendu
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    ComponentsModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    // ✅ HomePageModule importé en eager : son RouterModule.forChild()
    //    enregistre la route path:'' -> HomePage automatiquement
    HomePageModule,
    JwtModule.forRoot({
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