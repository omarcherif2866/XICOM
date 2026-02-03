import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Details, PriceSection, Service, ServiceSection } from 'src/app/models/service';
import { AuthService } from 'src/app/service/auth.service';
import { IconsService } from 'src/app/service/icons.service';
import { ServiceService } from 'src/app/service/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  // Liste des services
  services: Service[] = [];
    sidebarOpen = true;
  availableIcons: string[] = [];
  loadingIcons = false;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  pagesArray: number[] = [];
  currentItems: Service[] = [];
  
  // État de chargement
  loading: boolean = false;
  isSubmitting: boolean = false;

  // Modal
  showModal: boolean = false;
  modalMode: 'add' | 'edit' = 'add';
  currentModalStep: number = 1;
  
  // Données du formulaire
  formData: {
    id: any;
    title: string;
    subtitle: string;
    image: string | null;
    icon: string | null;
    sections: ServiceSection[];
    priceSections: PriceSection[];
  } = this.getEmptyFormData();

  // Fichiers sélectionnés
  selectedImage: File | null = null;
  selectedIcon: File | null = null;


  constructor(
    private serviceService: ServiceService,
    private iconsService: IconsService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadServices();
    this.loadAvailableIcons();
  }

  /**
   * Charger tous les services
   */
  loadServices(): void {
    this.loading = true;
    
    this.serviceService.getService().subscribe({
      next: (data: Service[]) => {
        this.services = data.map(item => new Service(item));
        this.calculatePagination();
        this.updateCurrentItems();
        this.loading = false;
        console.log('Services chargés:', this.services);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des services:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Calculer la pagination
   */
  calculatePagination(): void {
    this.totalPages = Math.ceil(this.services.length / this.itemsPerPage);
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /**
   * Mettre à jour les éléments de la page courante
   */
  updateCurrentItems(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.currentItems = this.services.slice(startIndex, endIndex);
  }

  /**
   * Gérer le changement de page
   */
  handlePageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateCurrentItems();
    }
  }

  /**
   * Sanitize l'image pour l'affichage
   */
  sanitizeImage(image: string | null): SafeUrl | string {
    if (!image) {
      return 'assets/images/placeholder.png';
    }
    
    if (image.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustUrl(image);
    }
    
    return image;
  }

  /**
   * Obtenir la preview d'une icône
   */
  getIconPreview(icon: any): SafeUrl | string {
    if (!icon) return 'assets/images/placeholder.png';
    
    // Si c'est un objet File
    if (icon instanceof File) {
      const objectUrl = URL.createObjectURL(icon);
      return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
    }
    
    // Si c'est une string base64 ou URL
    if (typeof icon === 'string' && icon.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustUrl(icon);
    }

    if (typeof icon === 'string' && (icon.startsWith('http') || icon.startsWith('https'))) {
      return icon;
    }
    
    return 'assets/images/placeholder.png';
  }

  /**
   * Ajouter un nouveau service
   */
  handleAdd(): void {
    this.modalMode = 'add';
    this.formData = this.getEmptyFormData();
    this.selectedImage = null;
    this.selectedIcon = null;
    this.currentModalStep = 1;
    this.showModal = true;
  }

  /**
   * Modifier un service
   */
  handleEdit(service: Service): void {
    this.modalMode = 'edit';
    this.formData = {
      id: service.Id,
      title: service.Title || '',
      subtitle: service.Subtitle || '',
      image: service.Image,
      icon: service.Icon,
      sections: JSON.parse(JSON.stringify(service.Sections || [])), // Deep clone
      priceSections: JSON.parse(JSON.stringify(service.PriceSection || []))
    };
    
    // S'assurer qu'il y a toujours 4 sections
    while (this.formData.sections.length < 4) {
      this.formData.sections.push(this.getEmptySection());
    }
    
    this.selectedImage = null;
    this.selectedIcon = null;
    this.currentModalStep = 1;
    this.showModal = true;
  }

  /**
   * Supprimer un service
   */
  handleDelete(serviceId: any): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      this.loading = true;
      
      this.serviceService.deleteService(serviceId).subscribe({
        next: () => {
          alert('Service supprimé avec succès');
          this.loadServices();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression du service:', error);
          this.loading = false;
          alert('Erreur lors de la suppression du service');
        }
      });
    }
  }

  /**
   * Toggle sidebar
   */
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // ============ GESTION DU MODAL ============

  /**
   * Fermer le modal
   */
  closeModal(): void {
    if (confirm('Êtes-vous sûr de vouloir annuler ? Les modifications non enregistrées seront perdues.')) {
      this.showModal = false;
      this.formData = this.getEmptyFormData();
      this.selectedImage = null;
      this.selectedIcon = null;
    }
  }

  /**
   * Naviguer vers une étape spécifique
   */
  goToModalStep(step: number): void {
    if (step >= 1 && step <= 4) {
      this.currentModalStep = step;
    }
  }

  /**
   * Étape suivante
   */
  nextModalStep(): void {
    if (this.validateCurrentStep()) {
      this.currentModalStep++;
    }
  }

  /**
   * Étape précédente
   */
  previousModalStep(): void {
    if (this.currentModalStep > 1) {
      this.currentModalStep--;
    }
  }

  /**
   * Valider l'étape actuelle
   */
  validateCurrentStep(): boolean {
    switch (this.currentModalStep) {
      case 1:
        if (!this.formData.title || !this.formData.title.trim()) {
          alert('Le titre est obligatoire');
          return false;
        }
        if (this.modalMode === 'add' && !this.selectedImage) {
          alert('L\'image est obligatoire');
          return false;
        }
        if (this.modalMode === 'add' && !this.selectedIcon) {
          alert('L\'icône est obligatoire');
          return false;
        }
        return true;
      
      default:
        return true;
    }
  }

  // ============ GESTION DES FICHIERS ============

  /**
   * Sélection de l'image principale
   */
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 200MB');
        return;
      }
      this.selectedImage = file;
    }
  }

  /**
   * Sélection de l'icône
   */
  onIconSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 200 * 1024 * 1024) {
        alert('L\'icône ne doit pas dépasser 200MB');
        return;
      }
      this.selectedIcon = file;
    }
  }

  /**
   * Sélection d'une icône pour un détail de section
   */
  onDetailIconSelected(event: any, sectionIndex: number, detailIndex: number): void {
    const file = event.target.files[0];
    if (file) {
      // Validation de la taille (2MB au lieu de 200MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('L\'icône ne doit pas dépasser 2MB');
        return;
      }
      
      // Validation du type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Format non supporté. Utilisez PNG, JPG, SVG ou WEBP');
        return;
      }
      
      this.formData.sections[sectionIndex].details[detailIndex].icon = file;
    }
  }

  /**
   * Supprimer l'icône d'un détail de section
   */
  removeDetailIcon(sectionIndex: number, detailIndex: number): void {
    this.formData.sections[sectionIndex].details[detailIndex].icon = null;
  }

  /**
   * Sélection d'une icône pour un détail de prix
   */
  onPriceDetailIconSelected(event: any, priceIndex: number, detailIndex: number): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('L\'icône ne doit pas dépasser 2MB');
        return;
      }
      this.formData.priceSections[priceIndex].details[detailIndex].icon = file;
    }
  }

  /**
   * Supprimer l'icône d'un détail de prix
   */
  removePriceDetailIcon(priceIndex: number, detailIndex: number): void {
    this.formData.priceSections[priceIndex].details[detailIndex].icon = null;
  }

  // ============ GESTION DES SECTIONS ============

  /**
   * Ajouter un détail à une section
   */
  addDetailToSection(sectionIndex: number): void {
    this.formData.sections[sectionIndex].details.push({
      title: '',
      description: '',
      icon: null
    });
  }

  /**
   * Supprimer un détail d'une section
   */
  removeDetailFromSection(sectionIndex: number, detailIndex: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce détail ?')) {
      this.formData.sections[sectionIndex].details.splice(detailIndex, 1);
    }
  }

  // ============ GESTION DES PACKS DE PRIX ============

  /**
   * Ajouter une section de prix
   */
  addPriceSection(): void {
    this.formData.priceSections.push({
      title: '',
      subtitle: '',
      price: '',
      details: []
    });
  }

  /**
   * Supprimer une section de prix
   */
  removePriceSection(index: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce pack ?')) {
      this.formData.priceSections.splice(index, 1);
    }
  }

  /**
   * Ajouter un détail à une section de prix
   */
  addDetailToPriceSection(priceIndex: number): void {
    this.formData.priceSections[priceIndex].details.push({
      title: '',
      description: '',
      icon: null
    });
  }

  /**
   * Supprimer un détail d'une section de prix
   */
  removeDetailFromPriceSection(priceIndex: number, detailIndex: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette fonctionnalité ?')) {
      this.formData.priceSections[priceIndex].details.splice(detailIndex, 1);
    }
  }

  // ============ COMPTEURS ET RÉSUMÉS ============

  /**
   * Compter les sections complétées
   */
  countCompletedSections(): number {
    return this.formData.sections.filter(section => 
      section.headline && section.headline.trim() !== ''
    ).length;
  }

  /**
   * Compter les packs de prix complets
   */
