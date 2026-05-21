import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Compagne } from '../models/compagne';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompagneService {

  // private apiUrl = 'http://localhost:9090/compagne';
  private apiUrl = "/api/compagne";
  constructor(private http: HttpClient) {}

  create(compagne: Compagne): Observable<Compagne> {
    return this.http.post<Compagne>(this.apiUrl, compagne);
  }
}
