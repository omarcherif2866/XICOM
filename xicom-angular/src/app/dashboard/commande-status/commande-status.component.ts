import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'src/app/service/service.service';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PaymentServiceService } from 'src/app/service/payment-service.service';

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

showPaymentModal = false;
currentServiceCommande: any = null;
selectedPayPack: any = null;
paymentLoading = false;
private squareCard: any = null;

  isAdmin = false;
  isSimpleUser = false;
  currentUserId: number | null = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 8;
  userId: number | null = null;
private squareScriptLoaded = false;
private squareScriptLoading: Promise<void> | null = null;
  constructor(
    private serviceService: ServiceService,
    private authService: AuthService,
    private router:Router,
      private paymentService: PaymentServiceService // ✅

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

private loadSquareScript(): Promise<void> {
  if (this.squareScriptLoaded) {
    return Promise.resolve();
  }
  if (this.squareScriptLoading) {
    return this.squareScriptLoading;
  }

  this.squareScriptLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
    script.async = true;
    script.onload = () => {
      this.squareScriptLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Impossible de charger Square SDK'));
    document.head.appendChild(script);
  });

  return this.squareScriptLoading;
}

payerCommande(commande: any): void {
  this.currentServiceCommande = commande;
  this.selectedPayPack = { price: commande.packPrice, title: commande.packTitle };
  this.showPaymentModal = true;

  this.loadSquareScript().then(async () => {
    if (!(window as any).Square) return;
    const payments = (window as any).Square.payments('sandbox-sq0idb-vOwpMCtCuvesEBTe1JNCvQ', 'LPFSAGHXZK4SZ');
    this.squareCard = await payments.card();
    await this.squareCard.attach('#card-container');
  }).catch(err => {
    console.error(err);
    Swal.fire({ icon: 'error', title: 'Erreur de chargement du module de paiement' });
  });
}


async submitPayment(): Promise<void> {
  if (!this.squareCard || !this.selectedPayPack || !this.currentServiceCommande) return;
  this.paymentLoading = true;
  try {
    const result = await this.squareCard.tokenize();
    if (result.status === 'OK') {
      this.paymentService.pay(
        result.token,
        this.selectedPayPack.price.toString(),
        this.currentServiceCommande.id
      ).subscribe({
        next: () => {
          this.paymentLoading = false;
          this.showPaymentModal = false;
            this.currentServiceCommande.paymentStatus = 'PAYEE'; // ✅
          Swal.fire({ icon: 'success', title: 'Paiement réussi !', timer: 1500, showConfirmButton: false });
        },
        error: (err) => {
          this.paymentLoading = false;
          Swal.fire({ icon: 'error', title: 'Erreur de paiement', text: err.error?.error });
        }
      });
    } else {
      this.paymentLoading = false;
      Swal.fire({ icon: 'error', title: 'Carte invalide', text: result.errors?.[0]?.message });
    }
  } catch (e) {
    this.paymentLoading = false;
  }
}

}