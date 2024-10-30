import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from '../auth/authentification.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Servicios } from '../../pages/interfaces/servicios';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  private urlApiServicios = 'http://127.0.0.1:8000/api/servicios/';

  constructor(private http: HttpClient, private authService: AuthentificationService, private router:Router) { }


  getServicios(): Observable<Servicios[]>{
    const token = this.authService.getToken();
    if(!token){
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`
    }

    return this.http.get<Servicios[]>(this.urlApiServicios,{headers: headers});
  }


}
