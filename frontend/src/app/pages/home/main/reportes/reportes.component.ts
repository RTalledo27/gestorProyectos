import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {
  reportes = [
    { titulo: "Progreso de Proyectos", descripcion: "Visión general del avance de todos los proyectos", icono: "fas fa-chart-bar" },
    { titulo: "Rendimiento del Equipo", descripcion: "Métricas de productividad y eficiencia", icono: "fas fa-users" },
    { titulo: "Distribución de Tareas", descripcion: "Análisis de la asignación de tareas por proyecto", icono: "fas fa-tasks" },
  ];
}
