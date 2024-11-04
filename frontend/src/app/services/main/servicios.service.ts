import { HttpClient } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../auth/authentification.service';
import { Servicios } from '../../pages/interfaces/servicios';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  private urlApiServicios = 'http://127.0.0.1:8000/api/servicios/';

  constructor(private http: HttpClient, private authService: AuthentificationService, private router: Router) { }

  // Método para obtener todos los servicios
  getServicios(): Observable<Servicios[]> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`
    };

    return this.http.get<Servicios[]>(this.urlApiServicios, { headers: headers });
  }

  // Método para obtener un servicio específico por ID
  getServicio(servicioId: number): Observable<Servicios> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`
    };

    return this.http.get<Servicios>(`${this.urlApiServicios}${servicioId}/`, { headers: headers });
  }

  // Método para crear un nuevo servicio
  createServicio(servicio: Servicios): Observable<Servicios> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`
    };

    return this.http.post<Servicios>(this.urlApiServicios, servicio, { headers: headers });
  }

  // Método para editar un servicio existente
  editServicio(servicioId: number, servicioData: Servicios): Observable<Servicios> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`
    };

    return this.http.put<Servicios>(`${this.urlApiServicios}${servicioId}/`, servicioData, { headers: headers });
  }

  // Método para eliminar un servicio
  deleteServicio(servicioId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`
    };

    return this.http.delete<any>(`${this.urlApiServicios}${servicioId}/`, { headers: headers });
  }
}
