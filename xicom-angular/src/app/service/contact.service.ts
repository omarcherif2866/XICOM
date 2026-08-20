import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private apiUrl = "/api/contact";
  // private apiUrl = 'http://localhost:9090';

  constructor(private http: HttpClient) {}


sendContact(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/contact`, {
    nom: data.nom,
    email: data.email,
    sujet: data.sujet,
    phone: data.countryCode + data.phone,
    message: data.message
  }, { responseType: 'text' });
}

}
