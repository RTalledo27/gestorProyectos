import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tareas } from '../../pages/interfaces/tareas';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../auth/authentification.service';
import { Router } from '@angular/router';
import { SubTarea } from '../../pages/interfaces/sub-tarea';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private apiUrl= 'http://127.0.0.1:8000/api/tareas/';
  private subtareasUrl= 'http://127.0.0.1:8000/api/subtareas/';
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


  createTareas(tarea: Tareas): Observable<Tareas>{
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.post<Tareas>(this.apiUrl,tarea,{headers: headers});
  }

  editTarea(tarea: Tareas, tareaData: Tareas): Observable<Tareas>{
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.put<Tareas>(`${this.apiUrl}${tarea.id}/`,tareaData,{headers: headers});
  }

  deletTarea(tarea: Tareas): Observable<Tareas>{
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.delete<Tareas>(`${this.apiUrl}${tarea.id}/`,{headers: headers});
  }


  //SUBTAREAS

  getSubtareasByTarea(tareaId: number): Observable<any>{
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.get<SubTarea>(`${this.subtareasUrl}?tarea=${tareaId}`,{headers: headers});
  }

  createSubtarea(subtarea: any): Observable<any>{
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.post<any>(`${this.apiUrl}`,{headers: headers});
  }

  updateSubtarea(subtareaId: number, subtarea: any): Observable<any>{
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.put<any>(`${this.apiUrl}subtareas/${subtareaId}/`,subtarea,{headers: headers});
  }

  deleteSubtarea(subtareaId: number): Observable<any>{
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.delete<any>(`${this.apiUrl}subtareas/${subtareaId}/`,{headers: headers});
  }
}
