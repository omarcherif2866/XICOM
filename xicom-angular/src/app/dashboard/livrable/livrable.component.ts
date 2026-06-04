import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { LivrableService } from 'src/app/service/livrable.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-livrable',
  templateUrl: './livrable.component.html',
  styleUrls: ['./livrable.component.css']
})
export class LivrableComponent implements OnInit {

  // ===== Rôle =====
  userRole: string = '';
  isAdminOrSuper = false;
  userId: number | null = null;
  sidebarOpen = true;

  // ===== Vues =====
  // list     → tableau admin
  // folders  → cards (detail_titles) d'un livrable admin
  // upload   → vue d'une card avec docs existants + drag&drop
  // user     → livrables du simple user
  // userDocs → docs d'un livrable user
  currentView: 'list' | 'folders' | 'upload' | 'user' | 'userDocs' = 'list';

  // ===== Admin =====
  allLivrables: any[] = [];
  filteredLivrables: any[] = [];
  searchQuery = '';
  currentPage = 1;
  itemsPerPage = 10;
  selectedLivrable: any = null;
  selectedFolder: { title: string; livrableId: number } | null = null;

  // ===== Docs de la card ouverte (admin) =====
  existingDocs: string[] = [];       // URLs déjà sauvegardées
  uploadedFiles: File[] = [];        // Nouveaux fichiers à envoyer
  uploadPreviews: string[] = [];     // Aperçus locaux
  isDragging = false;
  isUploading = false;

  // ===== Simple User =====
  userLivrables: any[] = [];
  selectedUserLivrable: any = null;  // livrable sélectionné par le user
  userDocs: string[] = [];           // docs du livrable sélectionné

  constructor(
    private authService: AuthService,
    private livrableService: LivrableService,

    private route: ActivatedRoute,
    private router: Router
  ) {
    const token = this.authService.getToken();
    const decoded = (this.authService as any)['jwtHelper'].decodeToken(token);
    this.userId = decoded?.id || decoded?.userId || null;
    this.userRole = decoded?.role || decoded?.roles?.[0] || '';
    this.isAdminOrSuper = ['ADMIN', 'SUPERADMIN', 'ROLE_ADMIN', 'ROLE_SUPERADMIN']
      .includes(this.userRole.toUpperCase());
  }

  ngOnInit(): void {
    if (this.isAdminOrSuper) {
      this.currentView = 'list';
      this.loadAllLivrables();
    } else {
      this.currentView = 'user';
      const id = this.route.snapshot.paramMap.get('id');
      const uid = id ? Number(id) : this.userId;
      if (uid) this.loadUserLivrables(uid);
    }
  }

  // ──────────────────────────────────────────────
  // CHARGEMENT
  // ──────────────────────────────────────────────

  loadAllLivrables(): void {
    this.livrableService.getAll().subscribe({
      next: (data) => { this.allLivrables = data; this.filteredLivrables = [...data]; },
      error: (err) => console.error(err)
    });
  }

  loadUserLivrables(userId: number): void {
    this.livrableService.getByUserId(userId).subscribe({
      next: (data) => { this.userLivrables = data; },
      error: (err) => console.error(err)
    });
  }

  // ──────────────────────────────────────────────
  // RECHERCHE & PAGINATION
  // ──────────────────────────────────────────────

  onSearch(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredLivrables = q
      ? this.allLivrables.filter(l =>
          (this.getClientName(l)).toLowerCase().includes(q) ||
          (l.titre || '').toLowerCase().includes(q) ||
          (l.status || '').toLowerCase().includes(q)
        )
      : [...this.allLivrables];
    this.currentPage = 1;
  }

  get paginatedLivrables(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredLivrables.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredLivrables.length / this.itemsPerPage);
  }

  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  handlePageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }

  // ──────────────────────────────────────────────
  // NAVIGATION ADMIN
  // ──────────────────────────────────────────────

  openFolders(livrable: any): void {
 
    this.selectedLivrable = livrable;
    this.currentView = 'folders';
  }

openUpload(title: string, livrableId: number): void {
  this.selectedFolder = { title, livrableId };
  this.existingDocs = [];
  this.uploadedFiles = [];
  this.uploadPreviews = [];
  this.currentView = 'upload';

  this.livrableService.getFichiers(livrableId).subscribe({
    next: (docs) => { this.existingDocs = docs || []; },
    error: () => { this.existingDocs = []; }
  });
}

  backToList(): void {
    this.currentView = 'list';
    this.selectedLivrable = null;
    this.selectedFolder = null;
  }

  backToFolders(): void {
    this.currentView = 'folders';
    this.selectedFolder = null;
    this.uploadedFiles = [];
    this.uploadPreviews = [];
    this.existingDocs = [];
  }

  // ──────────────────────────────────────────────
  // DRAG & DROP / UPLOAD (Admin)
  // ──────────────────────────────────────────────

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    this.addFiles(Array.from(event.dataTransfer?.files || []));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    this.addFiles(Array.from(input.files));
    input.value = '';
  }

  addFiles(files: File[]): void {
    files.forEach(file => {
      this.uploadedFiles.push(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => this.uploadPreviews.push(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        this.uploadPreviews.push('pdf');
      }
    });
  }

  removeFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
    this.uploadPreviews.splice(index, 1);
  }

