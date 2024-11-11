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

  private apiUrl= 'http://127.0.0.1:8000/api';
  private subtareasUrl= 'http://127.0.0.1:8000/api/subtareas/';
  constructor(private http: HttpClient, private authService: AuthentificationService, private router: Router) { }

  getTareas(): Observable<Tareas[]> {
    return this.http.get<Tareas[]>(`${this.apiUrl}/tareas/`);
  }

  createTareas(tarea: Tareas): Observable<Tareas> {
    return this.http.post<Tareas>(`${this.apiUrl}/tareas/`, tarea);
  }

  updateTaskPriority(taskId: number, priority: string): Observable<Tareas> {
    return this.http.patch<Tareas>(`${this.apiUrl}/tareas/${taskId}/`, { prioridad: priority });
  }

  updateTaskStatus(taskId: number, status: string): Observable<Tareas> {
    return this.http.patch<Tareas>(`${this.apiUrl}/tareas/${taskId}/`, { estado: status });
  }

  editTarea(id: number, tarea: Tareas): Observable<Tareas> {
    return this.http.put<Tareas>(`${this.apiUrl}/tareas/${id}/`, tarea);
  }

  deletTarea(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tareas/${id}/`);
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
