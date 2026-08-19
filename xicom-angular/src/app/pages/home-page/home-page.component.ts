import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router';
import { Actualite } from 'src/app/models/actualite';
import { RDV } from 'src/app/models/rdv';
import { Service } from 'src/app/models/service';
import { ActualiteService } from 'src/app/service/actualite.service';
import { RDVService } from 'src/app/service/rdv.service';
import { ServiceService } from 'src/app/service/service.service';
import { Pipe, PipeTransform } from '@angular/core';

import Swal from 'sweetalert2';
import { Abonnee } from 'src/app/models/abonnee';
import { AbonneeServiceService } from 'src/app/service/abonnee-service.service';
import { AuthService } from 'src/app/service/auth.service';
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 27): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit) + '...' : value;
  }
}

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


  services: Service[] = [];
  actualites: Actualite[] = [];

  projectForm: FormGroup;
  contactForm: FormGroup;
  newsletterForm: FormGroup;

  allCountriesCodes: Country[] = [];
  loading: boolean = false;
  isSubmitting = false;

values = [
  { title: 'Innovation',     icon: '💡', gradient: 'linear-gradient(135deg,#7c6ff7,#9b59f7)', lineColor: '#6863BF', desc: 'Nous repoussons les limites pour créer de la valeur.' },
  { title: 'Collaboration',  icon: '👥', gradient: 'linear-gradient(135deg,#7c6ff7,#a855f7)', lineColor: '#7c6ff7', desc: 'Nous avançons ensemble vers des objectifs communs.' },
  { title: 'Qualité',        icon: '🏆', gradient: 'linear-gradient(135deg,#ec4899,#f472b6)', lineColor: '#ec4899', desc: 'Nous visons l\'excellence dans tout ce que nous faisons.' },
  { title: 'Transparence',   icon: '👁',  gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', lineColor: '#6366f1', desc: 'Nous communiquons avec clarté et honnêteté.' },
  { title: 'Responsabilité', icon: '🛡',  gradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)', lineColor: '#3b82f6', desc: 'Nous assumons pleinement nos actions et leurs impacts.' },
  { title: 'Agilité',        icon: '⚡', gradient: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', lineColor: '#0ea5e9', desc: 'Nous nous adaptons rapidement pour avancer et aller plus loin.' },
  { title: 'Respect',        icon: '♥',  gradient: 'linear-gradient(135deg,#38bdf8,#06b6d4)', lineColor: '#38bdf8', desc: 'Nous valorisons chaque personne et chaque idée.' },
  { title: 'Durabilité',     icon: '🌿', gradient: 'linear-gradient(135deg,#14b8a6,#2dd4bf)', lineColor: '#14b8a6', desc: 'Nous agissons aujourd\'hui pour un avenir responsable.' },
];

getLeft(i: number): string {
  const n = this.values.length; // 8
  const padding = 8; // %
  return `${padding + (i / (n - 1)) * (100 - 2 * padding)}%`;
}

  currentGroupIndex = 0;
  visibleCount = 3;
  autoPlayInterval: any;

  currentNewsIndex = 0;
  newsVisibleCount = 3;
  newsAutoPlay: any;  
  isDialogOpen = false;

  @ViewChild('carouselTrack') carouselTrack!: ElementRef;

  team = [
    { name: 'S. Martin', secteur: 'Restaurant ', message: '“Très bonne collaboration avec XICOM. L’équipe a su comprendre rapidement nos besoins et proposer une stratégie claire et efficace. Résultats visibles dès les premières semaines', overlayColor: '#522E2E', image: '../../../assets/images/feedback/RESTO.webp' },
    { name: 'L.Bernard', secteur: 'Garage automobile ', message: '“Agence sérieuse et réactive. Les campagnes ont été bien pilotées et les reportings sont précis. On sent une vraie expertise digitale.”', overlayColor: '#A750F3', image: '../../../assets/images/feedback/mecanicien2.webp' },
    { name: 'C.Dubois', secteur: 'Boutique en ligne ', message: '“Accompagnement complet, de la stratégie à lexécution. Léquipe est disponible et force de proposition. Très satisfait du rendu.”', overlayColor: '#0DF29F', image: '../../../assets/images/feedback/C.webp' },
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
  { label: 'Stratégie & Conseil',        color: '#1E3A8A' }, // bleu foncé
  { label: 'Audit & Études',             color: '#60A5FA' }, // bleu clair

  { label: 'Branding & Design',          color: '#6D28D9' }, // violet foncé
  { label: 'Création & Production',      color: '#A78BFA' }, // violet clair

  { label: 'Contenu & Social Media',     color: '#0F766E' }, // teal foncé
  { label: 'SEO & Acquisition',          color: '#5EEAD4' }, // teal clair

  { label: 'Publicité & Paid Media',     color: '#C2410C' }, // orange foncé
  { label: 'Marketing Automation',       color: '#FDBA74' }, // orange clair

  { label: 'Data & Analytics',           color: '#1D4ED8' }, // indigo foncé
  { label: 'Développement & Expérience', color: '#93C5FD' }  // indigo clair
];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private serviceService: ServiceService,
    private sanitizer: DomSanitizer,
    private rdvService: RDVService,
    private actualiteService: ActualiteService, 
    private router: Router,
	  private authService: AuthService,
    private abonneeService: AbonneeServiceService) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+33', Validators.required], // Changé de +33 à +216 pour la Tunisie par défaut
      num: ['', Validators.required],
    });

      this.contactForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+33', Validators.required], // Changé de +33 à +216 pour la Tunisie par défaut
      sujet: ['', Validators.required],
      num: ['', Validators.required],
      message: ['', Validators.required],    
    });

      this.newsletterForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],  
    });
  }

