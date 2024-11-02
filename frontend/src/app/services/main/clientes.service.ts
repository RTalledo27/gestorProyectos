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

  constructor(private http: HttpClient, private authService: AuthentificationService, private router:Router) { }


  getClientes(): Observable<Clientes[]>{
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`
    };

    return this.http.get<Clientes[]>(this.urlApiClientes,{headers: headers});
  }


  getCliente(clienteId: Number): Observable<Clientes>{
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
      };
    return this.http.get<Clientes>(`${this.urlApiClientes}${clienteId}/`,{headers: headers});
  }

}




