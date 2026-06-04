import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ClientService } from 'src/app/service/projet.service';
// import { ProjetService } from 'src/app/service/projet.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

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
  // projets: any[] = [];
  // selectedProjet: any = null;
  // showList = true;
  // currentPage = 1;
  // itemsPerPage = 10;
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
    private clientService: ClientService,
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

  step2Fields = [
  { key: 'logo', label: 'Logo' },
  { key: 'avatars', label: 'Avatars et personnages' },
  { key: 'charteGraphique', label: 'Charte graphique' },
  { key: 'policesCaracteres', label: 'Polices de caractères' },
  { key: 'imagesIllustrations', label: 'Images & illustrations' },
  { key: 'couleurSecondaire', label: 'Couleur secondaire' },
  { key: 'couleurANePasUtiliser', label: 'Couleur à ne pas utiliser' },
  { key: 'autresDonnees', label: 'Autre données' },
  { key: 'autresCommentaires', label: 'Autres commentaires' },
];

step4Fields = [
  { key: 'lesProduits', label: 'Les produits' },
  { key: 'programmeFidelite', label: 'Programme de Fidélité' },
  { key: 'lesAvis', label: 'Les avis' },
  { key: 'lesPublications', label: 'Les publications' },
  { key: 'hobbiesMarque', label: 'Les hobbies de la marque' },
  { key: 'consommation', label: 'La consommation' },
  { key: 'achatsRealises', label: 'Les achats réalisés' },
  { key: 'frequenceAchat', label: "La fréquence d'achat" },
  { key: 'moyenPaiement', label: 'Le moyen de paiement utilisé' },
  { key: 'pagesConsultees', label: 'Les pages consultées' },
  { key: 'produitsPlusVisites', label: 'Les produits les plus visités' },
];

// get paginatedProjets(): any[] {
//   const start = (this.currentPage - 1) * this.itemsPerPage;
//   return this.projets.slice(start, start + this.itemsPerPage);
// }

// get totalPages(): number {
//   return Math.ceil(this.projets.length / this.itemsPerPage);
// }

// get pagesArray(): number[] {
//   return Array.from({ length: this.totalPages }, (_, i) => i + 1);
// }

// handlePageChange(page: number): void {
//   if (page >= 1 && page <= this.totalPages) this.currentPage = page;
// }

ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.clientService.getByUser(Number(id)).subscribe({
      next: (clients) => {
        if (clients.length > 0) {
          // Charger directement le premier (et unique) projet dans le formulaire
          const projet = clients[0];
          this.projetToEdit = projet;
          this.isEditMode = true;
          this.submitted = false;

          this.step1Form.patchValue({ ...projet });
          this.step2Form.patchValue({ ...projet });
          this.step3Form.patchValue({ ...projet });
          this.step4Form.patchValue({ ...projet });

          // Charger les fichiers existants
          this.fileFields.forEach(key => {
            this.existingUrlMap[key] = projet[key]?.length ? [...projet[key]] : [];
          });
        }
      },
      error: (err) => console.error(err)
    });
  }
}

// selectProjet(projet: any): void {
//   this.selectedProjet = projet;
//   this.projetToEdit = projet;
//   this.isEditMode = true;
//   this.showList = false;
//   this.currentStep = 1;
//   this.submitted = false;

//   setTimeout(() => {
//     this.step1Form.patchValue({
//       client: projet.client,
//       secteur: projet.secteur,
//       categorie: projet.categorie,
//       responsableNomPrenom: projet.responsableNomPrenom,
//       responsableAdresse: projet.responsableAdresse,
//       responsableTelephone: projet.responsableTelephone,
//       responsableEmail: projet.responsableEmail,
//     });
//     this.step2Form.patchValue({
//       couleurSecondaire: projet.couleurSecondaire,
//       couleurANePasUtiliser: projet.couleurANePasUtiliser,
//       autresDonnees: projet.autresDonnees,
//       autresCommentaires: projet.autresCommentaires,
//     });
//     this.step3Form.patchValue({
//       siteWeb: projet.siteWeb,
//       reseauxSociaux: projet.reseauxSociaux,
//       coordonnees: projet.coordonnees,
//       canauxContact: projet.canauxContact,
//       servicesReconnusOutils: projet.servicesReconnusOutils,
//       concurrent: projet.concurrent,
//     });
//     this.step4Form.patchValue({
//       programmeFidelite: projet.programmeFidelite,
//       hobbiesMarque: projet.hobbiesMarque,
//       consommation: projet.consommation,
//       achatsRealises: projet.achatsRealises,
//       frequenceAchat: projet.frequenceAchat,
//       moyenPaiement: projet.moyenPaiement,
//       pagesConsultees: projet.pagesConsultees,
//       produitsPlusVisites: projet.produitsPlusVisites,
//     });
//     this.fileFields.forEach(key => {
//       this.existingUrlMap[key] = projet[key]?.length ? [...projet[key]] : [];
//     });
//     this.fileMap = {};
//   }, 0);
// }

// backToList(): void {
//   this.showList = true;
//   this.selectedProjet = null;
// }

  // ===== Fichiers =====

  triggerFileInput(key: string): void {
    const input = document.getElementById('file-' + key) as HTMLInputElement;
    input?.click();
  }

onFileSelected(event: Event, key: string) {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const files = Array.from(input.files);

  // ✅ Ajouter les fichiers dans fileMap
  if (!this.fileMap[key]) {
    this.fileMap[key] = [];
  }
  this.fileMap[key].push(...files);

  // Générer les previews
  if (!this.localPreviewsMap[key]) {
    this.localPreviewsMap[key] = [];
  }
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.localPreviewsMap[key].push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Pour les fichiers non-image, ajouter un placeholder
      this.localPreviewsMap[key].push('');
    }
  });

  // Reset l'input pour permettre re-sélection du même fichier
  input.value = '';
}

