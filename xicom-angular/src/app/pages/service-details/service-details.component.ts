import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Service } from 'src/app/models/service';
import { ServiceService } from 'src/app/service/service.service';
import Swal from 'sweetalert2';
import { Country } from '../home-page/home-page.component';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PartenaireService } from 'src/app/service/partenaire.service';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.css']
})
export class ServiceDetailsComponent implements OnInit {
  stats = [
    { icon: '../../../assets/icons/valise.svg', label: 'Nos projets', value: '+200', color: '#EFFBFF', valueColor: '#51B3D8'  },
    { icon: '../../../assets/icons/coeur.svg', label: 'Satisfaction', value: '4%', color: '#FFEDED', valueColor: '#F26D6E' },
    { icon: '../../../assets/icons/person.svg', label: 'Experts', value: '15', color: '#FFEEEA', valueColor: '#F1836A' },
    { icon: '../../../assets/icons/puzzle.svg', label: 'Collaborateurs', value: '40', color: '#ECEBFF', valueColor: '#6863BF' }
  ];

  serviceId!: any;
  loading = false;
  services: Service[] = [];
  allCountriesCodes: Country[] = [];
  contactForm: FormGroup;
  currentTheme: any = {};
  allPartners: any[] = [];
  currentIndexPartners = 0;
  visiblePartners: any[] = [];

