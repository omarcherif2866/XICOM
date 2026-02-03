import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser'
import { Router } from '@angular/router';
import { Service } from 'src/app/models/service';
import { ServiceService } from 'src/app/service/service.service';

import Swal from 'sweetalert2';

export interface Expert {
  name: string;
  profession: string;
  hours: string;
  mode: string;
  avatarColor: string;
}

export interface Country {
  name: string;
  alpha3Code: string;
  dial_code: string; // Changé pour correspondre au template HTML
  callingCodes: string[];
  flags: {
    svg: string;
    png: string;
  };
}

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.css'],
})
export class HomePage implements OnInit {
  stats = [
    { icon: '../../../assets/icons/valise.svg', label: 'Nos projets', value: '+200', color: '#EFFBFF', valueColor: '#51B3D8'  },
    { icon: '../../../assets/icons/coeur.svg', label: 'Satisfaction', value: '4%', color: '#FFEDED', valueColor: '#F26D6E' },
    { icon: '../../../assets/icons/person.svg', label: 'Experts', value: '15', color: '#FFEEEA', valueColor: '#F1836A' },
    { icon: '../../../assets/icons/puzzle.svg', label: 'Collaborateurs', value: '40', color: '#ECEBFF', valueColor: '#6863BF' }
  ];

  services: Service[] = [];

  projectForm: FormGroup;
  contactForm: FormGroup;

  allCountriesCodes: Country[] = [];
  loading: boolean = false;

  // services = [
  //   {
  //     icon: '🌐',
  //     title: 'Développement Web',
  //     description: 'Création de sites web modernes et performants avec les dernières technologies',
  //     color: '#4FC3F7'
  //   },
  //   {
  //     icon: '📱',
  //     title: 'Applications Mobiles',
  //     description: 'Développement d\'apps natives et hybrides pour iOS et Android',
  //     color: '#FF7043'
  //   },
  //   {
  //     icon: '☁️',
  //     title: 'Solutions Cloud',
  //     description: 'Infrastructure cloud scalable et sécurisée pour vos applications',
  //     color: '#66BB6A'
  //   },
  //   {
  //     icon: '🎨',
  //     title: 'Design UX/UI',
  //     description: 'Interfaces utilisateur intuitives et expériences mémorables',
  //     color: '#FFA726'
  //   },
  //   {
  //     icon: '⚡',
  //     title: 'Performance',
  //     description: 'Optimisation et accélération de vos plateformes digitales',
  //     color: '#AB47BC'
  //   },
  //   {
  //     icon: '🔒',
  //     title: 'Sécurité',
  //     description: 'Protection avancée de vos données et infrastructures',
  //     color: '#EF5350'
  //   },
  //   {
  //     icon: '🤖',
  //     title: 'Intelligence Artificielle',
  //     description: 'Solutions IA pour automatiser et optimiser vos processus',
  //     color: '#5C6BC0'
  //   },
  //   {
  //     icon: '📊',
  //     title: 'Analytics & Data',
  //     description: 'Analyse de données et insights pour vos décisions business',
  //     color: '#26C6DA'
  //   },
  //   {
  //     icon: '🛠️',
  //     title: 'Maintenance',
  //     description: 'Support continu et évolution de vos solutions digitales',
  //     color: '#78909C'
  //   },
  //   {
  //     icon: '💼',
  //     title: 'Consulting',
  //     description: 'Conseil stratégique pour votre transformation digitale',
  //     color: '#FDD835'
  //   },
  //   {
  //     icon: '🚀',
  //     title: 'Innovation',
  //     description: 'R&D et technologies émergentes pour rester en avance',
  //     color: '#EC407A'
  //   },
  //   {
  //     icon: '🌍',
  //     title: 'Solutions Globales',
  //     description: 'Déploiement international et support multilingue',
  //     color: '#29B6F6'
  //   }
  // ];

  values = [
    {
      title: 'Innovation',
      image: '../../../assets/images/innovation.jpg',
    },
    {
      title: 'Collaboration',
      image: '../../../assets/images/collaboration.jpg',
    },
    {
      title: 'Qualité',
      image: '../../../assets/images/qualite.jpg',
    },
    {
      title: 'Transparence',
      image: '../../../assets/images/transparance.jpg',
    },
    {
      title: 'Responsabilité',
      image: '../../../assets/images/responsabilite.jpg',
    },
    {
      title: 'Agilité',
      image: '../../../assets/images/agilite.jpg',
    },
    {
      title: 'Respect',
      image: '../../../assets/images/respect.jpg',
    },
    {
      title: 'Durabilité',
      image: '../../../assets/images/durabilite.jpg',
    }
  ];

