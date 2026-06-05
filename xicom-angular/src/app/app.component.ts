
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Keejob Store';
  showTopBar = true;
  showFooter = true;

constructor(private router: Router) {
  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      const hiddenRoutes = /\/(services|actualites|partenaire|profile|rdv|abonnee|compagne|commande_status|commande_service|fiche_client|livrables|factures)(\/|$)/;
      this.showTopBar = !event.url.match(hiddenRoutes);
      this.showFooter = !event.url.match(hiddenRoutes);
    }
  });
}
}