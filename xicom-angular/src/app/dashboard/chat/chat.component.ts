import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ChatService } from 'src/app/service/chat.service';
import { ServiceService } from 'src/app/service/service.service';

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

  selectedServiceId: number | null = null;
  messages: any[] = [];
  chatInput = '';
  username = '';
  role = '';
  private sub: any;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private serviceService: ServiceService,
    private router: Router,
     private route: ActivatedRoute
  ) {}

ngOnInit(): void {
  const token = this.authService.getToken();
  if (!token) {
    this.router.navigate(['/signin']);
    return;
  }

  this.username = this.authService.getUsernameFromToken() ?? '';
  this.role = this.authService.getRoleFromToken() ?? 'CLIENT';

  console.log('username:', this.username); // 👈
  console.log('role:', this.role);         // 👈

  this.loadDiscussions();

this.route.queryParams.subscribe(params => {
  if (params['serviceId']) {
    const serviceId = +params['serviceId'];
    setTimeout(() => {
      this.selectDiscussion(serviceId);
      this.router.navigate(['/chat'], { replaceUrl: true }); // ✅ nettoie l'URL
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
        this.unreadCounts[id] = 0;
        const service = services.find((s: any) => s.id === id);
        if (service) this.discussionTitles[id] = (service as any).title;

        this.chatService.getHistory(id).subscribe(msgs => {
          const client = msgs.find((m: any) => m.senderRole !== 'Admin');
          if (client) this.discussionUsernames[id] = client.senderUsername;
        });

        // ✅ souscrire à toutes les discussions pour détecter les nouveaux messages
        this.chatService.connectBackground(id, (msg: any) => {
          if (msg.serviceId !== this.selectedServiceId) {
            this.unreadCounts[msg.serviceId] = (this.unreadCounts[msg.serviceId] || 0) + 1;
          }
        });
      });
    });
  });
}

selectDiscussion(serviceId: number): void {
  this.unreadCounts[serviceId] = 0;
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
      if (msg.serviceId !== this.selectedServiceId) {
    this.unreadCounts[msg.serviceId] = (this.unreadCounts[msg.serviceId] || 0) + 1;
  }
  });
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
}