import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service/service.service';

@Component({
  selector: 'app-commande-status',
  templateUrl: './commande-status.component.html',
  styleUrls: ['./commande-status.component.css']
})
export class CommandeStatusComponent implements OnInit {
  sidebarOpen = true;
  loading = false;
  commandes: any[] = [];
  statuses = ['EN_COURS', 'LIVREE'];
  selectedStatus = 'EN_COURS';

  // Pagination
  currentPage = 1;
  itemsPerPage = 8;

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.filterByStatus(this.selectedStatus);
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.loading = true;
    this.serviceService.getCommandesByStatus(status).subscribe({
      next: (data) => {
        this.commandes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  get currentItems(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.commandes.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.commandes.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  handlePageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    // votre logique de déconnexion
  }

}
