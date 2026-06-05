import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { FactureService } from 'src/app/service/facture.service';

import jsPDF from 'jspdf';
import { Facture } from 'src/app/models/facture';
import { ServiceService } from 'src/app/service/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.css']
})
export class FactureComponent implements OnInit {

newFichier: File | null = null;
newFichierName: string = ''
showCommandeDropdown = false;
selectedCommande: any = null;
  // ===== Auth =====
  userId: number | null = null;
  userRole: string = '';
  isAdminOrSuper = false;
  isSimpleUser = false;

  // ===== Data =====
  allFactures: Facture[] = [];
  filteredFactures: Facture[] = [];
  isLoading = false;

  // ===== Filtres =====
  dateFrom: string = '';
  dateTo: string = '';
  referenceSearch: string = '';

  // ===== Pagination =====
  currentPage = 1;
  itemsPerPage = 10;

  // ===== Dialog Ajout Facture =====
  showDialog = false;
  dialogLoading = false;

  // Champs du dialog
  newMontant: number | null = null;
  newCommandeId: number | null = null;
  selectedUserId: number | null = null;

  // Liste des clients (admin)
  allClients: any[] = [];
  filteredClients: any[] = [];
  clientSearch: string = '';
  showClientDropdown = false;
  selectedClientName: string = '';

  // Commandes du client sélectionné
  clientCommandes: any[] = [];
  commandesLoading = false;
  sidebarOpen = true;

  constructor(
    private authService: AuthService,
    private factureService: FactureService,
    private userService: AuthService,
    private commandeService: ServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const token = this.authService.getToken();
    const decoded = (this.authService as any)['jwtHelper'].decodeToken(token);
    this.userId = decoded?.id || decoded?.userId || null;
    this.userRole = decoded?.role || decoded?.roles?.[0] || '';
    this.isAdminOrSuper = ['ADMIN', 'SUPERADMIN', 'ROLE_ADMIN', 'ROLE_SUPERADMIN']
      .includes(this.userRole.toUpperCase());
    this.isSimpleUser = ['SIMPLEU'].includes(this.userRole.toUpperCase());
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    this.dateTo   = this.toInputDate(today);
    this.dateFrom = this.toInputDate(weekAgo);
  }

  ngOnInit(): void {
    this.loadFactures();
    if (this.isAdminOrSuper) {
      this.loadAllClients();
    }
  }

  // ──────────────────────────────────────────────
  // CHARGEMENT FACTURES
  // ──────────────────────────────────────────────

  loadFactures(): void {
    this.isLoading = true;
    const obs$ = this.isAdminOrSuper
      ? this.factureService.getAll()
      : this.factureService.getByUserId(this.userId!);

    obs$.subscribe({
      next: (data) => {
        this.allFactures = data;
        this.filteredFactures = [...data];
        this.isLoading = false;
      },
      error: (err) => { console.error(err); this.isLoading = false; }
    });
  }

  // ──────────────────────────────────────────────
  // CHARGEMENT CLIENTS (Admin)
  // ──────────────────────────────────────────────

  loadAllClients(): void {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.allClients = users.filter((u: any) =>
          !['ADMIN', 'SUPERADMIN', 'ROLE_ADMIN', 'ROLE_SUPERADMIN']
            .includes((u.role || '').toUpperCase())
        );
        this.filteredClients = [...this.allClients];
      },
      error: (err) => console.error(err)
    });
  }

  onClientSearch(): void {
    const q = this.clientSearch.toLowerCase().trim();
    this.filteredClients = q
      ? this.allClients.filter(u =>
          (u.name || '').toLowerCase().includes(q) ||
          (u.surname || '').toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q)
        )
      : [...this.allClients];
    this.showClientDropdown = true;
  }

  selectClient(client: any): void {
    this.selectedUserId = client.id;
    this.selectedClientName = `${client.name || ''} ${client.surname || ''} — ${client.email}`.trim();
    this.clientSearch = this.selectedClientName;
    this.showClientDropdown = false;
    this.newCommandeId = null;
    this.loadClientCommandes(client.id);
    this.selectedCommande = null;
this.showCommandeDropdown = false;
  }

  loadClientCommandes(userId: number): void {
    this.commandesLoading = true;
    this.clientCommandes = [];
    this.commandeService.getByClient(userId).subscribe({
      next: (cmds) => { this.clientCommandes = cmds; this.commandesLoading = false; },
      error: (err) => { console.error(err); this.commandesLoading = false; }
    });
  }

  // ──────────────────────────────────────────────
  // DIALOG
  // ──────────────────────────────────────────────

openDialog(): void {
  this.showDialog = true;
  this.newMontant = null;
  this.newCommandeId = null;
  this.selectedUserId = null;
  this.selectedClientName = '';
  this.clientSearch = '';
  this.clientCommandes = [];
  this.showClientDropdown = false;
  this.filteredClients = [...this.allClients];
  this.newFichier = null;           // ← AJOUTER
  this.newFichierName = '';         // ← AJOUTER
  this.selectedCommande = null;
  this.showCommandeDropdown = false;

}

  closeDialog(): void {
    this.showDialog = false;
  }

