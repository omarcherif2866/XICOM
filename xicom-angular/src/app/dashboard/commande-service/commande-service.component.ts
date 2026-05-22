import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private serviceService: ServiceService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getService().subscribe({
      next: (data) => this.services = data,
      error: (err) => console.error(err)
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
    if (service.sections) {
      service.sections.forEach((section: any) => {
        if (section.details) {
          section.details.forEach((detail: any) => {
            if (detail.title) details.push(detail.title);
          });
        }
      });
    }
    return details;
  }

commanderSelected(serviceTitle: string): void {
  const userId = this.authService.getUserIdFromToken();
  if (!userId) return;

  const selected = this.serviceDetails.filter(d => d.checked).map(d => d.title);

  if (selected.length === 0) {
    Swal.fire({ icon: 'warning', title: 'Sélectionnez au moins une prestation', timer: 2000, showConfirmButton: false });
    return;
  }

  this.serviceService.commander(serviceTitle, selected, userId).subscribe({
    next: () => {
      Swal.fire({ icon: 'success', title: 'Commande envoyée !', timer: 2000, showConfirmButton: false });
      this.serviceDetails.forEach(d => d.checked = false);
    },
    error: (err) => console.error(err)
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