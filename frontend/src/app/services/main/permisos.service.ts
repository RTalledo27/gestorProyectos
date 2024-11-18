import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthentificationService } from '../auth/authentification.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Permisos } from '../../pages/interfaces/permisos';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  constructor(private http: HttpClient, private authService:AuthentificationService, private router: Router) { }
  private url = 'http://127.0.0.1:8000/api/permisos/';

  getPermisos(): Observable<Permisos[]> {
    const token = this.authService.getToken();
    if(!token){
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.get<Permisos[]>(`${this.url}`, { headers });
  }
  createPermiso(data: any): Observable<Permisos> {
    const token = this.authService.getToken();
    if(!token){
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.post<Permisos>(`${this.url}`, data, { headers });
  }

  editPermiso(id: number, data: any): Observable<Permisos> {
    const token = this.authService.getToken();
    if(!token){
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.put<Permisos>(`${this.url}${id}/`, data, { headers });
  }

  deletePermiso(id: number): Observable<Permisos> {
    const token = this.authService.getToken();
    if(!token){
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.delete<Permisos>(`${this.url}${id}/`, { headers });
  }

}
