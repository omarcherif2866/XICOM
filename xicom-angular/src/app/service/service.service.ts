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

  // private apiUrl = "/api/service";
  private apiUrl = "http://localhost:9090/service";

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

commander(payload: {
  serviceTitle: string;
  detailTitles: string[];
  objectifs: string;
  analyseSituation: string;
  messageCle: string;
  brief: string;
  devis: string;
  delaiSouhaite: string;
  status: string;
}, userId: number): Observable<any> {

  const body = {
    serviceTitle:     payload.serviceTitle,
    detailTitles:     payload.detailTitles,
    userId:           userId,
    objectifs:        payload.objectifs,
    analyseSituation: payload.analyseSituation,
    messageCle:       payload.messageCle,
    brief:            payload.brief,
    devis:            payload.devis,
    delaiSouhaite:    payload.delaiSouhaite,
  };

  return this.http.post(`${this.apiUrl}/commander`, body);
}


getCommandesByStatus(status: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/by-status`, {
    params: new HttpParams().set('status', status)
  });
}
}