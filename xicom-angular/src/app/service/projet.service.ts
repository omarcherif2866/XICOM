import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/projet';
// import { Client } from '../models/Client';

@Injectable({ providedIn: 'root' })
export class ClientService {

  // private apiUrl = 'http://localhost:9090/projet';
  private apiUrl = "/api/projet";

  constructor(private http: HttpClient) {}

create(data: any, fileMap: { [key: string]: File[] }): Observable<any> {
  const formData = new FormData();

  // Champs texte
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  // Champs fichiers — liste
  const fileFields = ['logo', 'avatars', 'charteGraphique', 'policesCaracteres',
    'imagesIllustrations', 'lesProduits', 'lesAvis', 'lesPublications'];

  fileFields.forEach(key => {
    const files = fileMap[key] || [];
    files.forEach(file => formData.append(key, file));
  });

  return this.http.post(`${this.apiUrl}`, formData);
}

update(id: number, data: any, fileMap: { [key: string]: File[] }, existingUrlMap: { [key: string]: string[] }): Observable<any> {
  const formData = new FormData();

  // Champs texte
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  // Nouveaux fichiers
  const fileFields = ['logo', 'avatars', 'charteGraphique', 'policesCaracteres',
    'imagesIllustrations', 'lesProduits', 'lesAvis', 'lesPublications'];

  fileFields.forEach(key => {
    const files = fileMap[key] || [];
    files.forEach(file => formData.append(key, file));
  });

  // URLs existantes à conserver
  fileFields.forEach(key => {
    const urls = existingUrlMap[key] || [];
    urls.forEach(url => formData.append(key + 'Existing', url));
  });

  return this.http.put(`${this.apiUrl}/${id}`, formData);
}

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }

  getByUser(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/by-user/${userId}`);
}
}