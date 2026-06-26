import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {

  private client!: Client;
  public message$ = new Subject<any>();
  private baseUrl = 'http://localhost:9090';
  private httpUnread = 'http://localhost:9090/unread';

  constructor(private http: HttpClient) {}

  getDiscussions(username: string, role: string) {
    return this.http.get<number[]>(
      `${this.baseUrl}/chat/discussions?username=${username}&role=${role}`
    );
  }

  getHistory(serviceId: number) {
    return this.http.get<any[]>(`${this.baseUrl}/chat/history/${serviceId}`);
  }

  connect(serviceId: number): void {
    this.client?.deactivate();
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${this.baseUrl}/ws`),
      onConnect: () => {
        this.client.subscribe(`/topic/chat/${serviceId}`, (msg) => {
          this.message$.next(JSON.parse(msg.body));
        });
      }
    });
    this.client.activate();
  }

  sendMessage(serviceId: number, content: string,
              senderUsername: string, senderRole: string): void {
    this.client.publish({
      destination: `/app/chat.send/${serviceId}`,
      body: JSON.stringify({ content, senderUsername, senderRole })
    });
  }

  disconnect(): void {
    this.client?.deactivate();
  }

  connectBackground(serviceId: number, onMessage: (msg: any) => void): void {
  const bgClient = new Client({
    webSocketFactory: () => new SockJS(`${this.baseUrl}/ws`),
    onConnect: () => {
      bgClient.subscribe(`/topic/chat/${serviceId}`, (msg) => {
        onMessage(JSON.parse(msg.body));
      });
    }
  });
  bgClient.activate();
}

getUnread(username: string) {
  return this.http.get<any[]>(`${this.httpUnread}/chat/${username}`);
}

resetUnread(username: string, serviceId: number) {
  this.http.post(`${this.httpUnread}/chat/reset/${username}/${serviceId}`, {}).subscribe();
}

incrementUnread(username: string, serviceId: number) {
  this.http.post(`${this.httpUnread}/chat/increment/${username}/${serviceId}`, {}).subscribe();
}

}