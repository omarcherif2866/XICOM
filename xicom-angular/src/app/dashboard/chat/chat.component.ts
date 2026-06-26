import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ChatService } from 'src/app/service/chat.service';
import { PaymentServiceService } from 'src/app/service/payment-service.service';
import { ServiceService } from 'src/app/service/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
discussionUsernames: { [id: number]: string } = {};  discussions: number[] = [];
discussionTitles: { [id: number]: string } = {};
unreadCounts: { [id: number]: number } = {};
private globalSubs: any[] = [];
private audioCtx: AudioContext | null = null;
currentServiceCommande: any = null;
currentServicePacks: any[] = [];
showPaymentModal = false;

  selectedServiceId: number | null = null;
  messages: any[] = [];
  chatInput = '';
  username = '';
  role = '';
  private sub: any;
  sidebarrOpen = true;
isAdmin = false;
  isSimpleUser = false;
  currentUserId: number | null = null;
  userId: number | null = null;

selectedPayPack: any = null;
paymentLoading = false;
private squareCard: any = null;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private serviceService: ServiceService,
    private router: Router,
     private route: ActivatedRoute,
     private paymentService: PaymentServiceService
  ) {}

ngOnInit(): void {
  const role = this.authService.getRoleFromToken();
  this.isAdmin = role === 'Admin' || role === 'SUPERADMIN';
  this.isSimpleUser = role === 'SIMPLEU';

  if (!this.isAdmin) {
    const token = this.authService.getToken();
    const decoded = (this.authService as any)['jwtHelper'].decodeToken(token);
    this.currentUserId = decoded?.id || decoded?.userId || null;
  }

  const token = this.authService.getToken();
  if (!token) {
    this.router.navigate(['/signin']);
    return;
  }

  this.username = this.authService.getUsernameFromToken() ?? '';
  this.role = this.authService.getRoleFromToken() ?? 'CLIENT';

  // ✅ charger les non-lus d'abord, puis les discussions
this.chatService.getUnread(this.username).subscribe(unreads => {
  console.log('username pour unread:', this.username); // 👈
  console.log('unreads reçus:', unreads);              // 👈
  unreads.forEach((u: any) => {
    this.unreadCounts[u.serviceId] = u.count;
  });
  this.loadDiscussions();
});
  // ✅ ouvrir automatiquement la discussion si serviceId en query param
  this.route.queryParams.subscribe(params => {
    if (params['serviceId']) {
      const serviceId = +params['serviceId'];
      setTimeout(() => {
        this.selectDiscussion(serviceId);
        this.router.navigate(['/chat'], { replaceUrl: true });
      }, 500);
    }
  });
}


    ngAfterViewChecked(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch {}
  }


    getInitials(id: number): string {
    return `S${id}`;
  }


  
  // ✅ Aperçu du dernier message dans la sidebar
  getLastMessage(id: number): string {
    return `Service #${id}`;
  }

  // ✅ Badge de messages non lus (à brancher sur ton API si besoin)
  getUnreadCount(id: number): number {
    return 0;
  }

loadDiscussions(): void {
  this.chatService.getDiscussions(this.username, this.role).subscribe(ids => {
    this.discussions = ids;
    this.serviceService.getService().subscribe(services => {
      ids.forEach(id => {
        // ❌ supprime : this.unreadCounts[id] = 0;
        const service = services.find((s: any) => s.id === id);
        if (service) this.discussionTitles[id] = (service as any).title;

        this.chatService.getHistory(id).subscribe(msgs => {
          const client = msgs.find((m: any) => m.senderRole !== 'Admin');
          if (client) this.discussionUsernames[id] = client.senderUsername;
        });

        this.chatService.connectBackground(id, (msg: any) => {
          if (msg.serviceId !== this.selectedServiceId) {
            this.unreadCounts[msg.serviceId] = (this.unreadCounts[msg.serviceId] || 0) + 1;
            this.chatService.incrementUnread(this.username, msg.serviceId); // ✅ uniquement pour le récepteur
            this.playNotificationSound(); // ✅

          }
        });
      });
    });
  });
}

selectDiscussion(serviceId: number): void {
  this.unreadCounts[serviceId] = 0;
  this.chatService.resetUnread(this.username, serviceId); // ✅
  this.selectedServiceId = serviceId;
  this.sub?.unsubscribe();
  this.chatService.disconnect();

  this.chatService.getHistory(serviceId).subscribe(msgs => {
    this.messages = msgs;
    console.log('username connecté:', this.username);
    console.log('premier message:', msgs[0]); // 👈 voir la structure exacte
  });

  this.chatService.connect(serviceId);
  this.sub = this.chatService.message$.subscribe((msg: any) => {
    this.messages.push(msg);
      if (msg.senderUsername !== this.username) {
    this.playNotificationSound(); // ✅ son même dans la discussion ouverte
  }
      if (msg.serviceId !== this.selectedServiceId) {
    this.unreadCounts[msg.serviceId] = (this.unreadCounts[msg.serviceId] || 0) + 1;
  }
  });

    if (this.isSimpleUser) {
    this.loadCommandeForService(serviceId); // ✅
  }
}

  sendMessage(): void {
    if (!this.chatInput.trim() || !this.selectedServiceId) return;
    this.chatService.sendMessage(
      this.selectedServiceId,
      this.chatInput,
      this.username,
      this.role
    );
    this.chatInput = '';
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.chatService.disconnect();
  }

    toggleSidebar(): void {
      this.sidebarrOpen = !this.sidebarrOpen;
    }
  
      logout(): void {
          this.authService.logout();
      
          Swal.fire({
            icon: 'error',
            title: 'Vous êtes deconnecté',
            showConfirmButton: false,
            timer: 1500
          }); 
          
  
          this.router.navigate(['/']);
        }


