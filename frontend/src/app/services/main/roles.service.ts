import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthentificationService } from '../auth/authentification.service';
import { Observable } from 'rxjs';
import { Roles } from '../../pages/interfaces/roles';
import { Router } from '@angular/router';
import { RolesPermisos } from '../../pages/interfaces/roles-permisos';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient,private authService: AuthentificationService,private router: Router) { }
  private url = 'http://127.0.0.1:8000/api/roles/';

  getRoles(): Observable<Roles[]> {
    const token = this.authService.getToken();
    if (token) {
      return this.http.get<Roles[]>(`${this.url}`, { headers: { Authorization: `Token ${token}` } });
    }else{
      return this.http.get<Roles[]>(`${this.url}`);
    }
  }

  editRole(id: number, data: any): Observable<Roles> {
   const token = this.authService.getToken();
   if(!token){
     this.router.navigate(['/auth/login']);
   }
   const headers = new HttpHeaders({
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  });

    return this.http.put<Roles>(`${this.url}${id}/`, data, { headers });
  }
  createRole(data: any): Observable<Roles> {
    const token = this.authService.getToken();
    if (token) {
      return this.http.post<Roles>(`${this.url}`, data, { headers: { Authorization: `Token ${token}` } });
    } else {
      return this.http.post<Roles>(`${this.url}`, data);
    }
  }

  deleteRole(id: number): Observable<Roles> {
    const token = this.authService.getToken();
    if (token) {
      return this.http.delete<Roles>(`${this.url}${id}/`, { headers: { Authorization: `Token ${token}` } });
    } else {
      return this.http.delete<Roles>(`${this.url}${id}/`);
    }
  }

  getRolesPermisos(): Observable<RolesPermisos[]> {
    return this.http.get<RolesPermisos[]>(`${this.url}/roles-permisos`);
  }

  assignPermisosToRol(rolId: number, permisoIds: number[]): Observable<RolesPermisos[]> {
    return this.http.post<RolesPermisos[]>(`${this.url}/roles/${rolId}/permisos`, { permisoIds });
  }

  updateRolPermisos(rolId: number, permisoIds: number[]): Observable<RolesPermisos[]> {
    return this.http.put<RolesPermisos[]>(`${this.url}/roles/${rolId}/permisos`, { permisoIds });
  }

}