saveUpload(): void {
  if (!this.selectedFolder || this.uploadedFiles.length === 0) return;
  this.isUploading = true;

  this.livrableService.addFichiers(this.selectedFolder.livrableId, this.uploadedFiles).subscribe({
    next: (updatedLivrable) => {
      this.isUploading = false;
      this.existingDocs = updatedLivrable.fichierUrl || [];
      this.uploadedFiles = [];
      this.uploadPreviews = [];
      Swal.fire({ icon: 'success', title: 'Fichiers enregistrés !', timer: 1500, showConfirmButton: false });
    },
    error: (err) => {
      this.isUploading = false;
      Swal.fire({ icon: 'error', title: 'Erreur upload', text: err.message });
    }
  });
}

removeExistingDoc(url: string): void {
  if (!this.selectedFolder) return;
  this.livrableService.removeFichier(this.selectedFolder.livrableId, url).subscribe({
    next: (updatedLivrable) => {
      this.existingDocs = updatedLivrable.fichierUrl || [];
    },
    error: (err) => console.error(err)
  });
}

  // ──────────────────────────────────────────────
  // NAVIGATION SIMPLE USER
  // ──────────────────────────────────────────────

openUserDocs(livrable: any): void {
  this.selectedUserLivrable = livrable;
  this.userDocs = livrable.fichierUrl || [];
  this.currentView = 'userDocs';
}

  backToUserList(): void {
    this.currentView = 'user';
    this.selectedUserLivrable = null;
    this.userDocs = [];
  }

  // ──────────────────────────────────────────────
  // HELPERS
  // ──────────────────────────────────────────────

getDetailTitles(livrable: any): { title: string; livrableId: number }[] {
  const result: { title: string; livrableId: number }[] = [];
  const livrableId = livrable?.id;  // ← vérifier que ce n'est pas undefined
    
  (livrable?.commandes || []).forEach((cmd: any) => {
    (cmd.detailTitles || []).forEach((t: string) => {
      if (!result.find(r => r.title === t)) {
        result.push({ title: t, livrableId });
      }
    });
  });
  return result;
}

  getClientName(livrable: any): string {
    return livrable?.commandes?.[0]?.user?.username
      || livrable?.commandes?.[0]?.user?.email
      || livrable?.titre
      || '—';
  }

  getLivrableLabel(livrable: any): string {
    return `Livrable — ${this.getClientName(livrable)}`;
  }

isImage(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/i.test(url)
    || (url.includes('cloudinary.com') && url.includes('/image/upload/'));
}

isPdf(url: string): boolean {
  return /\.pdf(\?|$)/i.test(url)
    || (url.includes('cloudinary.com') && url.includes('/raw/upload/') && url.toLowerCase().includes('.pdf'));
}

getFileName(url: string): string {
  const raw = url.split('/').pop()?.split('?')[0] || url;
  try { return decodeURIComponent(raw); } catch { return raw; }
}

getDownloadUrl(url: string): string {
  // fl_attachment uniquement pour les images, pas pour raw
  if (this.isImage(url)) {
    return url.replace('/upload/', '/upload/fl_attachment/');
  }
  return url; // URL directe pour PDF/fichiers
}


  getStatusClass(status: string): string {
    const map: { [k: string]: string } = {
      'EN_ATTENTE': 'badge-waiting',
      'EN_COURS':   'badge-progress',
      'LIVRE':      'badge-delivered',
      'VALIDE':     'badge-validated',
      'REJETE':     'badge-rejected',
    };
    return map[status?.toUpperCase()] || 'badge-waiting';
  }

  getStatusLabel(status: string): string {
    const map: { [k: string]: string } = {
      'EN_ATTENTE': '⏳ En attente',
      'EN_COURS':   '🔄 En cours',
      'LIVRE':      '📦 Livré',
      'VALIDE':     '✅ Validé',
      'REJETE':     '❌ Rejeté',
    };
    return map[status?.toUpperCase()] || '⏳ En attente';
  }

  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }

  logout(): void {
    this.authService.logout();
    Swal.fire({ icon: 'error', title: 'Vous êtes déconnecté', showConfirmButton: false, timer: 1500 });
    this.router.navigate(['/']);
  }

async downloadFile(event: Event, url: string): Promise<void> {
  event.preventDefault();
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = this.getFileName(url);
    a.click();
    URL.revokeObjectURL(blobUrl);
  } catch (e) {
    // Fallback : ouvrir dans un nouvel onglet
    window.open(url, '_blank');
  }
}



}