countCompletedPriceSections(): number {
  return this.formData.priceSections.filter(ps =>
    ps.title?.trim() !== '' &&
    ps.price !== null &&
    ps.price !== undefined
  ).length;
}


  /**
   * Obtenir le nombre total de détails
   */
  getTotalDetailsCount(): number {
    return this.formData.sections.reduce((total, section) => 
      total + section.details.length, 0
    );
  }

  // ============ SOUMISSION DU FORMULAIRE ============

  /**
   * Soumettre le formulaire
   */
  async handleSubmit(): Promise<void> {
    if (this.isSubmitting) return;
    
    if (!this.validateForm()) {
      return;
    }
    
    this.isSubmitting = true;
    
    try {
      const formData = await this.prepareFormData();
      
      if (this.modalMode === 'add') {
        this.serviceService.addService(formData).subscribe({
          next: (response) => {
            alert('Service créé avec succès !');
            this.showModal = false;
            this.loadServices();
            this.isSubmitting = false;
          },
          error: (error) => {
            console.error('Erreur lors de la création:', error);
            alert('Erreur lors de la création du service');
            this.isSubmitting = false;
          }
        });
      } else {
        this.serviceService.putService(this.formData.id, formData).subscribe({
          next: (response) => {
            alert('Service modifié avec succès !');
            this.showModal = false;
            this.loadServices();
            this.isSubmitting = false;
          },
          error: (error) => {
            console.error('Erreur lors de la modification:', error);
            alert('Erreur lors de la modification du service');
            this.isSubmitting = false;
          }
        });
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue');
      this.isSubmitting = false;
    }
  }

  /**
   * Valider le formulaire
   */
  validateForm(): boolean {
    if (!this.formData.title || !this.formData.title.trim()) {
      alert('Le titre est obligatoire');
      this.goToModalStep(1);
      return false;
    }
    
    return true;
  }

  /**
   * Préparer les données pour l'envoi
   */
async prepareFormData(): Promise<FormData> {
  const formData = new FormData();
  
  formData.append('title', this.formData.title);
  formData.append('subtitle', this.formData.subtitle || '');
  
  if (this.selectedImage) {
    formData.append('image', this.selectedImage);
  }
  if (this.selectedIcon) {
    formData.append('icon', this.selectedIcon);
  }
  
  // ✅ Préparez les sections avec les URLs existantes
  const sectionsToSend = this.formData.sections.map((section) => ({
    headline: section.headline,
    subtitle: section.subtitle,
    details: section.details.map((detail) => {
      // Gardez l'URL si c'est une string, sinon mettez ""
      return {
        title: detail.title,
        description: detail.description,
        icon: typeof detail.icon === 'string' ? detail.icon : ""
      };
    })
  }));
  
  formData.append('sections', JSON.stringify(sectionsToSend));
  
  // ✅ Envoyez SEULEMENT les nouveaux fichiers File
  this.formData.sections.forEach((section) => {
    section.details.forEach((detail) => {
      if (detail.icon instanceof File) {
        formData.append('detailIcons', detail.icon);
        console.log('📤 Nouveau fichier:', detail.icon.name);
      }
    });
  });
  
  // Même chose pour priceSections
  const priceSectionsToSend = this.formData.priceSections.map((ps) => ({
    title: ps.title,
    subtitle: ps.subtitle,
    price: ps.price,
    details: ps.details.map((detail) => ({
      title: detail.title,
      description: detail.description,
      icon: typeof detail.icon === 'string' ? detail.icon : ""
    }))
  }));
  
  formData.append('priceSections', JSON.stringify(priceSectionsToSend));
  
  this.formData.priceSections.forEach((ps) => {
    ps.details.forEach((detail) => {
      if (detail.icon instanceof File) {
        formData.append('detailIcons', detail.icon);
      }
    });
  });
  
  return formData;
}

  /**
   * Convertir un fichier en base64
   */
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // ============ HELPERS ============

  /**
   * Obtenir un formulaire vide
   */
  getEmptyFormData() {
    return {
      id: null,
      title: '',
      subtitle: '',
      image: null,
      icon: null,
      sections: [
        this.getEmptySection(),
        this.getEmptySection(),
        this.getEmptySection(),
        this.getEmptySection()
      ],
      priceSections: []
    };
  }

  /**
   * Obtenir une section vide
   */
  getEmptySection(): ServiceSection {
    return {
      headline: '',
      subtitle: '',
      details: []
    };
  }

  logout(): void {
    this.authService.logout();
    Swal.fire({
      icon: 'info',
      title: 'Déconnexion',
      text: 'Vous êtes déconnecté',
      showConfirmButton: false,
      timer: 1500
    });
    this.router.navigate(['/']);
  }


  isIconSelected(iconUrl: any, detail: Details): boolean {
    return detail.icon === iconUrl;
  }

  selectIconFromGallery(iconUrl: string, detail: Details) {
    detail.icon = iconUrl;
    console.log('✅ Icône sélectionnée:', iconUrl);
  }


  loadAvailableIcons(): void {
  this.loadingIcons = true;
  console.log('🔄 Début chargement icônes...');
  
  this.iconsService.getAvailableIcons().subscribe({
    next: (icons: string[]) => {
      this.availableIcons = icons;
      this.loadingIcons = false;
      console.log('✅ Icônes reçues:', icons.length);
      console.log('📋 Liste:', icons);
    },
    error: (error) => {
      console.error('❌ Erreur:', error);
      console.error('Status:', error.status);
      console.error('Message:', error.message);
      this.loadingIcons = false;
    }
  });
}

}