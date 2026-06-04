import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LivrableService {
  // private apiUrl = 'http://localhost:9090/livrables';
  private apiUrl = "/api/livrables";

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  uploadFiles(livrableId: number, files: File[]): Observable<any> {
    const form = new FormData();
    files.forEach(f => form.append('files', f));
    return this.http.post(`${this.apiUrl}/${livrableId}/upload`, form);
  }

getFichiers(id: number): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/${id}/fichiers`);
}

addFichiers(id: number, files: File[]): Observable<any> {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  return this.http.post<any>(`${this.apiUrl}/${id}/fichiers`, formData);
}

removeFichier(id: number, url: string): Observable<any> {
  return this.http.delete<any>(
    `${this.apiUrl}/${id}/fichiers`,
    { params: { url } }
  );
}

}