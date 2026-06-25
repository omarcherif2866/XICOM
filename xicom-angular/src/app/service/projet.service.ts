import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/projet';
// import { Client } from '../models/Client';

@Injectable({ providedIn: 'root' })
export class ClientService {

  private apiUrl = 'http://localhost:9090/projet';
  // private apiUrl = "/api/projet";

  constructor(private http: HttpClient) {}

create(
  data: any,
  fileMap: { [key: string]: File[] },
  produitItemsJson: { [key: string]: string },
  produitFilesMap: { [key: string]: File[] }
): Observable<any> {
  const formData = new FormData();

  // ===== Champs texte =====
  const textFields = [
    'client', 'secteur', 'categorie', 'responsableNomPrenom',
    'responsableAdresse', 'responsableTelephone', 'responsableEmail',
    'couleurANePasUtiliser', 'autresDonnees', 'autresCommentaires',
    'siteWeb', 'coordonnees', 'servicesReconnusOutils', 'concurrent'
  ];
  textFields.forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  // ===== Listes texte (reseauxSociaux, canauxContact) =====
  (data.reseauxSociaux || []).forEach((v: string) => formData.append('reseauxSociaux', v));
  (data.canauxContact || []).forEach((v: string) => formData.append('canauxContact', v));

  // ===== userId =====
  if (data.userId !== undefined) {
    formData.append('userId', data.userId);
  }

  // ===== Fichiers identité visuelle =====
  // couleurSecondaire est maintenant un fichier
  const imageFileFields = ['logo', 'avatars', 'charteGraphique', 'policesCaracteres', 'imagesIllustrations', 'couleurSecondaire'];
  imageFileFields.forEach(key => {
    (fileMap[key] || []).forEach(file => formData.append(key, file));
  });

  // ===== Produits (items JSON + fichiers) =====
  ['produit1', 'produit2', 'produit3', 'produit4', 'produit5'].forEach(key => {
    const itemsJson = produitItemsJson[key] || '[]';
    formData.append(`${key}Items`, itemsJson);
    (produitFilesMap[key] || []).forEach(file => formData.append(`${key}Files`, file));
  });

  return this.http.post(`${this.apiUrl}`, formData);
}

update(
  id: number,
  data: any,
  fileMap: { [key: string]: File[] },
  existingUrlMap: { [key: string]: string[] },
  produitItemsJson: { [key: string]: string },
  produitFilesMap: { [key: string]: File[] }
): Observable<any> {
  const formData = new FormData();

  // ===== Champs texte =====
  const textFields = [
    'client', 'secteur', 'categorie', 'responsableNomPrenom',
    'responsableAdresse', 'responsableTelephone', 'responsableEmail',
    'couleurANePasUtiliser', 'autresDonnees', 'autresCommentaires',
    'siteWeb', 'coordonnees', 'servicesReconnusOutils', 'concurrent'
  ];
  textFields.forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });

  // ===== Listes texte =====
  (data.reseauxSociaux || []).forEach((v: string) => formData.append('reseauxSociaux', v));
  (data.canauxContact || []).forEach((v: string) => formData.append('canauxContact', v));

  // ===== Nouveaux fichiers identité visuelle =====
  const imageFileFields = ['logo', 'avatars', 'charteGraphique', 'policesCaracteres', 'imagesIllustrations', 'couleurSecondaire'];
  imageFileFields.forEach(key => {
    (fileMap[key] || []).forEach(file => formData.append(key, file));
  });

  // ===== URLs existantes à conserver (identité visuelle) =====
  imageFileFields.forEach(key => {
    (existingUrlMap[key] || []).forEach(url => formData.append(`${key}Existing`, url));
  });

  // ===== Produits (items JSON contient existants + nouveaux slots vides) =====
  ['produit1', 'produit2', 'produit3', 'produit4', 'produit5'].forEach(key => {
    const itemsJson = produitItemsJson[key] || '[]';
    formData.append(`${key}Items`, itemsJson);
    (produitFilesMap[key] || []).forEach(file => formData.append(`${key}Files`, file));
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