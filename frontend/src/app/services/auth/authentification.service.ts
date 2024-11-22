import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable,Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { Usuarios } from '../../pages/interfaces/usuarios';


interface LoginResponse {
  token: string;
  estudiante: any;
}


@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private url=  'http://127.0.0.1:8000/api/login/';
  private urlPerfil = 'http://127.0.0.1:8000/api/perfil/';

  constructor(
    private http: HttpClient,
    private router: Router,

    @Inject(PLATFORM_ID) private platformId: Object

   ) { }

   private tokenKey = 'token';
   private inMemoryToken: string | null = null;

   login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}`, { username, password }).pipe(
      tap((response: LoginResponse) => {
        if (response && response.token) {
          this.setToken(response.token);
        }
      }),
      catchError(error => {
        console.error('Login error', error);
        return of({ token: '', estudiante: null });
      })
    );
  }

  setToken(token: string): void {
    this.inMemoryToken = token;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey) || this.inMemoryToken;
    }
    return this.inMemoryToken;
  }

  isLoggedIn(): boolean {

    return !!this.getToken();
  }

  logout(): void {
    this.inMemoryToken = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.router.navigate(['/auth/login']);
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders().set('Authorization', `Token ${token}`);
  }

  getPerfil(): Observable<Usuarios> {
    return this.http.get<Usuarios>(`${this.urlPerfil}`, { headers: this.getHeaders() });
  }

}
