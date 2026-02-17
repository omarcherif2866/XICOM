import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent {
  menuOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  signup() {
    this.router.navigate(['/signup']);
    this.menuOpen = false;
  }

  closeMenu() {
    this.menuOpen = false;
  }
}