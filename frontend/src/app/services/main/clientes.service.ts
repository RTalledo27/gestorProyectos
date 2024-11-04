import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../auth/authentification.service';
import { Clientes } from '../../pages/interfaces/clientes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private urlApiClientes = 'http://127.0.0.1:8000/api/clientes/';

  constructor(private http: HttpClient, private authService: AuthentificationService, private router: Router) { }

  // Método para obtener todos los clientes
  getClientes(): Observable<Clientes[]> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`
    };

    return this.http.get<Clientes[]>(this.urlApiClientes, { headers: headers });
  }

  // Método para obtener un cliente específico por ID
  getCliente(clienteId: number): Observable<Clientes> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`
    };

    return this.http.get<Clientes>(`${this.urlApiClientes}${clienteId}/`, { headers: headers });
  }

  // Método para crear un nuevo cliente
  createCliente(cliente: Clientes): Observable<Clientes> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`
    };

    return this.http.post<Clientes>(this.urlApiClientes, cliente, { headers: headers });
  }

  // Método para editar un cliente existente
  editCliente(clienteId: number, clienteData: Clientes): Observable<Clientes> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`
    };

    return this.http.put<Clientes>(`${this.urlApiClientes}${clienteId}/`, clienteData, { headers: headers });
  }

  // Método para eliminar un cliente
  deleteCliente(clienteId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`
    };

    return this.http.delete<any>(`${this.urlApiClientes}${clienteId}/`, { headers: headers });
  }
}
