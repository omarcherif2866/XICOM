import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {
  private baseUrl = 'http://localhost:9090/payments';

  constructor(private http: HttpClient) {}

  pay(sourceId: string, amount: string, commandeId: number) {
    return this.http.post(`${this.baseUrl}/pay`, {
      sourceId, amount, commandeId
    });
  }
}