  private serviceThemes: { [key: number]: any } = {
    1: {
    gradientStart: '#DD8484',
    gradientEnd: '#A94444',
    gradientStartPosition: '20%',
    gradientEndPosition: '90%',
    borderColor: '#151158',
    buttonColor: '#A94444',
    buttonTextColor: '#fff',
    gradientType: 'radial' // ✅ Nouveau type
  
    },
    2: {
    gradientStart: '#241E89',
    gradientEnd: '#6863BF',
    gradientStartPosition: '20%',
    gradientEndPosition: '90%',
    borderColor: '#241E89',
    buttonColor: '#241E89',
    buttonTextColor: '#fff',
    gradientType: 'radial' // ✅ Nouveau type
  },
    3: {
    gradientStart: '#378D62',
    gradientEnd: '#125835',
    gradientStartPosition: '20%',
    gradientEndPosition: '90%',
    borderColor: '#125835',
    buttonColor: '#303030',
    buttonTextColor: '#fff',
    gradientType: 'radial' // ✅ Nouveau type
  },
    4: {
    gradientStart: '#EEBE8B',
    gradientEnd: '#F58916',
    gradientStartPosition: '20%',
    gradientEndPosition: '90%',
    borderColor: '#F58916',
    buttonColor: '#303030',
    buttonTextColor: '#fff',
    gradientType: 'radial' // ✅ Nouveau type
  },
    5: {
    gradientStart: '#677AAB',
    gradientEnd: '#495A86',
    gradientStartPosition: '20%',
    gradientEndPosition: '90%',
    borderColor: '#303030',
    buttonColor: '#030303',
    buttonTextColor: '#fff',
    gradientType: 'radial' // ✅ Nouveau type
  },
    6: {
    gradientStart: '#DC88C4',
    gradientEnd: '#B53591',
    gradientStartPosition: '20%',
    gradientEndPosition: '90%',
    borderColor: '#B53591',
    buttonColor: '#303030',
    buttonTextColor: '#fff',
    gradientType: 'radial' // ✅ Nouveau type
  },
     7: {
    gradientStart: '#9F6219',
    gradientEnd: '#F3A950',
    gradientStartPosition: '20%',
    gradientEndPosition: '90%',
    borderColor: '#F3A950',
    buttonColor: '#303030',
    buttonTextColor: '#fff',
    gradientType: 'radial' // ✅ Nouveau type
  },
    8: {
    gradientStart: '#9B67CC',
    gradientEnd: '#C391F2',
    gradientStartPosition: '20%',
    gradientEndPosition: '90%',
    borderColor: '#C391F2',
    buttonColor: '#303030',
    buttonTextColor: '#fff',
    gradientType: 'radial' // ✅ Nouveau type
  },
    9: {
    gradientStart: '#ACB84A',
    gradientEnd: '#7D891E',
    gradientStartPosition: '20%',
    gradientEndPosition: '90%',
    borderColor: '#7D891E',
    buttonColor: '#303030',
    buttonTextColor: '#fff',
    gradientType: 'radial' // ✅ Nouveau type
  },
    10: {
    gradientStart: '#C07373',
    gradientEnd: '#DD8484',
    gradientStartPosition: '20%',
    gradientEndPosition: '90%',
    borderColor: '#DD8484',
    buttonColor: '#303030',
    buttonTextColor: '#fff',
    gradientType: 'radial' // ✅ Nouveau type
  },
    11: {
    gradientStart: '#C03947',
    gradientEnd: '#EE2D41',
    gradientStartPosition: '20%',
    gradientEndPosition: '90%',
    borderColor: '#EE2D41',
    buttonColor: '#303030',
    buttonTextColor: '#fff',
    gradientType: 'radial' // ✅ Nouveau type
  },
    12: {
    gradientStart: '#744545',
    gradientEnd: '#30081E',
    gradientStartPosition: '20%',
    gradientEndPosition: '90%',
    borderColor: '#30081E',
    buttonColor: '#303030',
    buttonTextColor: '#fff',
    gradientType: 'radial' // ✅ Nouveau type
  },
  };
  constructor(
        private serviceService: ServiceService,
        private partenaireService: PartenaireService,
        private route: ActivatedRoute,
        private http: HttpClient,
        private fb: FormBuilder,
            private sanitizer: DomSanitizer

  ) { 

      this.contactForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+216', Validators.required], // Changé de +33 à +216 pour la Tunisie par défaut
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
  
  console.log(`Service ${serviceId} -> Thème ${themeIndex}:`, this.currentTheme);
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

      this.loading = false;
      console.log('servicedetails:', this.services);

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
        console.log('Partenaires chargés:', partners);
        this.updateVisiblePartners(); // Initialiser les partenaires visibles
      },
      error: (error) => {
        console.error('Erreur lors du chargement des partenaires:', error);
        this.allPartners = [];
        this.visiblePartners = [];
      }
    });
  }


    sanitizeImage(url: string | null): string {
    if (!url) return '';

    if (url.includes("https://res.cloudinary.com") && url.split("https://res.cloudinary.com").length > 2) {
      const parts = url.split("https://res.cloudinary.com/daxkymr4t/image/upload/");
      return "https://res.cloudinary.com/daxkymr4t/image/upload/" + parts[parts.length - 1];
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
      // Utiliser un proxy CORS pour le développement
      // En production, vous devrez faire l'appel depuis votre backend
      const proxyUrl = 'https://corsproxy.io/?';
      const apiUrl = 'https://apicountries.com/countries';
      
      const response: any = await this.http.get(proxyUrl + encodeURIComponent(apiUrl)).toPromise();
      
      if (response && response.length > 0) {
        // Extraire uniquement les données nécessaires : name, alpha3Code, callingCodes, flags
        this.allCountriesCodes = response
          .filter((country: any) => country.callingCodes && country.callingCodes.length > 0)
          .map((country: any) => ({
            name: country.name,
            alpha3Code: country.alpha3Code,
            dial_code: '+' + country.callingCodes[0],
            callingCodes: country.callingCodes,
            flags: country.flags
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        
        console.log('✅ Pays chargés avec succès:', this.allCountriesCodes.length);
        console.log('📍 Exemple - Premier pays:', this.allCountriesCodes[0]);
        console.log('📍 Exemple - Tunisie:', this.allCountriesCodes.find(c => c.alpha3Code === 'TUN'));
      }
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
    
    console.log('Visible partners:', this.visiblePartners);
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

}