submitFacture(): void {
  if (!this.newMontant || !this.newCommandeId || !this.selectedUserId) return;
  this.dialogLoading = true;

  this.factureService.create(
    this.newCommandeId,
    this.selectedUserId,
    this.newMontant,
    this.newFichier || undefined
  ).subscribe({
    next: () => {
      this.dialogLoading = false;
      this.closeDialog();
      this.loadFactures();
    },
    error: (err) => { console.error(err); this.dialogLoading = false; }
  });
}

  // ──────────────────────────────────────────────
  // FILTRES
  // ──────────────────────────────────────────────

  applyDateFilter(): void {
    if (!this.dateFrom || !this.dateTo) return;
    const from = new Date(this.dateFrom);
    const to   = new Date(this.dateTo);
    to.setHours(23, 59, 59);

    const diffMonths = (to.getFullYear() - from.getFullYear()) * 12
      + (to.getMonth() - from.getMonth());
    if (diffMonths > 3) {
      alert('L\'écart maximal entre les deux dates est de 3 mois.');
      return;
    }

    this.filteredFactures = this.allFactures.filter(f => {
      const d = new Date(f.date);
      return d >= from && d <= to;
    });
    this.currentPage = 1;
  }

  searchByReference(): void {
    const ref = this.referenceSearch.trim().toLowerCase();
    this.filteredFactures = ref
      ? this.allFactures.filter(f => f.reference.toLowerCase().includes(ref))
      : [...this.allFactures];
    this.currentPage = 1;
  }

  // ──────────────────────────────────────────────
  // PAGINATION
  // ──────────────────────────────────────────────

  get paginatedFactures(): Facture[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredFactures.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredFactures.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  handlePageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  // ──────────────────────────────────────────────
  // TOTAL
  // ──────────────────────────────────────────────

  get totalMontant(): number {
    return this.filteredFactures.reduce((sum, f) => sum + (f.montant || 0), 0);
  }

  // ──────────────────────────────────────────────
  // PDF INDIVIDUEL
  // ──────────────────────────────────────────────

  downloadFacturePdf(facture: Facture): void {
    const doc = new jsPDF();
    let y = 20;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(99, 65, 196);
    doc.text('FACTURE', 105, y, { align: 'center' });
    y += 12;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Référence : ${facture.reference}`, 15, y);
    doc.text(`Date : ${this.formatDate(facture.date)}`, 150, y);
    y += 8;

    doc.setDrawColor(200, 190, 255);
    doc.line(15, y, 195, y);
    y += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);

    if (facture.commande?.serviceTitle) {
      doc.text(`Service : ${facture.commande.serviceTitle}`, 15, y); y += 8;
    }
    if (facture.user?.email) {
      doc.text(`Client : ${facture.user.name || ''} — ${facture.user.email}`, 15, y); y += 8;
    }

    y += 6;
    doc.setDrawColor(200, 190, 255);
    doc.line(15, y, 195, y);
    y += 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(99, 65, 196);
    doc.text(`Montant TTC : ${this.formatMontant(facture.montant)} €`, 15, y);
    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Statut : ${this.getStatusLabel(facture.status)}`, 15, y);

    doc.save(`facture-${facture.reference}.pdf`);
  }

  // ──────────────────────────────────────────────
  // PDF GROUPÉ
  // ──────────────────────────────────────────────

  downloadAllPdf(): void {
    if (this.filteredFactures.length === 0) return;
    const doc = new jsPDF();
    let y = 20;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(99, 65, 196);
    doc.text('Récapitulatif des Factures', 105, y, { align: 'center' });
    y += 6;
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Du ${this.dateFrom} au ${this.dateTo}`, 105, y, { align: 'center' });
    y += 10;

    this.filteredFactures.forEach((f, i) => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`${i + 1}. ${f.reference}`, 15, y);
      doc.text(this.formatDate(f.date), 80, y);
      doc.text(`${this.formatMontant(f.montant)} €`, 160, y);
      y += 7;
      doc.setDrawColor(230, 225, 255);
      doc.line(15, y, 195, y);
      y += 4;
    });

    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(99, 65, 196);
    doc.text(`Total TTC : ${this.formatMontant(this.totalMontant)} €`, 160, y, { align: 'right' });

    doc.save(`factures-${this.dateFrom}-${this.dateTo}.pdf`);
  }

  // ──────────────────────────────────────────────
  // HELPERS
  // ──────────────────────────────────────────────

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  formatMontant(m: number): string {
    return m?.toFixed(2).replace('.', ',') || '0,00';
  }

  getStatusLabel(status: string): string {
    const map: { [k: string]: string } = {
      'EN_ATTENTE': '⏳ En attente',
      'PAYEE':      '✅ Payée',
      'ANNULEE':    '❌ Annulée',
    };
    return map[status] || status;
  }

  getStatusClass(status: string): string {
    const map: { [k: string]: string } = {
      'EN_ATTENTE': 'status-waiting',
      'PAYEE':      'status-paid',
      'ANNULEE':    'status-cancelled',
    };
    return map[status] || 'status-waiting';
  }

  getFactureLabel(facture: Facture): string {
    return `Facturation ${facture.reference}`;
  }

  getCommandeLabel(cmd: any): string {
    return `#${cmd.id} — ${cmd.serviceTitle || 'Commande'}`;
  }

  private toInputDate(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  onFichierSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;
  this.newFichier = input.files[0];
  this.newFichierName = input.files[0].name;
  input.value = '';
}

async downloadFichier(facture: Facture): Promise<void> {
  if (!facture.fichierUrl) return;

  try {
    const response = await fetch(facture.fichierUrl);
    const blob = await response.blob();

    const urlParts = facture.fichierUrl.split('/');
    const fileName = decodeURIComponent(urlParts[urlParts.length - 1]);

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(blobUrl);
  } catch (e) {
    console.error('Erreur téléchargement :', e);
  }
}

selectCommande(cmd: any): void {
  this.newCommandeId = cmd.id;
  this.selectedCommande = cmd;
  this.showCommandeDropdown = false;
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