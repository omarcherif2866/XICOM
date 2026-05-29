import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ProjetService } from 'src/app/service/projet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fiche-client-projet',
  templateUrl: './fiche-client-projet.component.html',
  styleUrls: ['./fiche-client-projet.component.css']
})
export class FicheClientProjetComponent implements OnInit {

  projetToEdit: any = null;
  isEditMode = false;
  isLoading = false;
  submitted = false;
  successMessage = '';
  currentStep = 1;
  totalSteps = 4;
  projets: any[] = [];
  selectedProjet: any = null;
  showList = true;
  currentPage = 1;
  itemsPerPage = 10;
  steps = [
    { number: 1, label: 'Fiche Client' },
    { number: 2, label: 'Graphique & Identités' },
    { number: 3, label: 'Digital' },
    { number: 4, label: 'Marque & Produits' },
  ];
  sidebarOpen = true;
localPreviewsMap: { [key: string]: string[] } = {};

  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
  step4Form: FormGroup;

  fileMap: { [key: string]: File[] } = {};
  uploadingMap: { [key: string]: boolean } = {};
  existingUrlMap: { [key: string]: string[] } = {};

  private fileFields = [
    'logo', 'avatars', 'charteGraphique', 'policesCaracteres',
    'imagesIllustrations', 'lesProduits', 'lesAvis', 'lesPublications'
  ];
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private projetService: ProjetService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {

    const token = this.authService.getToken();
    const decoded = (this.authService as any)['jwtHelper'].decodeToken(token);
    this.userId = decoded?.id || decoded?.userId || null;

    this.step1Form = this.fb.group({
      client: ['', Validators.required],
      secteur: [''],
      categorie: [''],
      responsableNomPrenom: [''],
      responsableAdresse: [''],
      responsableTelephone: [''],
      responsableEmail: ['', Validators.email],
    });

    this.step2Form = this.fb.group({
      logo: [''],
      avatars: [''],
      charteGraphique: [''],
      policesCaracteres: [''],
      imagesIllustrations: [''],
      couleurSecondaire: [''],
      couleurANePasUtiliser: [''],
      autresDonnees: [''],
      autresCommentaires: [''],
    });

    this.step3Form = this.fb.group({
      siteWeb: [''],
      reseauxSociaux: [''],
      coordonnees: [''],
      canauxContact: [''],
      servicesReconnusOutils: [''],
      concurrent: [''],
    });

    this.step4Form = this.fb.group({
      lesProduits: [''],
      programmeFidelite: [''],
      lesAvis: [''],
      lesPublications: [''],
      hobbiesMarque: [''],
      consommation: [''],
      achatsRealises: [''],
      frequenceAchat: [''],
      moyenPaiement: [''],
      pagesConsultees: [''],
      produitsPlusVisites: [''],
    });
  }

get paginatedProjets(): any[] {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  return this.projets.slice(start, start + this.itemsPerPage);
}

get totalPages(): number {
  return Math.ceil(this.projets.length / this.itemsPerPage);
}

get pagesArray(): number[] {
  return Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

handlePageChange(page: number): void {
  if (page >= 1 && page <= this.totalPages) this.currentPage = page;
}

ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.projetService.getByUser(Number(id)).subscribe({
      next: (projets) => {
        this.projets = projets;
        if (projets.length === 1) {
          this.selectProjet(projets[0]); // auto-select si un seul projet
        }
      },
      error: (err) => console.error(err)
    });
  }
}

