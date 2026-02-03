
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
        // Masquer TopBar sur ActualiteComponent et FormateurComponent
        this.showTopBar = !(
 event.url.match(/\/services(\/|$)/) 
        );
        this.showFooter = !(
 event.url.match(/\/services(\/|$)/) 
        );
      }
    });
  }
}