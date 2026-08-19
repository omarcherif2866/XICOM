import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from 'src/app/models/service';
import { ServiceService } from 'src/app/service/service.service';
import Swal from 'sweetalert2';
import { Country } from '../home-page/home-page.component';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PartenaireService } from 'src/app/service/partenaire.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.css']
})
export class ServiceDetailsComponent implements OnInit {

showCommandeForm = false;
  isLoading = false;

  serviceId!: any;
  loading = false;
  services: Service[] = [];
  allCountriesCodes: Country[] = [];
  contactForm: FormGroup;
  currentTheme: any = {};
  allPartners: any[] = [];
  currentIndexPartners = 0;
  visiblePartners: any[] = [];
showDialog = false;
selectedDetails: { title: string; checked: boolean }[] = [];
commandeForm: FormGroup = this.fb.group({
  objectifs:        ['', Validators.required],
  analyseSituation: ['', Validators.required],
  messageCle:       ['', Validators.required],
  brief:            ['', Validators.required],
  devis:            ['', Validators.required],
  delaiSouhaite:    ['', Validators.required],
});
private serviceThemes: { [key: number]: any } = {
  1: {
    gradientStart: '#0059da', gradientEnd: '#7298d1',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#7298d1',
    buttonColor: '#0059da', // ✅ déjà correct
    buttonTextColor: '#fff', gradientType: 'radial'
  },
  2: {
    gradientStart: '#5139bc', gradientEnd: '#5139bc',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#5139bc',
    buttonColor: '#5139bc', // ✅ déjà correct
    buttonTextColor: '#fff', gradientType: 'radial'
  },
  3: {
    gradientStart: '#f43f79', gradientEnd: '#fd8d6d',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#f43f79',
    buttonColor: '#f43f79', // ✅ rose
    buttonTextColor: '#fff', gradientType: 'radial'
  },
  4: {
    gradientStart: '#dc9d35', gradientEnd: '#d79022',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#dc9d35',
    buttonColor: '#dc9d35', // ✅ orange
    buttonTextColor: '#fff', gradientType: 'radial'
  },
  5: {
    gradientStart: '#f5761c', gradientEnd: '#ed6402',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#f5761c',
    buttonColor: '#f5761c', // ✅ bleu ardoise
    buttonTextColor: '#fff', gradientType: 'radial'
  },
  6: {
    gradientStart: '#a49dff', gradientEnd: '#a49dff',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#a49dff',
    buttonColor: '#a49dff', // ✅ rose fuchsia
    buttonTextColor: '#fff', gradientType: 'radial'
  },
  7: {
    gradientStart: '#9fce32', gradientEnd: '#9fce32',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#9fce32',
    buttonColor: '#9fce32', // ✅ brun doré
    buttonTextColor: '#fff', gradientType: 'radial'
  },
  8: {
    gradientStart: '#dd80dd', gradientEnd: '#dd80dd',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#dd80dd',
    buttonColor: '#dd80dd', // ✅ violet
    buttonTextColor: '#fff', gradientType: 'radial'
  },
  9: {
    gradientStart: '#018f88', gradientEnd: '#018f88',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#018f88',
    buttonColor: '#018f88', // ✅ vert olive
    buttonTextColor: '#fff', gradientType: 'radial'
  },
  10: {
    gradientStart: '#c90c61', gradientEnd: '#df0e70',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#c90c61',
    buttonColor: '#c90c61', // ✅ rouge rosé
    buttonTextColor: '#fff', gradientType: 'radial'
  },
  11: {
    gradientStart: '#e6856d', gradientEnd: '#e6856d',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#e6856d',
    buttonColor: '#e6856d', // ✅ rouge vif
    buttonTextColor: '#fff', gradientType: 'radial'
  },
  12: {
    gradientStart: '#00dce4', gradientEnd: '#0c8488',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#00dce4',
    buttonColor: '#00dce4', // ✅ bordeaux
    buttonTextColor: '#fff', gradientType: 'radial'
  },
    13: {
    gradientStart: '#dd406a', gradientEnd: '#e4023c',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#dd406a',
    buttonColor: '#dd406a', // ✅ bordeaux
    buttonTextColor: '#fff', gradientType: 'radial'
  },
    14: {
    gradientStart: '#3abec7', gradientEnd: '#01a1ac',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#3abec7',
    buttonColor: '#3abec7', // ✅ bordeaux
    buttonTextColor: '#fff', gradientType: 'radial'
  },
    15: {
    gradientStart: '#d8d650', gradientEnd: '#c2bf00',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#c2bf00',
    buttonColor: '#d8d650', // ✅ bordeaux
    buttonTextColor: '#fff', gradientType: 'radial'
  },
    16: {
    gradientStart: '#018945', gradientEnd: '#028c47',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#018945',
    buttonColor: '#018945', // ✅ bordeaux
    buttonTextColor: '#fff', gradientType: 'radial'
  },
    17: {
    gradientStart: '#f755ce', gradientEnd: '#f755ce',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#f755ce',
    buttonColor: '#f755ce', // ✅ bordeaux
    buttonTextColor: '#fff', gradientType: 'radial'
  },
    18: {
    gradientStart: '#f39bba', gradientEnd: '#ee88ac',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#ee88ac',
    buttonColor: '#f39bba', // ✅ bordeaux
    buttonTextColor: '#fff', gradientType: 'radial'
  },
    19: {
    gradientStart: '#2b89c9', gradientEnd: '#4ba6e2',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#4ba6e2',
    buttonColor: '#2b89c9', // ✅ bordeaux
    buttonTextColor: '#fff', gradientType: 'radial'
  },
    20: {
    gradientStart: '#fdb507', gradientEnd: '#e0a101',
    gradientStartPosition: '20%', gradientEndPosition: '90%',
    borderColor: '#fdb507',
    buttonColor: '#fdb507', // ✅ bordeaux
    buttonTextColor: '#fff', gradientType: 'radial'
  },
};
  constructor(
        private serviceService: ServiceService,
        private partenaireService: PartenaireService,
        private route: ActivatedRoute,
        private http: HttpClient,
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService

  ) { 

      this.contactForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+33', Validators.required], // Changé de +33 à +33 pour la Tunisie par défaut
      sujet: ['', Validators.required],
      phone: ['', Validators.required],
      message: ['', Validators.required],    
    });

  }

  ngOnInit(): void {
    this.loadCountriesCodes();

    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
    
    // Charger le service spécifique
    this.fetchServiceDetails(this.serviceId);   
    this.setServiceTheme(this.serviceId);
    this.loadPartners();

  }


