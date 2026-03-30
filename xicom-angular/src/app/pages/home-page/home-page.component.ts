import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser'
import { Router } from '@angular/router';
import { Actualite } from 'src/app/models/actualite';
import { RDV } from 'src/app/models/rdv';
import { Service } from 'src/app/models/service';
import { ActualiteService } from 'src/app/service/actualite.service';
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

interface StatItem {
  value: string;
  label: string;
}

@Component({
  selector: 'home-page',
  templateUrl: 'home-page.component.html',
  styleUrls: ['home-page.component.css'],
})
export class HomePage implements OnInit,OnDestroy {
  // stats = [
  //   { icon: '../../../assets/icons/valise.svg', label: 'Nos projets', value: '+200', color: '#EFFBFF', valueColor: '#51B3D8'  },
  //   { icon: '../../../assets/icons/coeur.svg', label: 'Satisfaction', value: '4%', color: '#FFEDED', valueColor: '#F26D6E' },
  //   { icon: '../../../assets/icons/person.svg', label: 'Experts', value: '15', color: '#FFEEEA', valueColor: '#F1836A' },
  //   { icon: '../../../assets/icons/puzzle.svg', label: 'Collaborateurs', value: '40', color: '#ECEBFF', valueColor: '#6863BF' }
  // ];

  services: Service[] = [];
  actualites: Actualite[] = [];

  projectForm: FormGroup;
  contactForm: FormGroup;

  allCountriesCodes: Country[] = [];
  loading: boolean = false;
  isSubmitting = false;

values = [
  { title: 'Innovation',     color: '#6863BF', icon: '◈' },
  { title: 'Collaboration',  color: '#6472C3', icon: '◉' },
  { title: 'Qualité',        color: '#5F81C8', icon: '◆' },
  { title: 'Transparence',   color: '#5A90CC', icon: '◎' },
  { title: 'Responsabilité', color: '#569FD1', icon: '◇' },
  { title: 'Agilité',        color: '#53ACD5', icon: '○' },
  { title: 'Respect',        color: '#51B3D8', icon: '◐' },
  { title: 'Durabilité',     color: '#4FBFE0', icon: '◑' },
];

getLeft(i: number): string {
  return (i / (this.values.length - 1) * 100) + '%';
}

  currentGroupIndex = 0;
  visibleCount = 3;
  autoPlayInterval: any;

  currentNewsIndex = 0;
  newsVisibleCount = 3;
  newsAutoPlay: any;  

  @ViewChild('carouselTrack') carouselTrack!: ElementRef;

