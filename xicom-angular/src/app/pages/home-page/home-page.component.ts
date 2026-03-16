import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser'
import { Router } from '@angular/router';
import { RDV } from 'src/app/models/rdv';
import { Service } from 'src/app/models/service';
import { RDVService } from 'src/app/service/rdv.service';
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
  isSubmitting = false;


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
    private rdvService: RDVService,

  ) {
    this.projectForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+216', Validators.required], // Changé de +33 à +216 pour la Tunisie par défaut
      phone: ['', Validators.required],
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
    const apiUrl = 'https://restcountries.com/v3.1/all?fields=name,cca3,idd,flags';

    const response: any = await this.http.get(apiUrl).toPromise();

    if (response && response.length > 0) {
      this.allCountriesCodes = response
        .filter((country: any) => 
          country.idd?.root && 
          country.idd?.suffixes?.length > 0
        )
        .map((country: any) => {
          // Build dial codes: root + each suffix (e.g. "+2" + "16" = "+216")
          const callingCodes = country.idd.suffixes.map(
            (suffix: string) => country.idd.root + suffix
          );

          return {
            name: country.name.common,
            alpha3Code: country.cca3,
            dial_code: callingCodes.length === 1
              ? callingCodes[0]                    // "+216"
              : country.idd.root,                  // "+1" for US/CA shared root
            callingCodes: callingCodes,
            flags: country.flags                   // { png, svg, alt }
          };
        })
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


onSubmit(): void {
  if (this.projectForm.invalid) {
    this.markFormGroupTouched(this.projectForm);
    alert('Veuillez remplir tous les champs obligatoires');
    return;
  }

  if (this.isSubmitting) return;

  this.isSubmitting = true;

  // Créer un objet JSON (pas FormData)
  const rdvData = {
    name: this.projectForm.get('nom')?.value,
    surname: this.projectForm.get('prenom')?.value,
    email: this.projectForm.get('email')?.value,
    countryCode: this.projectForm.get('countryCode')?.value,
    num: this.projectForm.get('phone')?.value
  };

  // Utiliser le service
  this.rdvService.addRDV(rdvData).subscribe({
    next: (response) => {
      console.log('✅ RDV créé avec succès:', response);
      alert('Votre demande de rendez-vous a été envoyée avec succès ! Vous recevrez un email de confirmation.');
      this.projectForm.reset();
      this.isSubmitting = false;
    },
    error: (error) => {
      console.error('❌ Erreur lors de la création du RDV:', error);
      alert(error || 'Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
      this.isSubmitting = false;
    }
  });
}

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}