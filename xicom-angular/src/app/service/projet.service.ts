import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Projet } from '../models/projet';

@Injectable({ providedIn: 'root' })
export class ProjetService {

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

  update(id: number, projet: Projet): Observable<Projet> {
    return this.http.put<Projet>(`${this.apiUrl}/${id}`, projet);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getById(id: number): Observable<Projet> {
    return this.http.get<Projet>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.apiUrl);
  }

  count(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`);
  }
}