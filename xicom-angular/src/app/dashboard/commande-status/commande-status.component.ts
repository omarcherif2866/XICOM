import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service/service.service';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
  statusLabels: { [key: string]: string } = {
    'EN_COURS': 'En cours',
    'LIVREE': 'Livrée'
  };

  isAdmin = false;
  isSimpleUser = false;
  currentUserId: number | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 8;
  userId: number | null = null;

  constructor(
    private serviceService: ServiceService,
    private authService: AuthService,
    private router:Router
  ) {
    const token = this.authService.getToken();
    const decoded = (this.authService as any)['jwtHelper'].decodeToken(token);
    this.userId = decoded?.id || decoded?.userId || null;
  }

  ngOnInit(): void {
    const role = this.authService.getRoleFromToken();
    this.isAdmin = role === 'Admin' || role === 'SUPERADMIN';
    this.isSimpleUser = role === 'SIMPLEU';

    if (!this.isAdmin) {
      const token = this.authService.getToken();
      const decoded = (this.authService as any)['jwtHelper'].decodeToken(token);
      this.currentUserId = decoded?.id || decoded?.userId || null;
      this.loadByClient();
    } else {
      this.filterByStatus(this.selectedStatus);
    }
  }

  loadByClient(): void {
    if (!this.currentUserId) return;
    this.loading = true;
    this.serviceService.getByClient(this.currentUserId).subscribe({
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

  updateStatus(commande: any, newStatus: string): void {
    this.serviceService.updateStatus(commande.id, newStatus).subscribe({
      next: (updated) => {
        commande.status = updated.status;
      },
      error: (err) => console.error(err)
    });
  }

  getStatusLabel(status: string): string {
    return this.statusLabels[status] || status;
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
        this.authService.logout();
    
        Swal.fire({
          icon: 'error',
          title: 'Vous êtes deconnecté',
          showConfirmButton: false,
          timer: 1500
        }); 
        

        this.router.navigate(['/']);
      }
}