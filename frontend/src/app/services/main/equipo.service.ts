import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../auth/authentification.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuarios } from '../../pages/interfaces/usuarios';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {

  constructor(private http:HttpClient,private authService: AuthentificationService, private router:Router) { }

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
}