initAudio(): void {
  if (!this.audioCtx) {
    this.audioCtx = new AudioContext();
  } else if (this.audioCtx.state === 'suspended') {
    this.audioCtx.resume();
  }
}

playNotificationSound(): void {
  if (!this.audioCtx) {
    this.audioCtx = new AudioContext();
  }
  if (this.audioCtx.state === 'suspended') {
    this.audioCtx.resume();
  }

  const t = this.audioCtx.currentTime;

  // ── Note 1 : ding aigu
  const osc1 = this.audioCtx.createOscillator();
  const gain1 = this.audioCtx.createGain();
  osc1.connect(gain1);
  gain1.connect(this.audioCtx.destination);
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(1046, t);       // Do6
  gain1.gain.setValueAtTime(0.5, t);
  gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
  osc1.start(t);
  osc1.stop(t + 0.8);

  // ── Note 2 : harmonique douce
  const osc2 = this.audioCtx.createOscillator();
  const gain2 = this.audioCtx.createGain();
  osc2.connect(gain2);
  gain2.connect(this.audioCtx.destination);
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(1318, t + 0.1); // Mi6
  gain2.gain.setValueAtTime(0.3, t + 0.1);
  gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
  osc2.start(t + 0.1);
  osc2.stop(t + 0.9);

  // ── Note 3 : résolution
  const osc3 = this.audioCtx.createOscillator();
  const gain3 = this.audioCtx.createGain();
  osc3.connect(gain3);
  gain3.connect(this.audioCtx.destination);
  osc3.type = 'sine';
  osc3.frequency.setValueAtTime(1568, t + 0.2); // Sol6
  gain3.gain.setValueAtTime(0.4, t + 0.2);
  gain3.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
  osc3.start(t + 0.2);
  osc3.stop(t + 1.0);
}

private playSound(): void {
  const oscillator = this.audioCtx!.createOscillator();
  const gainNode = this.audioCtx!.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(this.audioCtx!.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, this.audioCtx!.currentTime);
  oscillator.frequency.setValueAtTime(660, this.audioCtx!.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.3, this.audioCtx!.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx!.currentTime + 0.4);

  oscillator.start(this.audioCtx!.currentTime);
  oscillator.stop(this.audioCtx!.currentTime + 0.4);
}

loadCommandeForService(serviceId: number): void {
  if (!this.currentUserId) return;
  this.serviceService.getByClient(this.currentUserId).subscribe(commandes => {
    const service = (this.serviceService as any).cachedServices?.find((s: any) => s.id === serviceId);
    const serviceTitle = this.discussionTitles[serviceId];
    this.currentServiceCommande = commandes.find(c => c.serviceTitle === serviceTitle);

    // récupérer les packs du service
    this.serviceService.getService().subscribe(services => {
      const sv = services.find((s: any) => s.id === serviceId);
      this.currentServicePacks = (sv as any)?.priceSections || [];
    });
  });
}

payerAvecPack(pack: any): void {
  if (!this.currentServiceCommande) return;
  this.serviceService.payerCommande(this.currentServiceCommande.id).subscribe(() => {
    this.showPaymentModal = false;
    Swal.fire({ icon: 'success', title: 'Paiement confirmé !', timer: 1500, showConfirmButton: false });
  });
}

openPaymentModal(): void {
  this.showPaymentModal = true;
  this.selectedPayPack = null;
  setTimeout(async () => {
    if (!(window as any).Square) {
      console.error('Square SDK non chargé');
      Swal.fire({ icon: 'error', title: 'Erreur', text: 'Square SDK non chargé' });
      return;
    }
    const payments = (window as any).Square.payments(
      'sandbox-sq0idb-vOwpMCtCuvesEBTe1JNCvQ',
      'LPFSAGHXZK4SZ'
    );
    this.squareCard = await payments.card();
    await this.squareCard.attach('#card-container');
  }, 500);
}

async submitPayment(): Promise<void> {
  if (!this.squareCard || !this.selectedPayPack || !this.currentServiceCommande) return;
  this.paymentLoading = true;
  try {
    const result = await this.squareCard.tokenize();
    if (result.status === 'OK') {
      this.paymentService.pay(
        result.token,
        this.selectedPayPack.price.toString(),
        this.currentServiceCommande.id
      ).subscribe({
        next: () => {
          this.paymentLoading = false;
          this.showPaymentModal = false;
          this.currentServiceCommande.status = 'PAYEE';
          Swal.fire({ icon: 'success', title: 'Paiement réussi !', timer: 1500, showConfirmButton: false });
        },
        error: (err) => {
          this.paymentLoading = false;
          Swal.fire({ icon: 'error', title: 'Erreur de paiement', text: err.error?.error });
        }
      });
    } else {
      this.paymentLoading = false;
      Swal.fire({ icon: 'error', title: 'Carte invalide', text: result.errors?.[0]?.message });
    }
  } catch (e) {
    this.paymentLoading = false;
  }
}
      
}