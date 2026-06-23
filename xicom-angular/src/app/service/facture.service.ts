import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facture, StatusFacture } from '../models/facture';
@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private apiUrl = 'http://localhost:9090/factures';
  // private apiUrl = "/api/factures";
 
  constructor(private http: HttpClient) {}
 
  getAll(): Observable<Facture[]> {
    return this.http.get<Facture[]>(this.apiUrl);
  }
 
  getById(id: number): Observable<Facture> {
    return this.http.get<Facture>(`${this.apiUrl}/${id}`);
  }
 
  getByUserId(userId: number): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/user/${userId}`);
  }
 
  getByCommandeId(commandeId: number): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.apiUrl}/commande/${commandeId}`);
  }
 
create(commandeId: number, userId: number,
       montant: number, fichier?: File): Observable<Facture> {
  const formData = new FormData();
  formData.append('commandeId', String(commandeId));
  formData.append('userId', String(userId));
  formData.append('montant', String(montant));
  if (fichier) formData.append('fichier', fichier);
  return this.http.post<Facture>(this.apiUrl, formData);
}
 
  updateStatus(id: number, status: StatusFacture): Observable<Facture> {
    return this.http.patch<Facture>(
      `${this.apiUrl}/${id}/status`,
      null,
      { params: new HttpParams().set('status', status) }
    );
  }
 
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
 
  // Télécharger les factures entre deux dates (filtre côté front)
  getByDateRange(factures: Facture[], from: Date, to: Date): Facture[] {
    return factures.filter(f => {
      const d = new Date(f.date);
      return d >= from && d <= to;
    });
  }
 
  // Recherche par référence
  getByReference(factures: Facture[], ref: string): Facture | undefined {
    return factures.find(f =>
      f.reference.toLowerCase().includes(ref.toLowerCase())
    );
  }
}
 