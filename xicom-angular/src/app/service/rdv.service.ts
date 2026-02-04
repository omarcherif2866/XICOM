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

 private apiUrl = "http://localhost:9090/rdv";


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

}
