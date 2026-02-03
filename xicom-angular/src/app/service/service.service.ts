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
 private apiUrl = "http://localhost:9090/service";


  constructor(private http: HttpClient, private router: Router) { }

getServiceById(id: any): Observable<Service> {
  return this.http.get<Service>(`${this.apiUrl}/${id}`).pipe(
    tap(data => console.log('Service reçu:', data)), // debug
    catchError((error: any) => {
      console.error('Erreur lors de la récupération du Service:', error);
      return throwError(error);
    })
  );
}


// Service.service.ts
getService(): Observable<Service[]> {
  return this.http.get<any[]>(`${this.apiUrl}/all`).pipe(
      tap(data => console.log('Données reçues:', data)), // ✅ Debug
      catchError((error: any) => {
        console.error('Erreur:', error);
        return throwError(error);
      })
    );
}




addService(data: FormData): Observable<Service> {
  // Pas besoin de spécifier Content-Type, le navigateur le fera automatiquement pour FormData
  return this.http.post<Service>(`${this.apiUrl}`, data)
    .pipe(
      catchError((error: any) => {
        console.error('Erreur lors de l\'ajout du Service:', error);
        return throwError('Une erreur s\'est produite lors de l\'ajout du Service. Veuillez réessayer.');
      })
    );
}

  putService(id: string, formData: any): Observable<Service> {
  return this.http.put<Service | HttpErrorResponse>(`${this.apiUrl}/${id}`, formData)
    .pipe(
      map((response: any) => {
        // Vérifier si la réponse est une instance de HttpErrorResponse
        if (response instanceof HttpErrorResponse) {
          // Si c'est une erreur HTTP, propager l'erreur
          throw response;
        } else {
          // Sinon, retourner la réponse comme une instance d'Activite
          return response as Service;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Traiter les erreurs HTTP ici
        console.error('Erreur lors de la mise à jour du Service:', error);
        // Retourner une erreur observable
        return throwError('Une erreur s\'est Servicee lors de la mise à jour du Service. Veuillez réessayer.');
      })
    );
}


  deleteService(id:any):Observable<Service>{
    return this.http.delete<Service>(`${this.apiUrl}/${id}`)

  }




}