  team = [
    { name: 'S. Martin', secteur: 'Restaurant ', message: '“Très bonne collaboration avec XICOM. L’équipe a su comprendre rapidement nos besoins et proposer une stratégie claire et efficace. Résultats visibles dès les premières semaines', overlayColor: '#522E2E', image: '../../../assets/images/feedback/RESTO.png' },
    { name: 'L.Bernard', secteur: 'Garage automobile ', message: '“Agence sérieuse et réactive. Les campagnes ont été bien pilotées et les reportings sont précis. On sent une vraie expertise digitale.”', overlayColor: '#A750F3', image: '../../../assets/images/feedback/mecanicien2.png' },
    { name: 'C.Dubois', secteur: 'Boutique en ligne ', message: '“Accompagnement complet, de la stratégie à lexécution. Léquipe est disponible et force de proposition. Très satisfait du rendu.”', overlayColor: '#0DF29F', image: '../../../assets/images/feedback/C.png' },
    { name: 'A. Lefèvre', secteur: 'Salon de coiffure', message: '“Une agence professionnelle avec une vraie vision marketing. Les recommandations sont pertinentes et adaptées à notre activité.”', overlayColor: '#F3A950', image: '../../../assets/images/feedback/A.png' },
    { name: 'M. Robert', secteur: 'Artisan bâtiment', message: '“Excellent suivi et communication fluide. Les objectifs ont été atteints et même dépassés. Je recommande vivement.”', overlayColor: '#522E2E', image: '../../../assets/images/feedback/M.png' },
    { name: 'T.Moreau', secteur: 'Hôtel ', message: '“Très bonne expérience. L’équipe est impliquée et les résultats sont au rendez-vous. Mention spéciale pour la qualité des contenus.”', overlayColor: '#A750F3', image: '../../../assets/images/feedback/S.png' },
    { name: 'J.Petit', secteur: 'Magasin de vêtements ', message: '“XICOM nous a aidés à structurer notre communication digitale. Approche méthodique et efficace. On voit clairement la différence.”', overlayColor: '#0DF29F', image: '../../../assets/images/feedback/J.png' },
    { name: 'D.Garcia', secteur: 'Cabinet médical ', message: '“Agence dynamique et professionnelle. Les campagnes sont optimisées en continu et les performances sont bien analysées. Très bon partenaire.”', overlayColor: '#F3A950', image: '../../../assets/images/feedback/D.png' }
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

    private readonly rawStats: StatItem[] = [
    { value: '120+',  label: 'Projets réalisés' },
    { value: '98%',   label: 'Satisfaction client' },
    { value: '15',    label: 'Experts métiers' },
    { value: '25',    label: 'Collaborateurs engagés' },
    { value: '200M+', label: 'Audience touchée / mois' },
    { value: '1M+',   label: 'Interactions générées / mois' },
    { value: '20K+',  label: 'Leads qualifiés / mois' },
    { value: '300+',  label: 'Campagnes déployées' },
    { value: '50+',   label: 'Clients actifs' },
    { value: '80%',   label: 'Taux de fidélisation' },
    { value: '35%',   label: 'Croissance moyenne' },
    { value: '4×',    label: 'ROI moyen' },
  ];

    tickerItems: StatItem[] = [];
    serviceItems: any[] = [];


  private readonly rawServices: any[] = [
  { label: 'Stratégie & Conseil',        color: '#6863BF' },
  { label: 'Audit & Études',             color: '#6472C3' },
  { label: 'Branding & Design',          color: '#5F81C8' },
  { label: 'Création & Production',      color: '#5A90CC' },
  { label: 'Contenu & Social Media',     color: '#569FD1' },
  { label: 'SEO & Acquisition',          color: '#53ACD5' },
  { label: 'Publicité & Paid Media',     color: '#51B3D8' },
  { label: 'Marketing Automation',       color: '#51B3D8' },
  { label: 'Data & Analytics',           color: '#5F81C8' },
  { label: 'Développement & Expérience', color: '#5A90CC' },
];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private serviceService: ServiceService,
    private sanitizer: DomSanitizer,
    private rdvService: RDVService,
    private actualiteService: ActualiteService, 
    private router: Router

  ) {
    this.projectForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+33', Validators.required], // Changé de +33 à +216 pour la Tunisie par défaut
      phone: ['', Validators.required],
    });

      this.contactForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+33', Validators.required], // Changé de +33 à +216 pour la Tunisie par défaut
      sujet: ['', Validators.required],
      phone: ['', Validators.required],
      message: ['', Validators.required],    
    });
  }



  ngOnInit(): void {
    this.loadCountriesCodes();
    this.loadServices();
    this.tickerItems = [...this.rawStats, ...this.rawStats];
    this.serviceItems = [...this.rawServices, ...this.rawServices];
    this.loadActualites();
    this.startAutoPlay();
    this.startNewsAutoPlay();

  }
  
    ngOnDestroy(): void {
    clearInterval(this.autoPlayInterval);
    clearInterval(this.newsAutoPlay);

  }

get groupedTeam(): any[][] {
  const groups = [];
  for (let i = 0; i < this.team.length; i += this.visibleCount) {
    groups.push(this.team.slice(i, i + this.visibleCount));
  }
  return groups;
}

startAutoPlay(): void {
  this.autoPlayInterval = setInterval(() => {
    this.currentGroupIndex =
      this.currentGroupIndex >= this.groupedTeam.length - 1
        ? 0
        : this.currentGroupIndex + 1;
  }, 2000);
}

goToSlide(i: number): void {
  this.currentGroupIndex = i;
}

  async loadCountriesCodes(): Promise<void> {
    try {
      const response: any = await this.http.get('assets/countries.json').toPromise();
      this.allCountriesCodes = response.sort((a: Country, b: Country) => a.name.localeCompare(b.name));
    } catch (error) {
      this.allCountriesCodes = [];
    }
  }

get groupedNews(): any[][] {
  const groups = [];
  for (let i = 0; i < this.actualites.length; i += this.newsVisibleCount) {
    groups.push(this.actualites.slice(i, i + this.newsVisibleCount));
  }
  return groups;
}

startNewsAutoPlay(): void {
  this.newsAutoPlay = setInterval(() => {
    this.currentNewsIndex =
      this.currentNewsIndex >= this.groupedNews.length - 1
        ? 0
        : this.currentNewsIndex + 1;
  }, 3500);
}

goToNewsSlide(i: number): void {
  this.currentNewsIndex = i;
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
        },
        error: (error) => {
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
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Veuillez remplir tous les champs obligatoires'
        });    
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
        Swal.fire({
          icon: 'success',
          title: 'Votre demande de rendez-vous a été envoyée avec succès ! Vous recevrez un email de confirmation.',
          showConfirmButton: false,
          timer: 1500 // Auto hide after 1.5 seconds
        });
      this.projectForm.reset();
      this.isSubmitting = false;
    },
    error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.'
        });    
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

loadActualites(): void {
  this.actualiteService.getActualite().subscribe({
    next: (data) => this.actualites = data,
    error: (err) => console.error(err)
  });
}


  goToDetail(id: number): void {
    this.router.navigate(['/actualiteDetails', id]);
  }

  voirToutesActualites() {
  this.router.navigate(['/allActualites']); // adapte la route selon ton app
}
}