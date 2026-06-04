import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/service/auth.service';
import { ClientService } from 'src/app/service/projet.service';
// import { ProjetService } from 'src/app/service/projet.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-projet',
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.css']
})
export class ProjetComponent implements OnInit {

  currentStep = 1;
  totalSteps = 4;
  submitted = false;
  successMessage = '';
  isLoading = false;

  steps = [
    { number: 1, label: 'Fiche Client' },
    { number: 2, label: 'Graphique & Identités' },
    { number: 3, label: 'Digital' },
    { number: 4, label: 'Marque & Produits' },
  ];

  // Step 1
  step1Form: FormGroup = this.fb.group({
    client: ['', Validators.required],
    secteur: ['', Validators.required],
    categorie: ['', Validators.required],
    responsableNomPrenom: ['', Validators.required],
    responsableAdresse: ['', Validators.required],
    responsableTelephone: ['', Validators.required],
    responsableEmail: ['', [Validators.required, Validators.email]],
  });

  // Step 2
  step2Form: FormGroup = this.fb.group({
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

  // Step 3
  step3Form: FormGroup = this.fb.group({
    siteWeb: [''],
    reseauxSociaux: [''],
    coordonnees: [''],
    canauxContact: [''],
    servicesReconnusOutils: [''],
    concurrent: [''],
  });

  // Step 4
  step4Form: FormGroup = this.fb.group({
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

  fileMap: { [key: string]: File[] } = {};

  constructor(private fb: FormBuilder, private clientService: ClientService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) return;

    this.authService.getUserById(userId).subscribe({
      next: (user: any) => {
        setTimeout(() => {
          this.step1Form.patchValue({
            client: `${user.name} ${user.surname}`.trim(),
            responsableEmail: user.email || '',
            responsableTelephone: '',
            responsableAdresse: '',
          });
        }, 0);
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  get currentForm(): FormGroup {
    const forms: { [key: number]: FormGroup } = {
      1: this.step1Form,
      2: this.step2Form,
      3: this.step3Form,
      4: this.step4Form,
    };
    return forms[this.currentStep];
  }

  // ✅ next() corrigé et séparé du subscribe
  next(): void {
    if (this.currentStep === 1) {
      this.step1Form.markAllAsTouched();
      if (this.step1Form.invalid) return; // bloque si champs invalides
    }
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prev(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  goTo(step: number): void {
  if (step > 1) {
    this.step1Form.markAllAsTouched();
    if (this.step1Form.invalid) return;
  }
  this.currentStep = step;
}

  // ✅ submit() propre sans next() dedans
  submit(): void {
      const userId = this.authService.getUserIdFromToken(); // ← déclaré ici
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
      userId: userId  // ← ajout

    };

    this.clientService.create(data, this.fileMap).subscribe({
      next: () => {
          this.isLoading = false;

        this.successMessage = 'Client créé avec succès !';
        this.submitted = true;
      },
      error: (err) => console.error(err)
    });
  }

  triggerFileInput(key: string): void {
    const input = document.getElementById('file-' + key) as HTMLInputElement;
    input?.click();
  }

  onFileSelected(event: Event, key: string): void {
    const files = Array.from((event.target as HTMLInputElement).files || []);
    this.fileMap[key] = [...(this.fileMap[key] || []), ...files];
  }

  downloadFile(key: string): void {
    (this.fileMap[key] || []).forEach(file => {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  getFileName(key: string): string {
    const files = this.fileMap[key];
    if (!files || files.length === 0) return '';
    if (files.length === 1) return files[0].name;
    return `${files.length} fichiers sélectionnés`;
  }

  getFileCount(key: string): number {
    return this.fileMap[key]?.length || 0;
  }


}