  team = [
    { name: 'Sophie Martin', role: 'CEO & Founder', message: 'Partenaires exceptionnels', overlayColor: '#522E2E' },
    { name: 'Thomas Dubois', role: 'CTO', message: 'Équipe très professionnelle', overlayColor: '#A750F3' },
    { name: 'Marie Laurent', role: 'Design Lead', message: 'Excellent travail et livraison rapide', overlayColor: '#0DF29F' },
    { name: 'Lucas Bernard', role: 'Tech Director', message: 'Je recommande vivement', overlayColor: '#F3A950' },
    { name: 'Sophie Martin', role: 'CEO & Founder', message: 'Partenaires exceptionnels', overlayColor: '#522E2E' },
    { name: 'Thomas Dubois', role: 'CTO', message: 'Équipe très professionnelle', overlayColor: '#A750F3' },
    { name: 'Marie Laurent', role: 'Design Lead', message: 'Excellent travail et livraison rapide', overlayColor: '#0DF29F' },
    { name: 'Lucas Bernard', role: 'Tech Director', message: 'Je recommande vivement', overlayColor: '#F3A950' }
  ];

  news = [
    {
      title: 'Lancement de notre nouvelle plateforme IA',
      date: 'Janvier 2026',
      category: 'Innovation',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Expansion internationale en Europe',
      date: 'Décembre 2025',
      category: 'Croissance',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Prix de la meilleure startup tech 2025',
      date: 'Novembre 2025',
      category: 'Récompense',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private serviceService: ServiceService,
    private sanitizer: DomSanitizer,
  ) {
    this.projectForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+216', Validators.required], // Changé de +33 à +216 pour la Tunisie par défaut
      phone: ['', Validators.required],
      service: ['', Validators.required],
      description: ['']
    });

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
    this.loadServices();
    
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

  onSubmit(): void {
    if (this.projectForm.valid) {
      const formData = {
        ...this.projectForm.value,
        phoneComplet: this.projectForm.value.countryCode + this.projectForm.value.phone
      };
      
      console.log('Données du formulaire:', formData);
      alert('Formulaire soumis avec succès! Vérifiez la console pour voir les données.');
      
      // Ici, vous pouvez envoyer les données à votre API
      // this.http.post('votre-api-url', formData).subscribe(...);
    } else {
      this.markFormGroupTouched(this.projectForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.projectForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getPhoneNumber(): string {
    return this.projectForm.value.countryCode + this.projectForm.value.phone;
  }



  // Méthode helper pour obtenir le drapeau du pays sélectionné
  getSelectedCountryFlag(): string {
    const selectedDialCode = this.projectForm.get('countryCode')?.value;
    const country = this.allCountriesCodes.find(c => c.dial_code === selectedDialCode);
    return country?.flags?.png || '';
  }

    getSelectedCountryFlagContactForm(): string {
    const selectedDialCode = this.contactForm.get('countryCode')?.value;
    const country = this.allCountriesCodes.find(c => c.dial_code === selectedDialCode);
    return country?.flags?.png || '';
  }

  // Méthode helper pour obtenir les infos complètes du pays sélectionné
  getSelectedCountry(): Country | undefined {
    const selectedDialCode = this.projectForm.get('countryCode')?.value;
    return this.allCountriesCodes.find(c => c.dial_code === selectedDialCode);
  }
    getSelectedCountryContactForm(): Country | undefined {
    const selectedDialCode = this.contactForm.get('countryCode')?.value;
    return this.allCountriesCodes.find(c => c.dial_code === selectedDialCode);
  }


    loadServices(): void {
      this.loading = true;
      
      this.serviceService.getService().subscribe({
        next: (data: Service[]) => {
          this.services = data.map(item => new Service(item));
          
          this.loading = false;
          console.log('Services chargés:', this.services);
        },
        error: (error) => {
          console.error('Erreur lors du chargement des services:', error);
          this.loading = false;
        }
      });
    }

  sanitizeImage(image: string | null): SafeUrl | string {
    if (!image) {
      return 'assets/images/placeholder.png';
    }
    
    if (image.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustUrl(image);
    }
    
    return image;
  }


generateRandomColor(): string {
  const colors = [
    '#51B3D8', 
    '#F26D6E', 
    '#35B58B',
    '#495A86', 
    '#864949',
    '#F58916', 
    '#B53591', 
    '#F3A950',  
    '#A750F3', 
    '#0DF29F', 
    '#867B32', 
    '#125835', 
    '#35B58B', 
    '#B12472', 
    '#30081E',
    '#C391F2', 
    '#3B5C4B',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

}