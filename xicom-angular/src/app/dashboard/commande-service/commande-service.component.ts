import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Service } from 'src/app/models/service';
import { AuthService } from 'src/app/service/auth.service';
import { ChatService } from 'src/app/service/chat.service';
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

  // ✅ Nouveau : pack sélectionné
  selectedPack: any = null;

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
preSelectedService: any = null; // ✅ ajouter dans les propriétés

  chatOpen = false;
chatMessages: any[] = [];
chatInput = '';
private chatSub: any;

  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private authService: AuthService,
    private router: Router,
      private chatService: ChatService,   // ← ajout

  ) {
    const token = this.authService.getToken();
    const decoded = (this.authService as any)['jwtHelper'].decodeToken(token);
    this.userId = decoded?.id || decoded?.userId || null;
    const savedPack = sessionStorage.getItem('selectedPack');
    const savedService = sessionStorage.getItem('selectedService');
    if (savedPack) this.selectedPack = JSON.parse(savedPack);
    if (savedService) this.preSelectedService = JSON.parse(savedService);
  }

  ngOnInit(): void {
    this.loadServices();
  }

loadServices(): void {
  this.serviceService.getService().subscribe({
    next: (data: Service[]) => {
      this.services = data
        .map(item => new Service(item))
        .sort((a, b) => a.Id - b.Id);

      if (this.preSelectedService) {
        const found = this.services.find(s => s.id === this.preSelectedService.id);
        if (found) {
          this.selectService(found); // ← ne reset plus le pack grâce à la correction

          // ✅ Appliquer le pack après selectService
          if (this.selectedPack) {
            const matchingPack = found.priceSections?.find(
              (p: any) => p.title === this.selectedPack.title &&
                          String(p.price) === String(this.selectedPack.price)
            );
            if (matchingPack) {
              this.selectedPack = matchingPack;
            }
          }

          sessionStorage.removeItem('selectedPack');
          sessionStorage.removeItem('selectedService');
          this.preSelectedService = null; // ✅ reset pour que selectService fonctionne normalement après
        }
      }
    },
    error: () => {}
  });
}

selectService(service: any): void {
  if (this.selectedService?.id === service.id) {
    this.selectedService = null;
    this.serviceDetails = [];
    this.selectedPack = null;
  } else {
    this.selectedService = service;
    this.serviceDetails = this.getDetails(service).map(d => ({ title: d, checked: false }));
    // ✅ Ne pas reset selectedPack si on vient de serviceDetails
    if (!this.preSelectedService) {
      this.selectedPack = null;
    }
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
    const section = service.sections?.[1];
    if (section?.details) {
      section.details.forEach((detail: any) => {
        if (detail.title) details.push(detail.title);
      });
    }
    return details;
  }

  // ✅ Nouveau : sélection d'un pack (radio-like)
  selectPack(pack: any): void {
    this.selectedPack = pack;
  }

isPackSelected(pack: any): boolean {
  return this.selectedPack?.title === pack.title && 
         this.selectedPack?.price === pack.price;
}

  // ✅ Le bouton est actif seulement si un pack ET au moins une prestation sont choisis
  // canSubmit(): boolean {
  //   return !!this.selectedPack && this.getSelectedCount() > 0 && !this.isLoading;
  // }

  canSubmit(): boolean {
  return !!this.selectedPack && !this.isLoading;
  
}

  openCommandeForm(serviceTitle: string): void {
    this.selectedServiceTitle = serviceTitle;
    this.commandeForm.reset();
    this.showCommandeForm = true;
  }

  closeCommandeForm(): void {
    this.showCommandeForm = false;
  }

  submitCommande(serviceTitle: string): void {
    const userId = this.authService.getUserIdFromToken();
    if (!userId) return;
    if (!this.canSubmit()) return;

    const selected = this.serviceDetails.filter(d => d.checked).map(d => d.title);
    this.isLoading = true;

    const payload = {
      serviceTitle: serviceTitle,
      // detailTitles: selected,
      // ✅ Infos du pack ajoutées au payload
      packTitle: this.selectedPack.title,
      packPrice: this.selectedPack.price,

      status: 'en cours',
    };

    this.serviceService.commander(payload, userId).subscribe({
      next: () => {
        this.isLoading = false;
        this.serviceDetails.forEach(d => d.checked = false);
        this.selectedPack = null;
        Swal.fire({ icon: 'success', title: 'Commande envoyée !', timer: 1500, showConfirmButton: false });
        setTimeout(() => this.router.navigate(['/chat'], { 
          queryParams: { serviceId: this.selectedService.id } // ✅
        }), 1500);

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

toggleChat(serviceId: number): void {
  this.chatOpen = !this.chatOpen;
  if (this.chatOpen) {
    // ✅ Charger l'historique depuis le backend
    this.chatService.getHistory(serviceId).subscribe(msgs => {
      this.chatMessages = msgs;
    });
    // ✅ Connecter WebSocket
    this.chatService.connect(serviceId);
    this.chatSub = this.chatService.message$.subscribe((msg: any) => {
      this.chatMessages.push(msg);
    });
  } else {
    this.chatSub?.unsubscribe();
    this.chatService.disconnect();
  }
}

sendChatMessage(serviceId: number): void {
  if (!this.chatInput.trim()) return;
  const username = this.authService.getUsernameFromToken() ?? '';
  const role = this.authService.getRoleFromToken() ?? 'CLIENT'; // ✅ rôle dynamique
  this.chatService.sendMessage(serviceId, this.chatInput, username, role);
  this.chatInput = '';
}



}