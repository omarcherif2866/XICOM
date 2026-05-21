import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Projet } from 'src/app/models/projet';
import { ProjetService } from 'src/app/service/projet.service';

@Component({
  selector: 'app-projet',
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.css']
})
export class ProjetComponent {


  currentStep = 1;
  totalSteps = 4;
  submitted = false;
  successMessage = '';

  steps = [
    { number: 1, label: 'Fiche Client' },
    { number: 2, label: 'Graphique & Identités' },
    { number: 3, label: 'Digital' },
    { number: 4, label: 'Marque & Produits' },
  ];

  // Step 1
  step1Form: FormGroup = this.fb.group({
    client: ['', Validators.required],
    secteur: [''],
    categorie: [''],
    responsableNomPrenom: [''],
    responsableAdresse: [''],
    responsableTelephone: [''],
    responsableEmail: ['', Validators.email],
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
fileMap: { [key: string]: File[] } = {};  // liste de fichiers par champ

  constructor(private fb: FormBuilder, private projetService: ProjetService) {}

  get currentForm(): FormGroup {
    const forms: { [key: number]: FormGroup } = {
      1: this.step1Form,
      2: this.step2Form,
      3: this.step3Form,
      4: this.step4Form,
    };
    return forms[this.currentStep];
  }

  next(): void {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }

  prev(): void {
    if (this.currentStep > 1) this.currentStep--;
  }

  goTo(step: number): void {
    this.currentStep = step;
  }

submit(): void {
  const data = {
    ...this.step1Form.value,
    ...this.step3Form.value,
    // champs texte du step2 et step4
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

  this.projetService.create(data, this.fileMap).subscribe({
    next: () => {
      this.successMessage = 'Projet créé avec succès !';
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