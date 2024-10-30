import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tareas } from '../../pages/interfaces/tareas';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../auth/authentification.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private apiUrl= 'http://127.0.0.1:8000/api/tareas/';

  constructor(private http:HttpClient,private authService: AuthentificationService, private router:Router) { }

  getTareas(): Observable<Tareas[]>{

    const token = this.authService.getToken();

    if(!token){
      this.router.navigate(['/auth/login']);
    }

    const headers = {
      'Authorization': `Token ${token}`
    }

    return this.http.get<Tareas[]>(this.apiUrl,{headers: headers});
  }
}
