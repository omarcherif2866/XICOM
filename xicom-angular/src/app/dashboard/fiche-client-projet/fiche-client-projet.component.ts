import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ClientService } from 'src/app/service/projet.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { ProduitItem } from 'src/app/models/projet';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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

  steps = [
    { number: 1, label: 'Fiche Client' },
    { number: 2, label: 'Graphique & Identités' },
    { number: 3, label: 'Digital' },
    { number: 4, label: 'Marque & Produits' },
  ];

  sidebarOpen = true;
  localPreviewsMap: { [key: string]: string[] } = {};
  uploadingMap: { [key: string]: boolean } = {};

  step1Form: FormGroup;
  step2Form: FormGroup;
  step3Form: FormGroup;
  // step4 est géré directement via produitItemsMap, pas de FormGroup nécessaire

  fileMap: { [key: string]: File[] } = {};
  existingUrlMap: { [key: string]: string[] } = {};

  // Clés uniquement pour les champs fichiers simples (identité visuelle)
  private fileFields = [
    'logo', 'avatars', 'charteGraphique', 'policesCaracteres',
    'imagesIllustrations', 'couleurSecondaire'
  ];

  // Les 5 produits — chaque produit est une liste ordonnée de ProduitItem
  produitKeys = ['produit1', 'produit2', 'produit3', 'produit4', 'produit5'];
  produitLabels: { [key: string]: string } = {
    produit1: 'Produit 1',
    produit2: 'Produit 2',
    produit3: 'Produit 3',
    produit4: 'Produit 4',
    produit5: 'Produit 5',
  };

  // Map clé → liste ordonnée d'items (texte ou image)
  produitItemsMap: { [key: string]: ProduitItem[] } = {
    produit1: [], produit2: [], produit3: [],
    produit4: [], produit5: [],
  };

  // Map clé → fichiers en attente d'upload (dans l'ordre des slots image vides)
  produitFilesMap: { [key: string]: File[] } = {
    produit1: [], produit2: [], produit3: [],
    produit4: [], produit5: [],
  };

  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
      private sanitizer: DomSanitizer  // ← ajouter

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
      couleurANePasUtiliser: [''],
      autresDonnees: [''],
      autresCommentaires: [''],
    });

    this.step3Form = this.fb.group({
      siteWeb: [''],
      coordonnees: [''],
      servicesReconnusOutils: [''],
      concurrent: [''],
    });
  }

  // Map clé → liste des object URLs dans l'ordre des fichiers locaux
