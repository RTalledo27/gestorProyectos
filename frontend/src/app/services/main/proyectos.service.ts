import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Proyectos } from '../../pages/interfaces/proyectos';
import { Observable, forkJoin, map } from 'rxjs';
import { AuthentificationService } from '../auth/authentification.service';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  private url = 'http://127.0.0.1:8000/api/proyectos/';

  constructor( private http: HttpClient, private authService: AuthentificationService, private router:Router) {  }

  //TODO: Añadir métodos para crear, editar y eliminar proyectos
  //TODO: Añadir métodos para obtener los datos de un proyecto específico
  //TODO: Añadir métodos para obtener los datos de un usuario específico

  getProyectos(): Observable<Proyectos[]> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return forkJoin({
      proyectos: this.http.get<Proyectos[]>(this.url, {headers}),
      tareasPendientes: this.http.get<{ [key: string]: number }>(`${this.url}tareas-pendientes/`, { headers })
    }).pipe(
      map(({ proyectos, tareasPendientes }) =>
        proyectos.map(proyecto => ({
          ...proyecto,
          tareas_pendientes: tareasPendientes[proyecto.id ? proyecto.id.toString() : ''] || 0,
        }))
      )
    );
  }

  getProyectoById(id: number): Observable<Proyectos>{
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.get<Proyectos>(`${this.url}${id}/`,{headers: headers});
  }


  getTareasWithProyecto(proyecto_id: number): Observable<any>{
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`
    };

    return this.http.get<any>(`${this.url}/tareas/`,{headers: headers});
  }


  createProyecto(proyecto: Proyectos): Observable<Proyectos>{
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.post<Proyectos>(this.url,proyecto,{headers: headers});
  }

  editProyecto(proyecto: Proyectos): Observable<Proyectos> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
      return new Observable(); // Return empty observable if no token
    }
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<Proyectos>(`${this.url}${proyecto.id}/`, proyecto, { headers });
  }


  deleteProyecto(id: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
      return new Observable(); // Return empty observable if no token
    }
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete(`${this.url}${id}/`, { headers });
  }


  getProyectoDetalle(id: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
      return new Observable(); // Return empty observable if no token
    }
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.url}${id}/detalle/`, { headers });
  }


}
