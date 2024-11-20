import { RolesPermisos } from './../../pages/interfaces/roles-permisos';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthentificationService } from '../auth/authentification.service';
import { Observable } from 'rxjs';
import { Roles } from '../../pages/interfaces/roles';
import { Router } from '@angular/router';

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

  createRol(idRol:Roles): Observable<Roles> {
    const token = this.authService.getToken();
    if(!token){
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    };
    return this.http.post<Roles>(`${this.url}`, idRol,{ headers: headers });
  }

  editRol(idRol: number, rol: Roles): Observable<Roles> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
      const headers = {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      };
      return this.http.put<Roles>(`${this.url}${idRol}/`, rol,{ headers: headers });
  }

  deleteRol(idRol: number): Observable<Roles> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    };
    return this.http.delete<Roles>(`${this.url}${idRol}/`, { headers: headers });
  }

  getRolesPermisosById(idRol: number): Observable<RolesPermisos[]> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    return this.http.get<RolesPermisos[]>(`${this.url}${idRol}/permisos/`, { headers: { Authorization: `Token ${token}` } });
  }

  getRolesPermisosAll():Observable<RolesPermisos[]>{
    const token = this.authService.getToken();
    if(!token){
      this.router.navigate(['/auth/login']);
    }
    return this.http.get<RolesPermisos[]>(`${this.url}permisos/`,{headers: { Authorization: `Token ${token}` }});
  }


  assignPermisosToRol(idRol: number, permisoIds: number[]): Observable<RolesPermisos[]> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    return this.http.post<RolesPermisos[]>(`${this.url}${idRol}/permisos/`, { permisoIds, headers: { Authorization: `Token ${token}` } });
  }


}
