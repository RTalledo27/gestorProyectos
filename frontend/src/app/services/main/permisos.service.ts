import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthentificationService } from '../auth/authentification.service';
import { Permisos } from '../../pages/interfaces/permisos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  private urlApiPermisos = 'http://127.0.0.1:8000/api/permisos/';  // URL de la API para permisos

  constructor(private http: HttpClient, private authService: AuthentificationService, private router: Router) { }

  // Método para obtener todos los permisos
  getPermisos(): Observable<Permisos[]> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`
    };

    return this.http.get<Permisos[]>(this.urlApiPermisos, { headers: headers });
  }

  // Método para crear un nuevo permiso
  createPermiso(permiso: Permisos): Observable<Permisos> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.post<Permisos>(this.urlApiPermisos, permiso, { headers: headers });
  }

  // Método para editar un permiso
  editPermiso(idPermiso: number, permiso: Permisos): Observable<Permisos> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.put<Permisos>(`${this.urlApiPermisos}${idPermiso}/`, permiso, { headers: headers });
  }

  // Método para eliminar un permiso
  deletePermiso(idPermiso: number): Observable<Permisos> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.delete<Permisos>(`${this.urlApiPermisos}${idPermiso}/`, { headers: headers });
  }
}
