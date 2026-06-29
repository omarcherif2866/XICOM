import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { RDV } from '../models/rdv';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RDVService {

  private apiUrl = "/api/rdv";
  // private apiUrl = "http://localhost:9090/rdv";


  constructor(private http: HttpClient, private router: Router) { }

  addRDV(data: any): Observable<RDV> {
    return this.http.post<RDV>(`${this.apiUrl}`, data, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout du RDV:', error);
        return throwError(() => 'Une erreur s\'est produite lors de l\'ajout du RDV. Veuillez réessayer.');
      })
    );
  }

    getAllRDV(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getRDVByClient(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/client/${email}`);
  }


  updateRDV(id: number, data: { date: string; heure: string; lien_reunion: string }): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  getCalendrier(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/calendrier`);
}

}