selectProjet(projet: any): void {
  this.selectedProjet = projet;
  this.projetToEdit = projet;
  this.isEditMode = true;
  this.showList = false;
  this.currentStep = 1;
  this.submitted = false;

  setTimeout(() => {
    this.step1Form.patchValue({
      client: projet.client,
      secteur: projet.secteur,
      categorie: projet.categorie,
      responsableNomPrenom: projet.responsableNomPrenom,
      responsableAdresse: projet.responsableAdresse,
      responsableTelephone: projet.responsableTelephone,
      responsableEmail: projet.responsableEmail,
    });
    this.step2Form.patchValue({
      couleurSecondaire: projet.couleurSecondaire,
      couleurANePasUtiliser: projet.couleurANePasUtiliser,
      autresDonnees: projet.autresDonnees,
      autresCommentaires: projet.autresCommentaires,
    });
    this.step3Form.patchValue({
      siteWeb: projet.siteWeb,
      reseauxSociaux: projet.reseauxSociaux,
      coordonnees: projet.coordonnees,
      canauxContact: projet.canauxContact,
      servicesReconnusOutils: projet.servicesReconnusOutils,
      concurrent: projet.concurrent,
    });
    this.step4Form.patchValue({
      programmeFidelite: projet.programmeFidelite,
      hobbiesMarque: projet.hobbiesMarque,
      consommation: projet.consommation,
      achatsRealises: projet.achatsRealises,
      frequenceAchat: projet.frequenceAchat,
      moyenPaiement: projet.moyenPaiement,
      pagesConsultees: projet.pagesConsultees,
      produitsPlusVisites: projet.produitsPlusVisites,
    });
    this.fileFields.forEach(key => {
      this.existingUrlMap[key] = projet[key]?.length ? [...projet[key]] : [];
    });
    this.fileMap = {};
  }, 0);
}

backToList(): void {
  this.showList = true;
  this.selectedProjet = null;
}

  // ===== Fichiers =====

  triggerFileInput(key: string): void {
    const input = document.getElementById('file-' + key) as HTMLInputElement;
    input?.click();
  }

onFileSelected(event: Event, key: string) {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const files = Array.from(input.files);
  // ... votre logique existante ...

  // Générer les previews
  this.localPreviewsMap[key] = [];
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.localPreviewsMap[key].push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  });
}

getLocalPreviews(key: string): string[] {
  return this.localPreviewsMap[key] || [];
}

removeLocalFile(key: string, index: number) {
  this.localPreviewsMap[key]?.splice(index, 1);
  // Retirez aussi le fichier de votre filesMap si nécessaire
}

  getFileCount(key: string): number {
    return this.fileMap[key]?.length || 0;
  }

  getFileName(key: string): string {
    const files = this.fileMap[key];
    return files?.length ? files.map(f => f.name).join(', ') : '';
  }

  getExistingFiles(key: string): string[] {
    return this.existingUrlMap[key] || [];
  }

  removeExistingFile(key: string, url: string): void {
    this.existingUrlMap[key] = this.existingUrlMap[key].filter(u => u !== url);
  }

  downloadFile(key: string): void {
    // Télécharger nouveaux fichiers locaux
    (this.fileMap[key] || []).forEach(file => {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Ouvrir les URLs existantes
    (this.existingUrlMap[key] || []).forEach(url => {
      window.open(url, '_blank');
    });
  }

  // ===== Stepper =====

  next(): void {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prev(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  goTo(step: number): void {
    this.currentStep = step;
  }

  // ===== Submit =====

  submit(): void {
    if (this.step1Form.invalid) {
      this.step1Form.markAllAsTouched();
      this.currentStep = 1;
      return;
    }

    this.isLoading = true;

    const data = {
      ...this.step1Form.value,
      ...this.step3Form.value,
      couleurSecondaire: this.step2Form.value.couleurSecondaire,
      couleurANePasUtiliser: this.step2Form.value.couleurANePasUtiliser,
      autresDonnees: this.step2Form.value.autresDonnees,
      autresCommentaires: this.step2Form.value.autresCommentaires,
      programmeFidelite: this.step4Form.value.programmeFidelite,
      hobbiesMarque: this.step4Form.value.hobbiesMarque,
      consommation: this.step4Form.value.consommation,
      achatsRealises: this.step4Form.value.achatsRealises,
      frequenceAchat: this.step4Form.value.frequenceAchat,
      moyenPaiement: this.step4Form.value.moyenPaiement,
      pagesConsultees: this.step4Form.value.pagesConsultees,
      produitsPlusVisites: this.step4Form.value.produitsPlusVisites,
    };

    const request$ = this.isEditMode
      ? this.projetService.update(this.projetToEdit.id, data, this.fileMap, this.existingUrlMap)
      : this.projetService.create(data, this.fileMap);

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = this.isEditMode ? 'Projet modifié avec succès !' : 'Projet créé avec succès !';
        this.submitted = true;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
      }
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

}