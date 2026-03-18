import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  private apiUrl = "/api/images";


  constructor(private http: HttpClient, private router: Router) { }


  getAvailableIcons(): Observable<string[]> {
    console.log('📡 Calling API: /images/icons');
    return this.http.get<string[]>(`${this.apiUrl}/icons`);
  }

}
