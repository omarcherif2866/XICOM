import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
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
  // private apiUrl = "http://localhost:9090/service";

  constructor(private http: HttpClient, private router: Router) { }

  getServiceById(id: any): Observable<Service> {
      return this.http.get<Service>(`${this.apiUrl}/${id}`).pipe(
        catchError((error: any) => {
          return throwError(error);
        })
      );
    }

    getService(): Observable<Service[]> {
      return this.http.get<any[]>(`${this.apiUrl}/all`).pipe(
        catchError((error: any) => {
          return throwError(error);
        })
      );
    }

  addService(data: FormData): Observable<Service> {
    return this.http.post<Service>(`${this.apiUrl}`, data).pipe(
      catchError((error: any) => {
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
        return throwError('Une erreur s\'est produite lors de la mise à jour du Service. Veuillez réessayer.');
      })
    );
  }

  deleteService(id: any): Observable<Service> {
    return this.http.delete<Service>(`${this.apiUrl}/${id}`);
  }

commander(serviceTitle: string, detailTitles: string[], userId: number): Observable<any> {
  const params = new HttpParams()
    .set('serviceTitle', serviceTitle)
    .set('userId', userId.toString());

  // Ajouter chaque detailTitle séparément
  let finalParams = params;
  detailTitles.forEach(d => {
    finalParams = finalParams.append('detailTitles', d);
  });

  return this.http.post(`${this.apiUrl}/commander`, null, { params: finalParams });
}
}