produitPreviewsMap: { [key: string]: SafeUrl[] } = {
  produit1: [], produit2: [], produit3: [], produit4: [], produit5: [],
};
// Garde les URLs brutes uniquement pour revokeObjectURL
private produitRawUrlsMap: { [key: string]: string[] } = {
  produit1: [], produit2: [], produit3: [], produit4: [], produit5: [],
};

  step2Fields = [
    { key: 'logo',                label: 'Logo' },
    { key: 'avatars',             label: 'Avatars et personnages' },
    { key: 'charteGraphique',     label: 'Charte graphique' },
    { key: 'policesCaracteres',   label: 'Polices de caractères' },
    { key: 'imagesIllustrations', label: 'Images & illustrations' },
    { key: 'couleurSecondaire',   label: 'Couleur secondaire' },
  ];

  socialFields = [
    { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/...' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
    { key: 'linkedin',  label: 'LinkedIn',  placeholder: 'https://linkedin.com/...' },
    { key: 'tikTok',    label: 'TikTok',    placeholder: 'https://tiktok.com/...' },
    { key: 'youtube',   label: 'Youtube',   placeholder: 'https://youtube.com/...' },
    { key: 'threads',   label: 'Threads',   placeholder: 'https://threads.com/...' },
  ];

socialForm: FormGroup = this.fb.group({
  facebook:  [''],
  instagram: [''],
  linkedin:  [''],
  tikTok:    [''],   // ← correspondre à socialFields
  youtube:   [''],
  threads:   [''],   // ← ajouter
});

  contactFields = [
    { key: 'whatsApp',    label: 'WhatsApp',      placeholder: 'WhatsApp' },
    { key: 'telephone',   label: 'Téléphone',     placeholder: 'Téléphone' },
    { key: 'chatenligne', label: 'Chat en ligne', placeholder: 'Chat en ligne' },
    { key: 'emails',      label: 'Emails',        placeholder: 'Emails' },
  ];

  contactForm: FormGroup = this.fb.group({
    whatsApp:    [''],
    telephone:   [''],
    chatenligne: [''],
    emails:      [''],
  });

  getSocialControl(key: string) { return this.socialForm.get(key) as any; }
  getContactControl(key: string) { return this.contactForm.get(key) as any; }

  // ===== ngOnInit =====

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientService.getByUser(Number(id)).subscribe({
        next: (clients) => {
          if (clients.length > 0) {
            const projet = clients[0];
            this.projetToEdit = projet;
            this.isEditMode = true;
            this.submitted = false;

            this.step1Form.patchValue({ ...projet });
            this.step2Form.patchValue({ ...projet });
            this.step3Form.patchValue({ ...projet });

            // Réseaux sociaux
            const reseaux: string[] = projet.reseauxSociaux || [];
            ['facebook','instagram','linkedin','tikTok','youtube','threads']
              .forEach((key, i) => this.socialForm.patchValue({ [key]: reseaux[i] || '' }));

            // Canaux contact
            const contacts: string[] = projet.canauxContact || [];
            ['whatsApp','telephone','chatenligne','emails']
              .forEach((key, i) => this.contactForm.patchValue({ [key]: contacts[i] || '' }));

            // Fichiers identité visuelle existants
            this.fileFields.forEach(key => {
              this.existingUrlMap[key] = projet[key]?.length ? [...projet[key]] : [];
            });

            // Produits existants
            this.produitKeys.forEach(key => {
              this.produitItemsMap[key] = projet[key]?.length ? [...projet[key]] : [];
              this.produitFilesMap[key] = [];
            });
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  // ===== Fichiers identité visuelle (inchangé) =====

  triggerFileInput(key: string): void {
    (document.getElementById('file-' + key) as HTMLInputElement)?.click();
  }

  onFileSelected(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files);

    if (!this.fileMap[key]) this.fileMap[key] = [];
    this.fileMap[key].push(...files);

    if (!this.localPreviewsMap[key]) this.localPreviewsMap[key] = [];
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => this.localPreviewsMap[key].push(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        this.localPreviewsMap[key].push('');
      }
    });
    input.value = '';
  }

  getLocalPreviews(key: string): string[] { return this.localPreviewsMap[key] || []; }
  removeLocalFile(key: string, index: number): void {
    this.localPreviewsMap[key]?.splice(index, 1);
    this.fileMap[key]?.splice(index, 1);
  }
  getFileCount(key: string): number { return this.fileMap[key]?.length || 0; }
  getExistingFiles(key: string): string[] { return this.existingUrlMap[key] || []; }
  removeExistingFile(key: string, url: string): void {
    this.existingUrlMap[key] = this.existingUrlMap[key].filter(u => u !== url);
  }
  downloadFile(key: string): void {
    (this.fileMap[key] || []).forEach(file => {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a'); a.href = url; a.download = file.name;
      a.click(); URL.revokeObjectURL(url);
    });
    (this.existingUrlMap[key] || []).forEach(url => window.open(url, '_blank'));
  }

  // ===== Produits : gestion items texte + image =====

  getProduitItems(key: string): ProduitItem[] {
    return this.produitItemsMap[key] || [];
  }

  addProduitText(key: string): void {
    this.produitItemsMap[key].push({ type: 'text', value: '' });
  }

  triggerProduitImageInput(key: string): void {
    (document.getElementById('produit-file-' + key) as HTMLInputElement)?.click();
  }

onProduitImageSelected(event: Event, key: string): void {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;
  Array.from(input.files).forEach(file => {
    this.produitItemsMap[key].push({ type: 'image', value: '' });
    this.produitFilesMap[key].push(file);
    const objectUrl = URL.createObjectURL(file);
    this.produitRawUrlsMap[key].push(objectUrl);                          // pour révoquer
    this.produitPreviewsMap[key].push(
      this.sanitizer.bypassSecurityTrustUrl(objectUrl)                    // pour afficher
    );
  });
  input.value = '';
}
removeProduitItem(key: string, index: number): void {
  const item = this.produitItemsMap[key][index];
  if (item.type === 'image' && !item.value) {
    const emptyImagesBefore = this.produitItemsMap[key]
      .slice(0, index)
      .filter(i => i.type === 'image' && !i.value).length;
    const rawUrl = this.produitRawUrlsMap[key][emptyImagesBefore];
    if (rawUrl) URL.revokeObjectURL(rawUrl);                              // string ✓
    this.produitRawUrlsMap[key].splice(emptyImagesBefore, 1);
    this.produitPreviewsMap[key].splice(emptyImagesBefore, 1);
    this.produitFilesMap[key].splice(emptyImagesBefore, 1);
  }
  this.produitItemsMap[key].splice(index, 1);
}

getProduitImagePreview(key: string, index: number): SafeUrl | string {
  const item = this.produitItemsMap[key][index];
  if (item.value) return item.value; // URL Cloudinary, déjà sûre

  const emptyImagesBefore = this.produitItemsMap[key]
    .slice(0, index)
    .filter(i => i.type === 'image' && !i.value).length;
  return this.produitPreviewsMap[key]?.[emptyImagesBefore] || '';
}

  // ===== Stepper =====

  next(): void { if (this.currentStep < this.totalSteps) this.currentStep++; }
  prev(): void { if (this.currentStep > 1) this.currentStep--; }
  goTo(step: number): void { this.currentStep = step; }

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
    ...this.step2Form.value,
    ...this.step3Form.value,
    reseauxSociaux: Object.values(this.socialForm.value).filter((v: any) => v?.trim() !== ''),
    canauxContact:  Object.values(this.contactForm.value).filter((v: any) => v?.trim() !== ''),
    userId: this.userId   // ← ajouter juste ça
  };

  const produitItemsJson: { [key: string]: string } = {};
  this.produitKeys.forEach(key => {
    produitItemsJson[key] = JSON.stringify(this.produitItemsMap[key]);
  });

  const request$ = this.isEditMode
    ? this.clientService.update(
        this.projetToEdit.id, data,
        this.fileMap, this.existingUrlMap,
        produitItemsJson, this.produitFilesMap
      )
    : this.clientService.create(
        data, this.fileMap,
        produitItemsJson, this.produitFilesMap
      );

  request$.subscribe({
    next: () => {
      this.isLoading = false;
      this.successMessage = this.isEditMode ? 'Client modifié avec succès !' : 'Client créé avec succès !';
      this.submitted = true;
    },
    error: (err) => { this.isLoading = false; console.error(err); }
  });
}

  // ===== Auth / misc =====

  logout(): void {
    this.authService.logout();
    Swal.fire({ icon: 'error', title: 'Vous êtes déconnecté', showConfirmButton: false, timer: 1500 });
    this.router.navigate(['/']);
  }

  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }

  // ===== PDF (inchangé sauf produits) =====

  async generatePDF(): Promise<void> {
    const doc = new jsPDF();
    let y = 20;

    const addTitle = (title: string) => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
      doc.setTextColor(99, 65, 196); doc.text(title, 15, y);
      y += 8; doc.setTextColor(0, 0, 0);
    };

    const addField = (label: string, value: string) => {
      if (!value || value.trim() === '') return;
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
      doc.text(`• ${label} :`, 15, y); y += 5;
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(value, 175);
      doc.text(lines, 20, y); y += lines.length * 5 + 3;
    };

    const addImagesFromUrls = async (label: string, urls: string[]) => {
      if (!urls?.length) return;
      if (y > 250) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
      doc.text(` ${label}`, 15, y); y += 6;
      for (const url of urls) {
        try {
          const blob = await (await fetch(url)).blob();
          const base64 = await new Promise<string>(res => {
            const r = new FileReader(); r.onload = () => res(r.result as string); r.readAsDataURL(blob);
          });
          const img = new Image(); img.src = base64;
          await new Promise(r => img.onload = r);
          const ratio = Math.min(80 / img.width, 60 / img.height);
          const w = img.width * ratio, h = img.height * ratio;
          if (y + h > 270) { doc.addPage(); y = 20; }
          doc.addImage(base64, url.split('.').pop()?.toLowerCase() === 'png' ? 'PNG' : 'JPEG', 20, y, w, h);
          y += h + 5;
        } catch {
          doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
          const lines = doc.splitTextToSize(url, 170);
          doc.text(lines, 20, y); y += lines.length * 5 + 3;
        }
      }
      y += 3;
    };

    // En-tête
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
    doc.setTextColor(99, 65, 196);
    doc.text('Fiche Client', 105, y, { align: 'center' });
    y += 15; doc.setTextColor(0, 0, 0);

    addTitle('1. Fiche Client');
    addField('Client', this.step1Form.value.client);
    addField('Secteur', this.step1Form.value.secteur);
    addField('Catégorie', this.step1Form.value.categorie);
    addField('Responsable', this.step1Form.value.responsableNomPrenom);
    addField('Adresse', this.step1Form.value.responsableAdresse);
    addField('Téléphone', this.step1Form.value.responsableTelephone);
    addField('Email', this.step1Form.value.responsableEmail);
    y += 5;

    addTitle('2. Graphique & Identités');
    await addImagesFromUrls('Logo', this.existingUrlMap['logo']);
    await addImagesFromUrls('Avatars', this.existingUrlMap['avatars']);
    await addImagesFromUrls('Charte graphique', this.existingUrlMap['charteGraphique']);
    await addImagesFromUrls('Polices de caractères', this.existingUrlMap['policesCaracteres']);
    await addImagesFromUrls('Images & illustrations', this.existingUrlMap['imagesIllustrations']);
    await addImagesFromUrls('Couleur secondaire', this.existingUrlMap['couleurSecondaire']);
    addField('Couleur à ne pas utiliser', this.step2Form.value.couleurANePasUtiliser);
    addField('Autres données', this.step2Form.value.autresDonnees);
    addField('Autres commentaires', this.step2Form.value.autresCommentaires);
    y += 5;

    addTitle('3. Digital');
    addField('Site web', this.step3Form.value.siteWeb);
    addField('Réseaux sociaux',
      Object.entries(this.socialForm.value)
        .filter(([_, v]) => v && (v as string).trim() !== '')
        .map(([k, v]) => `${k}: ${v}`).join('\n'));
    addField('Coordonnées', this.step3Form.value.coordonnees);
    addField('Services reconnus & outils', this.step3Form.value.servicesReconnusOutils);
    addField('Concurrent', this.step3Form.value.concurrent);
    y += 5;

addTitle('4. Marque & Produits');
for (const key of this.produitKeys) {
  const produitItems: ProduitItem[] = this.produitItemsMap[key] || [];
  if (!produitItems.length) continue;
  if (y > 260) { doc.addPage(); y = 20; }
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10);
  doc.text(`• ${this.produitLabels[key]} :`, 15, y); y += 6;
  for (const produitItem of produitItems) {
    if (produitItem.type === 'text') {
      if (!produitItem.value || produitItem.value.trim() === '') continue;
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
      const lines = doc.splitTextToSize(produitItem.value, 175);
      doc.text(lines, 20, y); y += lines.length * 5 + 3;
    } else if (produitItem.type === 'image' && produitItem.value) {
      await addImagesFromUrls('', [produitItem.value]);
    }
  }
}

    doc.save(`fiche-client-${this.step1Form.value.client || 'export'}.pdf`);
  }
}