setServiceTheme(serviceId: number): void {
  const themeCount = Object.keys(this.serviceThemes).length;
  const themeIndex = ((serviceId - 1) % themeCount) + 1;
  this.currentTheme = this.serviceThemes[themeIndex];
  
}

/**
 * ✅ Mise à jour pour supporter les gradients radiaux
 */
getGradientCardStyle(): any {
  if (!this.currentTheme) return {};
  
  let gradientStyle = '';
  
  if (this.currentTheme.gradientType === 'radial') {
    // Gradient radial
    const startPos = this.currentTheme.gradientStartPosition || '0%';
    const endPos = this.currentTheme.gradientEndPosition || '100%';
    
    gradientStyle = `radial-gradient(circle, ${this.currentTheme.gradientStart} ${startPos}, ${this.currentTheme.gradientEnd} ${endPos})`;
  } else {
    // Gradient linéaire (par défaut)
    gradientStyle = `linear-gradient(135deg, ${this.currentTheme.gradientStart} 0%, ${this.currentTheme.gradientEnd} 100%)`;
  }
  
  return {
    'background': gradientStyle,
    'border': `2px solid ${this.currentTheme.borderColor}`,
    'color': '#fff'
  };
}

    getButtonStyle(): any {
    return {
      'background': this.currentTheme.buttonColor,
      'color': this.currentTheme.buttonTextColor,
      'border': 'none'
    };
  }



  


fetchServiceDetails(id: number) {
  this.loading = true;

  this.serviceService.getServiceById(id).subscribe({
    next: (response: any) => {

      // Mettre une seule service dans le tableau
      this.services = [new Service(response)];
      // ⬇️ AJOUTE CETTE LIGNE POUR LE CARROUSEL
      // console.log('sections[1] details:', response.sections?.[1]?.details);

      this.loading = false;

    },
    
    error: (error) => {
      console.error('Erreur chargement Service:', error);
      this.loading = false;

      Swal.fire({
        icon: 'error',
        title: 'Erreur lors du chargement des données',
        showConfirmButton: false,
        timer: 1500
      });
    }
  });
}

  loadPartners(): void {
    this.partenaireService.getPartenaireByService(this.serviceId).subscribe({
      next: (partners) => {
        this.allPartners = partners; // Stocker TOUS les partenaires
        this.updateVisiblePartners(); // Initialiser les partenaires visibles
      },
      error: (error) => {
        console.error('Erreur lors du chargement des partenaires:', error);
        this.allPartners = [];
        this.visiblePartners = [];
      }
    });
  }


