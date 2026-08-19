import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

constructor(private router: Router) {}

  ngOnInit(): void {
  }
scrollToSection(sectionId: string): void {
  if (this.router.url === '/' || this.router.url.startsWith('/#')) {
    // ✅ Déjà sur la home — scroller directement
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // ✅ Autre page — naviguer vers home avec fragment
    this.router.navigate(['/'], { fragment: sectionId });
  }
}

navigateToOffres() {
  this.router.navigate(['/offers']);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navigateToContact() {
  this.router.navigate(['/contact']);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
}
