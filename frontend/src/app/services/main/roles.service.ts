import { RolesPermisos } from './../../pages/interfaces/roles-permisos';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthentificationService } from '../auth/authentification.service';
import { EMPTY, map, Observable, switchMap } from 'rxjs';
import { Roles } from '../../pages/interfaces/roles';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient,private authService: AuthentificationService,private router: Router) { }
  private url = 'http://127.0.0.1:8000/api/roles/';

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
      throw new Error('No authentication token');
    }
    return new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getRoles(): Observable<Roles[]> {
    return this.http.get<Roles[]>(`${this.url}`, { headers: this.getHeaders() });
  }

  createRol(rol: Partial<Roles>): Observable<Roles> {
    return this.http.post<Roles>(`${this.url}`, rol, { headers: this.getHeaders() });
  }

  editRol(roleId: number, roleData: Partial<Roles>, selectedPermisos: number[]): Observable<Roles> {
    const data = { ...roleData, permisos: selectedPermisos };
    return this.http.put<Roles>(`${this.url}${roleId}/`, data, { headers: this.getHeaders() });
  }

  deleteRol(idRol: number): Observable<Roles> {
    return this.http.delete<Roles>(`${this.url}${idRol}/`, { headers: this.getHeaders() });
  }

  getRolesPermisosById(idRol: number): Observable<RolesPermisos[]> {
    return this.http.get<RolesPermisos[]>(`${this.url}${idRol}/permisos/`, { headers: this.getHeaders() });
  }

  assignPermisosToRol(idRol: number, permisoIds: number[]): Observable<RolesPermisos[]> {
    return this.http.post<RolesPermisos[]>(`${this.url}${idRol}/permisos/`, { permisoIds }, { headers: this.getHeaders() });
  }


}