isValidIcon(url: string | null): boolean {
  if (!url) return false;
  if (url.startsWith('blob:')) return false;
  if (url.trim() === '') return false;
  if (url === 'icon') return false; // cas corrompu
  return true;
}

sanitizeImage(url: string | null): string {
  if (!url) return '';
  if (url.startsWith('blob:')) return '';

  if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
    const parts = url.split("https://res.cloudinary.com/dnrnrxm9q/image/upload/");
    return "https://res.cloudinary.com/dnrnrxm9q/image/upload/" + parts[parts.length - 1];
  }

  return url;
}

getColorByIndex(index: number): string {
  const colors = [
    '#EFFBFF', 
    '#FFEDED', 
    '#FFEEEA',
    '#ECEBFF', 
  ];
  return colors[index % colors.length];
}


  async loadCountriesCodes(): Promise<void> {
    try {
      const response: any = await this.http.get('assets/countries.json').toPromise();
      this.allCountriesCodes = response.sort((a: Country, b: Country) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('⚠️ Erreur lors du chargement des pays:', error);
      this.allCountriesCodes = [];
    }
  }

      getSelectedCountryFlagContactForm(): string {
    const selectedDialCode = this.contactForm.get('countryCode')?.value;
    const country = this.allCountriesCodes.find(c => c.dial_code === selectedDialCode);
    return country?.flags?.png || '';
  }


    getSelectedCountryContactForm(): Country | undefined {
    const selectedDialCode = this.contactForm.get('countryCode')?.value;
    return this.allCountriesCodes.find(c => c.dial_code === selectedDialCode);
  }


  updateVisiblePartners(): void {
    const total = this.allPartners.length;
    
    if (total === 0) {
      this.visiblePartners = [];
      return;
    }

    this.visiblePartners = [];
    
    // Afficher 4 partenaires maximum
    const itemsToShow = Math.min(4, total);
    
    for (let i = 0; i < itemsToShow; i++) {
      const index = (this.currentIndexPartners + i) % total;
      this.visiblePartners.push(this.allPartners[index]);
    }
    
  }

  scrollRightPartners(): void {
    if (this.allPartners.length === 0) return;
    
    this.currentIndexPartners = (this.currentIndexPartners + 1) % this.allPartners.length;
    this.updateVisiblePartners();
  }

  scrollLeftPartners(): void {
    if (this.allPartners.length === 0) return;
    
    this.currentIndexPartners = 
      (this.currentIndexPartners - 1 + this.allPartners.length) % this.allPartners.length;
    this.updateVisiblePartners();
  }


openCommanderDialog(): void {
  const token = this.authService.getToken();

  if (!token) {
    Swal.fire({
      title: 'Connexion requise',
      text: 'Vous devez être connecté pour accéder à cette page.',
      icon: 'warning',
      confirmButtonText: 'Se connecter',
      cancelButtonText: 'Annuler',
      showCancelButton: true,
      confirmButtonColor: '#6863BF',
      cancelButtonColor: '#aaa',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/signin']);
      }
    });
  } else {
    const details = this.services[0]?.Sections[1]?.details || [];
    this.selectedDetails = details.map((d: any) => ({ title: d.title, checked: false }));
    this.showDialog = true;
  }
}

getAllDetails(): string[] {
  const details: string[] = [];
  const section = this.services[0]?.Sections?.[1]; // ← uniquement section index 1
  if (section?.details) {
    section.details.forEach((detail: any) => {
      if (detail.title) details.push(detail.title);
    });
  }
  return details;
}

// closeDialog(): void {
//   this.showDialog = false;
//     this.showCommandeForm = false;
//   this.commandeForm.reset();
// }

closeDialog(): void {
  this.showDialog = false;
  this.commandeForm.reset(); // ← à supprimer puisque commandeForm n'existe plus
}

// confirmerCommande(): void {
//   const userId = this.authService.getUserIdFromToken();
//   if (!userId) return;

//   const selected = this.selectedDetails
//     .filter(d => d.checked)
//     .map(d => d.title);

//   if (selected.length === 0) {
//     Swal.fire({ icon: 'warning', title: 'Sélectionnez au moins une prestation', timer: 2000, showConfirmButton: false });
//     return;
//   }

// const serviceTitle = this.services[0]?.Title;

// if (!serviceTitle) {
//   Swal.fire({ icon: 'warning', title: 'Service introuvable', timer: 2000, showConfirmButton: false });
//   return;
// }
//   this.serviceService.commander(serviceTitle, selected, userId).subscribe({
//     next: () => {
//       this.showDialog = false;
//       Swal.fire({ icon: 'success', title: 'Commande envoyée !', timer: 2000, showConfirmButton: false });
//     },
//     error: (err) => console.error(err)
//   });
// }
openCommandeForm(): void {
  this.showCommandeForm = true;
}

