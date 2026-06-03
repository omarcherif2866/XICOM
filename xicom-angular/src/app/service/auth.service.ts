import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, tap } from 'rxjs/operators';
import { EncryptionService } from './encryption-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "/api/auth";
  // private apiUrl = "http://localhost:9090/auth";

  private apiUrlUser = "/api/users";
  // private apiUrlUser = "http://localhost:9090/users";

  private localStorageKey = "userAuth";
  private loggedIn = new BehaviorSubject<boolean>(false);
  private jwtHelper = new JwtHelperService();

  constructor( 
    private httpClient: HttpClient,
    private encryptionService: EncryptionService
  ) {
    // ✅ Déchiffrer avant de parser
    const userData = localStorage.getItem(this.localStorageKey);
    if (userData) {
      const decrypted = this.encryptionService.decrypt(userData); // ← corrigé
      this.loggedIn.next(!!decrypted?.accessToken);
    }
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  // -------------------- LOGIN --------------------
  login(loginData: { email: string; password: string }): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        // ✅ Tout chiffré
        localStorage.setItem(this.localStorageKey, this.encryptionService.encrypt(response));
        localStorage.setItem('userRole', this.encryptionService.encrypt(response.role));
        localStorage.setItem('accessToken', this.encryptionService.encrypt(response.accessToken));
        this.loggedIn.next(true);
      }),
      catchError(error => throwError(() => error))
    );
  }

  // -------------------- LOGOUT --------------------
  logout(): void {
    ['userAuth', 'accessToken', 'userId', 'userRole'].forEach(key =>
      localStorage.removeItem(key)
    );
    this.loggedIn.next(false);
  }

  // -------------------- REGISTER --------------------
  addUser(user: any): Observable<User> {
    return this.httpClient.post<User>(`${this.apiUrl}/register`, user);
  }

  // -------------------- TOKEN --------------------
  getToken(): string | null {
    const encrypted = localStorage.getItem(this.localStorageKey);
    if (!encrypted) return null;
    // ✅ Déchiffrer avant d'accéder à accessToken
    const decrypted = this.encryptionService.decrypt(encrypted);
    return decrypted?.accessToken || null;
  }

  getRoleFromToken(): string {
    const token = this.getToken(); // ✅ utilise getToken() corrigé
    if (!token) return "vide";
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.role || "";
  }

  // -------------------- USER ID --------------------
  getUserIdFromToken(): number | null {
    const token = this.getToken(); // ✅ utilise getToken() corrigé
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      const decoded = this.jwtHelper.decodeToken(token);
      return decoded?.id || null;
    }
    return null;
  }

  storeUserIdFromToken(): void {
    const id = this.getUserIdFromToken();
    if (id !== null) {
      // ✅ Chiffrer aussi le userId
      localStorage.setItem('userId', this.encryptionService.encrypt(id.toString()));
    }
  }

  getUserId(): number | null {
    const encrypted = localStorage.getItem('userId');
    if (!encrypted) return null;
    // ✅ Déchiffrer avant de retourner
    const decrypted = this.encryptionService.decrypt(encrypted);
    return decrypted ? Number(decrypted) : null;
  }

  // -------------------- UPDATE USER --------------------
  updateUser(id: number, user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.apiUrl}/${id}`, user, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getUserById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrlUser}/${id}`);
  }

  changePassword(id: number, data: any): Observable<any> {
    return this.httpClient.put(`${this.apiUrlUser}/change-password/${id}`, data);
  }

  forgotPassword(email: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/forgot`, { email });
  }

  verifyCode(userId: string, code: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/verify-code`, { userId, code });
  }

  resetPassword(userId: string, newPassword: string): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/reset`, { userId, newPassword });
  }
}