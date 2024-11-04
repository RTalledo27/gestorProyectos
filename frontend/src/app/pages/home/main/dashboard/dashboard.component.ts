import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { DashboardService } from '../../../../services/main/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  dashboardData: any = {
    proyectos_activos: 0,
    proyectos_nuevos: 0,
    tareas_pendientes: 0,
    tareas_alta_prioridad: 0,
    miembros_equipo: 0,
    miembros_nuevos: 0,
    reportes_semana: 0,
    proyectos_progreso: [],
    tareas_recientes: []
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
      }
    });
  }
}