closeCommandeForm(): void {
  this.showCommandeForm = false;
  this.commandeForm.reset();
}

// submitCommande(): void {
//   this.commandeForm.markAllAsTouched();
//   if (this.commandeForm.invalid) return;

//   const userId = this.authService.getUserIdFromToken();
//   if (!userId) return;

//   const selected = this.selectedDetails
//     .filter(d => d.checked)
//     .map(d => d.title);

//   if (selected.length === 0) {
//     Swal.fire({ icon: 'warning', title: 'Sélectionnez au moins une prestation', timer: 2000, showConfirmButton: false });
//     return;
//   }

//   const serviceTitle = this.services[0]?.Title;
//   if (!serviceTitle) {
//     Swal.fire({ icon: 'warning', title: 'Service introuvable', timer: 2000, showConfirmButton: false });
//     return;
//   }
//   this.isLoading = true;

//   const payload = {
//     serviceTitle,
//     detailTitles:     selected,
//     objectifs:        this.commandeForm.value.objectifs,
//     analyseSituation: this.commandeForm.value.analyseSituation,
//     messageCle:       this.commandeForm.value.messageCle,
//     brief:            this.commandeForm.value.brief,
//     devis:            this.commandeForm.value.devis,
//     delaiSouhaite:    this.commandeForm.value.delaiSouhaite,
//     status:           'en cours',
//   };

//   this.serviceService.commander(payload, userId).subscribe({
//     next: () => {
//       this.isLoading = false;
//       this.closeDialog();
//       this.selectedDetails.forEach(d => d.checked = false);
//       Swal.fire({ icon: 'success', title: 'Commande envoyée !', timer: 1500, showConfirmButton: false });
//     },
//     error: (err) => console.error(err)
//   });
// }

submitCommande(): void {
  const userId = this.authService.getUserIdFromToken();
  if (!userId) return;

  const selected = this.selectedDetails
    .filter(d => d.checked)
    .map(d => d.title);

  if (selected.length === 0) {
    Swal.fire({ icon: 'warning', title: 'Sélectionnez au moins une prestation', timer: 2000, showConfirmButton: false });
    return;
  }

  const serviceTitle = this.services[0]?.Title;
  if (!serviceTitle) {
    Swal.fire({ icon: 'warning', title: 'Service introuvable', timer: 2000, showConfirmButton: false });
    return;
  }

  this.isLoading = true;

  const payload = {
    serviceTitle,
    detailTitles:     selected,
    packTitle:        '',
    packPrice: '',
    status:           'en cours',
  };

  this.serviceService.commander(payload, userId).subscribe({
    next: () => {
      this.isLoading = false;
      this.closeDialog();
      this.selectedDetails.forEach(d => d.checked = false);
      Swal.fire({ icon: 'success', title: 'Commande envoyée !', timer: 1500, showConfirmButton: false });
    },
    error: (err) => {
      this.isLoading = false;
      console.error(err);
    }
  });
}

getIconBoxStyle(isPremium: boolean): any {
  if (!this.currentTheme) return {};
  if (isPremium) {
    return {
      'background': 'rgba(255,255,255,0.2)',
      'border': '1px solid rgba(255,255,255,0.35)'
    };
  }
  return {
    'background': this.hexToRgba(this.currentTheme.buttonColor, 0.12),
    'border': `1px solid ${this.hexToRgba(this.currentTheme.buttonColor, 0.25)}`
  };
}

getHeroStyle(isLast: boolean): any {
  if (!this.currentTheme) return {};

  if (isLast) {
    // Dernière card : fond très clair (blanc 20%)
    return {
      'background': 'rgba(255, 255, 255, 0.2)',
      'border': '1px solid rgba(255, 255, 255, 0.35)'
    };
  } else {
    // Cards normales : même couleur que le bouton mais claire
    return {
      'background': this.hexToRgba(this.currentTheme.borderColor, 0.12)
    };
  }
}

getIconFilterStyle(isLast: boolean): any {
  if (isLast) {
    // Crown en gold
    return {
      'filter': 'invert(74%) sepia(60%) saturate(500%) hue-rotate(5deg) brightness(105%)',
      'width': '28px',
      'height': '28px'
    };
  } else {
    // Icône colorée avec la couleur du bouton (sombre)
    return {
      'filter': this.colorToFilter(this.currentTheme.buttonColor),
      'width': '26px',
      'height': '26px'
    };
  }
}

