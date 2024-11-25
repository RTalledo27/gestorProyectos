import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../auth/authentification.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Usuarios } from '../../pages/interfaces/usuarios';
import { catchError, EMPTY, forkJoin, map, Observable, Subject, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private equipoActualizadoSource = new Subject<void>();
  equipoActualizado = this.equipoActualizadoSource.asObservable();

  constructor(private http: HttpClient, private authService: AuthentificationService, private router: Router) { }

  private apiUrl = 'http://127.0.0.1:8000/api';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Token ${token}`);
  }

  getEquipo(): Observable<Usuarios[]> {
    const headers = this.getHeaders();
    return this.http.get<Usuarios[]>(`${this.apiUrl}/usuarios/`, { headers });
  }

  getProyectosActivosCount(): Observable<{[key: number]: number}> {
    const headers = this.getHeaders();
    return this.http.get<{[key: number]: number}>(`${this.apiUrl}/proyectos-activos-count/`, { headers });
  }

  getEquipoConProyectosActivos(): Observable<Usuarios[]> {
    return forkJoin({
      equipo: this.getEquipo(),
      proyectosActivos: this.getProyectosActivosCount()
    }).pipe(
      map(({ equipo, proyectosActivos }) =>
        equipo.map(usuario => ({
          ...usuario,
          proyectos_activos: proyectosActivos[usuario.id] || 0
        }))
      )
    );
  }

  asignarProyecto(usuario_id: number, proyecto_id: number, rol: any): Observable<Usuarios> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.post<Usuarios>(`${this.apiUrl}/proyectos/${proyecto_id}/asignar/`, { usuario_id: usuario_id, rol: rol }, { headers: headers });
  }

  getMiembrosEquipo(proyectoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/proyectos/${proyectoId}/equipo`, { headers: this.getHeaders() });
  }

  getDesarrolladoresDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/desarrolladores-disponibles`, { headers: this.getHeaders() });
  }

  asignarDesarrollador(proyectoId: number, desarrolladorId: number, rol: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/proyectos/${proyectoId}/asignar`, { desarrolladorId, rol }, { headers: this.getHeaders() });
  }

  cambiarRol(proyectoId: number, miembroId: number, nuevoRol: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/proyectos/${proyectoId}/miembros/${miembroId}`, { rol: nuevoRol }, { headers: this.getHeaders() });
  }

  removerMiembro(proyectoId: number, miembroId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/proyectos/${proyectoId}/miembros/${miembroId}`, { headers: this.getHeaders() });
  }

  notificarEquipoActualizado(): void {
    this.equipoActualizadoSource.next();
  }


  addUsuario(usuario: Usuarios): Observable<Usuarios> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.post<any>(`${this.apiUrl}/usuarios/`, usuario, { headers });
  }

  updateUsuario(usuario: Usuarios): Observable<Usuarios> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token found. Redirecting to login.');
      this.router.navigate(['/auth/login']);
      return EMPTY;
    }

    const headers = {
      'Authorization': `Token ${token}`
    };

    console.log('Updating user:', usuario);
    console.log('User ID:', usuario.id);

    return this.http.put<Usuarios>(`${this.apiUrl}/usuarios/${usuario.id}/`, usuario, { headers }).pipe(
      tap(updatedUser => {
        console.log('Server response:', updatedUser);
      }),
      catchError(this.handleError)
    );
  }

  getCargos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cargos/`, { headers: this.getHeaders() });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error in updateUsuario:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Client-side error:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }
    return throwError(() => new Error('Error updating user. Please try again.'));
  }
}
