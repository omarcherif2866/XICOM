
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
isLoading = true;


constructor(private router: Router) {
  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      const hiddenRoutes = /\/(services|actualites|partenaire|profile|rdv|abonnee|compagne|commande_status|commande_service|fiche_client|livrables|factures|test_commande_service|chat)(\/|$)/;
      this.showTopBar = !event.url.match(hiddenRoutes);
      this.showFooter = !event.url.match(hiddenRoutes);
    }
  });
}

ngOnInit() {
  setTimeout(() => {
    this.isLoading = false;
  }, 1000); // ajuste la durée selon tes besoins
}
}