colors = ['#6D28D9','#51B3D8','#8B5CF6','#6366F1','#3B82F6','#61a9b1','#06B6D4','#14B8A6'];
shuffledColors: string[] = [];

  ngOnInit(): void {
    this.loadCountriesCodes();
    this.loadServices();
    this.tickerItems = [...this.rawStats, ...this.rawStats];
    this.serviceItems = [...this.rawServices, ...this.rawServices];
    this.loadActualites();
    this.startAutoPlay();
    this.startNewsAutoPlay();
    this.shuffledColors = this.shuffleColors([...this.colors]);

      this.route.fragment.subscribe(fragment => {
    if (fragment) {
      setTimeout(() => {
        const el = document.getElementById(fragment);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  });

  }
  
    ngOnDestroy(): void {
    clearInterval(this.autoPlayInterval);
    clearInterval(this.newsAutoPlay);

  }


shuffleColors(arr: string[]): string[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

getCardColor(groupIndex: number, cardIndex: number): string {
  return this.shuffledColors[(groupIndex * 3 + cardIndex) % this.shuffledColors.length];
}

get groupedTeam() {
  const groupSize = 3;
  const groups = [];
  for (let i = 0; i < this.team.length; i += groupSize) {
    const group = this.team.slice(i, i + groupSize);
    // Compléter le dernier groupe avec les premiers éléments si incomplet
    if (group.length < groupSize) {
      const missing = groupSize - group.length;
      group.push(...this.team.slice(0, missing));
    }
    groups.push(group);
  }
  return groups;
}

startAutoPlay(): void {
  this.autoPlayInterval = setInterval(() => {
    this.currentGroupIndex =
      this.currentGroupIndex >= this.groupedTeam.length - 1
        ? 0
        : this.currentGroupIndex + 1;
  }, 5500);
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
  const size = this.newsVisibleCount;
  for (let i = 0; i < this.actualites.length; i += size) {
    const group = this.actualites.slice(i, i + size);
    if (group.length < size && this.actualites.length > size) {
      const missing = size - group.length;
      group.push(...this.actualites.slice(0, missing));
    }
    groups.push(group);
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
      this.services = data
        .map(item => new Service(item))
        .sort((a, b) => a.Id - b.Id);  // ← tri par ID croissant
      
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

  // ✅ Optimisation Cloudinary automatique
  if (image.includes('res.cloudinary.com')) {
    // Supprimer les doublons d'URL
    if (image.split('res.cloudinary.com').length > 2) {
      const parts = image.split('/upload/');
      image = `https://res.cloudinary.com/dnrnrxm9q/image/upload/${parts[parts.length - 1]}`;
    }

    // Ajouter transformations si pas déjà présentes
    if (!image.includes('f_webp') && !image.includes('q_auto')) {
      image = image.replace('/upload/', '/upload/f_webp,q_auto:good,w_600/');
    }

    return image;
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
    name: this.projectForm.get('name')?.value,
    surname: this.projectForm.get('surname')?.value,
    email: this.projectForm.get('email')?.value,
    countryCode: this.projectForm.get('countryCode')?.value,
    num: this.projectForm.get('num')?.value
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

  onCtaClick(): void {
    // Navigate to contact section or open modal
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToForm(): void {
  const el = document.getElementById('projectForm');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

  scrollToServices(): void {
  const el = document.getElementById('services');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

subscribe(): void {
  if (this.newsletterForm.invalid) return;

const abonne = new Abonnee(
  null,
  this.newsletterForm.value.email!,
  this.newsletterForm.value.name!
);

  this.abonneeService.addAbonne(abonne).subscribe({
    next: () => {
          Swal.fire({
            title: 'Success!',
            text: 'Vous êtes maintenant abonné à notre newsletter.',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 1500,
          })
      this.newsletterForm.reset();
    },
    error: (err) => {
      console.error(err);
    }
  });
}

goToService() {
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
    this.router.navigate(['/commande_service']);
  }
}

  closeDialog(): void {
    this.isDialogOpen = false;
  }

}