// Utilitaire hex → rgba
hexToRgba(hex: string, opacity: number): string {
  if (!hex) return `rgba(0,0,0,${opacity})`;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0,0,0,${opacity})`;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

// Convertit la couleur hex en filtre CSS pour colorier le SVG
colorToFilter(hex: string): string {
  // Utilise une teinte sombre basée sur la couleur du service
  return `invert(20%) sepia(80%) saturate(400%) hue-rotate(${this.getHueFromHex(hex)}deg) brightness(70%)`;
}

getHueFromHex(hex: string): number {
  if (!hex) return 0;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return 0;
  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  if (max !== min) {
    const d = max - min;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return Math.round(h * 360);
}

// Bordure de la card normale avec couleur du service
getCardBorderStyle(): any {
  if (!this.currentTheme) return {};
  return {
    'border': `1.5px solid ${this.hexToRgba(this.currentTheme.gradientStart, 0.15)}`
  };
}

getIconMaskStyle(iconPath: string, isLast: boolean): any {
  const color = isLast ? '#F5C518' : this.currentTheme?.buttonColor || '#333';

  return {
    'width': '26px',
    'height': '26px',
    'background-color': color,
    '-webkit-mask-image': `url(${iconPath})`,
    'mask-image': `url(${iconPath})`,
    '-webkit-mask-size': 'contain',
    'mask-size': 'contain',
    '-webkit-mask-repeat': 'no-repeat',
    'mask-repeat': 'no-repeat',
    '-webkit-mask-position': 'center',
    'mask-position': 'center',
    'display': 'block'
  };
}

getCheckCircleStyle(): any {
  const color = this.currentTheme?.buttonColor || '#333';
  return {
    'background': color,           // ← fond plein avec la couleur du service
    'width': '28px',
    'height': '28px',
    'border-radius': '50%',
    'display': 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    'flex-shrink': '0'
  };
}

getCheckMaskStyle(): any {
  return {
    'width': '14px',
    'height': '14px',
    'background-color': '#ffffff',  // ← check blanc
    '-webkit-mask-image': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E")`,
    'mask-image': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E")`,
    '-webkit-mask-size': 'contain',
    'mask-size': 'contain',
    '-webkit-mask-repeat': 'no-repeat',
    'mask-repeat': 'no-repeat',
    '-webkit-mask-position': 'center',
    'mask-position': 'center',
    'display': 'block'
  };
}

getSecondaryButtonStyle(): any {
  const color = this.currentTheme?.buttonColor || '#333';
  return {
    'background': 'white',
    'color': color,
    'border': `2px solid ${color}`,
  };
}


getRdvBannerStyle(): any {
  const color = this.currentTheme?.buttonColor || '#5b4fcf';
  const start = this.currentTheme?.gradientStart || color;
  const end   = this.currentTheme?.gradientEnd   || color;
  return {
    'background': `linear-gradient(135deg, ${start} 0%, ${end} 100%)`
  };
}

getRdvIconWrapStyle(): any {
  return {
    'background': 'rgba(255,255,255,0.15)',
    'border-radius': '50%',
    'width': '80px',
    'height': '80px',
    'display': 'flex',
    'align-items': 'center',
    'justify-content': 'center',
    'flex-shrink': '0'
  };
}

getRdvIconMaskStyle(): any {
  return {
    'width': '38px',
    'height': '38px',
    'background-color': '#ffffff',
    '-webkit-mask-image': `url(../../../assets/icons/telegram.svg)`,
    'mask-image': `url(../../../assets/icons/telegram.svg)`,
    '-webkit-mask-size': 'contain',
    'mask-size': 'contain',
    '-webkit-mask-repeat': 'no-repeat',
    'mask-repeat': 'no-repeat',
    '-webkit-mask-position': 'center',
    'mask-position': 'center',
    'display': 'block'
  };
}

getRdvButtonStyle(): any {
  const color = this.currentTheme?.buttonColor || '#5b4fcf';
  return {
    'background': '#ffffff',
    'color': color,
    'border': 'none'
  };
}

openWhatsApp(): void {
  const phoneNumber = '33777124091';
  const serviceTitle = this.services[0]?.Title || this.services[0]?.Title;
  const message = serviceTitle
    ? encodeURIComponent(`Bonjour, je souhaite en savoir plus sur votre service "${serviceTitle}".`)
    : encodeURIComponent('Bonjour, je souhaite en savoir plus sur vos services.');
  const url = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(url, '_blank');
}

navigateToCommande(pack: any): void {
  sessionStorage.setItem('selectedPack', JSON.stringify(pack));
  sessionStorage.setItem('selectedService', JSON.stringify(this.services[0])); // ✅ services[0]
  this.router.navigate(['/commande_service']);
}

}