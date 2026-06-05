import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Abonnee } from 'src/app/models/abonnee';
import { AbonneeServiceService } from 'src/app/service/abonnee-service.service';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-abonnee',
  templateUrl: './abonnee.component.html',
  styleUrls: ['./abonnee.component.css']
})
export class AbonneeComponent implements OnInit {
  userId: number | null = null;


  abonnes: Abonnee[] = [];
abonneCount: number = 0;
sidebarOpen = true;
currentPage: number = 1;
itemsPerPage: number = 15;
  constructor(private abonneeService: AbonneeServiceService,  private authService: AuthService, private router: Router) { }

ngOnInit(): void {
  this.loadAbonnes();
}

loadAbonnes(): void {
  this.abonneeService.getAllAbonnes().subscribe(data => {
    this.abonnes = data;
  });

  this.abonneeService.countAbonnes().subscribe(count => {
    this.abonneCount = count;
  });
}

logout(): void {
  this.authService.logout();
  Swal.fire({
    icon: 'error',
    title: 'Vous êtes déconnecté',
    showConfirmButton: false,
    timer: 1500
  });
  this.router.navigate(['/']);
}


toggleSidebar() {
  this.sidebarOpen = !this.sidebarOpen;
}

get totalPages(): number {
  return Math.ceil(this.abonnes.length / this.itemsPerPage);
}

get pages(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

get pagedAbonnes(): Abonnee[] {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.abonnes.slice(start, start + this.itemsPerPage);
}

changePage(page: number): void {
  if (page < 1 || page > this.totalPages) return;
  this.currentPage = page;
}

}
