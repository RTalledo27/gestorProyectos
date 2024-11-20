import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditLog } from '../../pages/interfaces/audit-log';
import { HttpClient } from '@angular/common/http';
import { AuthentificationService } from '../auth/authentification.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private authService:AuthentificationService, private router: Router) { }


  getAuditLogs(): Observable<AuditLog[]> {
    const token = this.authService.getToken();
    if(!token){
      this.router.navigate(['/auth/login']);
    }
    const headers = {
      'Authorization': `Token ${token}`
    };
    return this.http.get<AuditLog[]>(`${this.apiUrl}/audit-logs/`, { headers: headers });
  }




}
