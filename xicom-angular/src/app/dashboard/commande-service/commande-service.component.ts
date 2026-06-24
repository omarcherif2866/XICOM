import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from 'src/app/models/service';
import { AuthService } from 'src/app/service/auth.service';
import { ServiceService } from 'src/app/service/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-commande-service',
  templateUrl: './commande-service.component.html',
  styleUrls: ['./commande-service.component.css']
})
export class CommandeServiceComponent implements OnInit {

  sidebarOpen = true;
  services: any[] = [];
  selectedService: any = null;
  serviceDetails: { title: string; checked: boolean }[] = [];
  userId: number | null = null;

  // Modal
  showCommandeForm = false;
  selectedServiceTitle = '';
  isLoading = false;

  commandeForm: FormGroup = this.fb.group({
    objectifs:        ['', Validators.required],
    analyseSituation: ['', Validators.required],
    messageCle:       ['', Validators.required],
    brief:            ['', Validators.required],
    devis:            ['', Validators.required],
    delaiSouhaite:    ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private authService: AuthService,
    private router: Router
  ) {
        const token = this.authService.getToken();
    const decoded = (this.authService as any)['jwtHelper'].decodeToken(token);
    this.userId = decoded?.id || decoded?.userId || null;
  }

  ngOnInit(): void {
    this.loadServices();
  }

loadServices(): void {
  
  this.serviceService.getService().subscribe({
    next: (data: Service[]) => {
      this.services = data
        .map(item => new Service(item))
        .sort((a, b) => a.Id - b.Id);  // ← tri par ID croissant
      console.log('Services loaded:', this.services);
    },
    error: (error) => {
    }
  });
}

  selectService(service: any): void {
    if (this.selectedService?.id === service.id) {
      this.selectedService = null;
      this.serviceDetails = [];
    } else {
      this.selectedService = service;
      this.serviceDetails = this.getDetails(service).map(d => ({ title: d, checked: false }));
    }
  }

  toggleDetail(detail: { title: string; checked: boolean }): void {
    detail.checked = !detail.checked;
  }

  getSelectedCount(): number {
    return this.serviceDetails.filter(d => d.checked).length;
  }

getDetails(service: any): string[] {
  const details: string[] = [];
  const section = service.sections?.[1]; // ← uniquement la section d'index 1
  if (section?.details) {
    section.details.forEach((detail: any) => {
      if (detail.title) details.push(detail.title);
    });
  }
  return details;
}

  // Remplace commanderSelected()
  openCommandeForm(serviceTitle: string): void {
    this.selectedServiceTitle = serviceTitle;
    this.commandeForm.reset();
    this.showCommandeForm = true;
  }

  closeCommandeForm(): void {
    this.showCommandeForm = false;
  }

  // submitCommande(): void {
  //   this.commandeForm.markAllAsTouched();
  //   if (this.commandeForm.invalid) return;

  //   const userId = this.authService.getUserIdFromToken();
  //   if (!userId) return;

  //   const selected = this.serviceDetails.filter(d => d.checked).map(d => d.title);
  // this.isLoading = true;

  //   const payload = {
  //     serviceTitle:     this.selectedServiceTitle,
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
  //       this.closeCommandeForm();
  //       this.serviceDetails.forEach(d => d.checked = false);
  //       Swal.fire({ icon: 'success', title: 'Commande envoyée !', timer: 1500, showConfirmButton: false });
  //     },
  //     error: (err) => {
  //       this.isLoading = false;
  //       console.error(err);
  //     }
  //   });
  // }

  submitCommande(serviceTitle: string): void {
  const userId = this.authService.getUserIdFromToken();
  if (!userId) return;

  const selected = this.serviceDetails.filter(d => d.checked).map(d => d.title);
  this.isLoading = true;

  const payload = {
    serviceTitle: serviceTitle,
    detailTitles: selected,
    objectifs:        '',
    analyseSituation: '',
    messageCle:       '',
    brief:            '',
    devis:            '',
    delaiSouhaite:    '',
    status: 'en cours',
  };

  this.serviceService.commander(payload, userId).subscribe({
    next: () => {
      this.isLoading = false;
      this.serviceDetails.forEach(d => d.checked = false);
      Swal.fire({ icon: 'success', title: 'Commande envoyée !', timer: 1500, showConfirmButton: false });
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

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}