getLocalPreviews(key: string): string[] {
  return this.localPreviewsMap[key] || [];
}

removeLocalFile(key: string, index: number) {
  this.localPreviewsMap[key]?.splice(index, 1);
  this.fileMap[key]?.splice(index, 1); // ✅ supprimer aussi le fichier réel
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
      avatars: this.step2Form.value.avatars,
      charteGraphique: this.step2Form.value.charteGraphique,
      policesCaracteres: this.step2Form.value.policesCaracteres,
      imagesIllustrations: this.step2Form.value.imagesIllustrations,
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
      ? this.clientService.update(this.projetToEdit.id, data, this.fileMap, this.existingUrlMap)
      : this.clientService.create(data, this.fileMap);

    request$.subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = this.isEditMode ? 'Client modifié avec succès !' : 'Client créé avec succès !';
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


async generatePDF(): Promise<void> {
  const doc = new jsPDF();
  let y = 20;

  const addTitle = (title: string) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(99, 65, 196);
    doc.text(title, 15, y);
    y += 8;
    doc.setTextColor(0, 0, 0);
  };

  const addField = (label: string, value: string) => {
    if (!value || value.trim() === '') return;
    if (y > 265) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`• ${label} :`, 15, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(value, 175);
    doc.text(lines, 20, y);
    y += lines.length * 5 + 3;
  };

  const addImagesFromUrls = async (label: string, urls: string[]) => {
    if (!urls || urls.length === 0) return;
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`• ${label} :`, 15, y);
    y += 6;

    for (const url of urls) {
      try {
        // Charger l'image via fetch → base64
        const response = await fetch(url);
        const blob = await response.blob();
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });

        const ext = url.split('.').pop()?.toLowerCase();
        const format = ext === 'png' ? 'PNG' : 'JPEG';

        // Créer un élément image pour obtenir les dimensions
        const img = new Image();
        img.src = base64;
        await new Promise(r => img.onload = r);

        const maxW = 80;
        const maxH = 60;
        const ratio = Math.min(maxW / img.width, maxH / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;

        if (y + h > 270) { doc.addPage(); y = 20; }
        doc.addImage(base64, format, 20, y, w, h);
        y += h + 5;
      } catch (e) {
        // Si l'image échoue (CORS etc.), afficher l'URL en texte
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const lines = doc.splitTextToSize(url, 170);
        doc.text(lines, 20, y);
        y += lines.length * 5 + 3;
      }
    }
    y += 3;
  };

  // En-tête
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(99, 65, 196);
  doc.text('Fiche Client', 105, y, { align: 'center' });
  y += 15;
  doc.setTextColor(0, 0, 0);

  // ===== STEP 1 =====
  addTitle('1. Fiche Client');
  addField('Client', this.step1Form.value.client);
  addField('Secteur', this.step1Form.value.secteur);
  addField('Catégorie', this.step1Form.value.categorie);
  addField('Responsable', this.step1Form.value.responsableNomPrenom);
  addField('Adresse', this.step1Form.value.responsableAdresse);
  addField('Téléphone', this.step1Form.value.responsableTelephone);
  addField('Email', this.step1Form.value.responsableEmail);
  y += 5;

  // ===== STEP 2 =====
  addTitle('2. Graphique & Identités');
  await addImagesFromUrls('Logo', this.existingUrlMap['logo']);
  await addImagesFromUrls('Avatars', this.existingUrlMap['avatars']);
  await addImagesFromUrls('Charte graphique', this.existingUrlMap['charteGraphique']);
  await addImagesFromUrls('Polices de caractères', this.existingUrlMap['policesCaracteres']);
  await addImagesFromUrls('Images & illustrations', this.existingUrlMap['imagesIllustrations']);
  addField('Couleur secondaire', this.step2Form.value.couleurSecondaire);
  addField('Couleur à ne pas utiliser', this.step2Form.value.couleurANePasUtiliser);
  addField('Autres données', this.step2Form.value.autresDonnees);
  addField('Autres commentaires', this.step2Form.value.autresCommentaires);
  y += 5;

  // ===== STEP 3 =====
  addTitle('3. Digital');
  addField('Site web', this.step3Form.value.siteWeb);
  addField('Réseaux sociaux', this.step3Form.value.reseauxSociaux);
  addField('Coordonnées', this.step3Form.value.coordonnees);
  addField('Canaux de contact', this.step3Form.value.canauxContact);
  addField('Services reconnus & outils', this.step3Form.value.servicesReconnusOutils);
  addField('Concurrent', this.step3Form.value.concurrent);
  y += 5;

  // ===== STEP 4 =====
  addTitle('4. Marque & Produits');
  await addImagesFromUrls('Les produits', this.existingUrlMap['lesProduits']);
  await addImagesFromUrls('Les avis', this.existingUrlMap['lesAvis']);
  await addImagesFromUrls('Les publications', this.existingUrlMap['lesPublications']);
  addField('Programme de fidélité', this.step4Form.value.programmeFidelite);
  addField('Hobbies de la marque', this.step4Form.value.hobbiesMarque);
  addField('Consommation', this.step4Form.value.consommation);
  addField('Achats réalisés', this.step4Form.value.achatsRealises);
  addField("Fréquence d'achat", this.step4Form.value.frequenceAchat);
  addField('Moyen de paiement', this.step4Form.value.moyenPaiement);
  addField('Pages consultées', this.step4Form.value.pagesConsultees);
  addField('Produits les plus visités', this.step4Form.value.produitsPlusVisites);

  const client = this.step1Form.value.client || 'export';
  doc.save(`fiche-client-${client}.pdf`);
}

}