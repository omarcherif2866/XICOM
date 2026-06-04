import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Abonnee } from '../models/abonnee';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbonneeServiceService {
  // private apiUrl = "/api/abonnee";
  private apiUrl = "http://localhost:9090/abonnee";


  constructor(private http: HttpClient, private router: Router) { }

  getAllAbonnes(): Observable<Abonnee[]> {
  return this.http.get<Abonnee[]>(`${this.apiUrl}`);
}

countAbonnes(): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/count`);
}

addAbonne(abonne: Abonnee): Observable<Abonnee> {
  return this.http.post<Abonnee>(`${this.apiUrl}`, abonne);
}
}
