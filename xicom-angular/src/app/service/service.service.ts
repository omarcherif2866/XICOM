import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../models/service';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = "/api/service";

  constructor(private http: HttpClient, private router: Router) { }

  getServiceById(id: any): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}/${id}`).pipe(
      tap(data => console.log('Service reçu:', data)),
      catchError((error: any) => {
        console.error('Erreur lors de la récupération du Service:', error);
        return throwError(error);
      })
    );
  }

  getService(): Observable<Service[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`).pipe(
      tap(data => console.log('Données reçues:', data)),
      catchError((error: any) => {
        console.error('Erreur:', error);
        return throwError(error);
      })
    );
  }

  addService(data: FormData): Observable<Service> {
    return this.http.post<Service>(`${this.apiUrl}`, data).pipe(
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout du Service:', error);
        return throwError('Une erreur s\'est produite lors de l\'ajout du Service. Veuillez réessayer.');
      })
    );
  }

  putService(id: string, formData: any): Observable<Service> {
    return this.http.put<Service | HttpErrorResponse>(`${this.apiUrl}/${id}`, formData).pipe(
      map((response: any) => {
        if (response instanceof HttpErrorResponse) {
          throw response;
        } else {
          return response as Service;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur lors de la mise à jour du Service:', error);
        return throwError('Une erreur s\'est produite lors de la mise à jour du Service. Veuillez réessayer.');
      })
    );
  }

  deleteService(id: any): Observable<Service> {
    return this.http.delete<Service>(`${this.apiUrl}/${id}`);
  }
}