import { CommonModule } from '@angular/common';
import { Component,  } from '@angular/core';
@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyectos.component.html',
  styleUrl: './proyectos.component.css'
})

export class ProyectosComponent {

  proyectos: any[] = [
    { id: 1, nombre: "Proyecto A", cliente: "Cliente X", fechaInicio: "2023-01-15", fechaFin: "2023-07-15", progreso: 75, estado: "En progreso", tareasPendientes: 8 },
    { id: 2, nombre: "Proyecto B", cliente: "Cliente Y", fechaInicio: "2023-03-01", fechaFin: "2023-09-30", progreso: 50, estado: "En progreso", tareasPendientes: 12 },
    { id: 3, nombre: "Proyecto C", cliente: "Cliente Z", fechaInicio: "2023-05-01", fechaFin: "2023-11-30", progreso: 25, estado: "En progreso", tareasPendientes: 18 },
    { id: 4, nombre: "Proyecto D", cliente: "Cliente W", fechaInicio: "2023-02-15", fechaFin: "2023-06-30", progreso: 90, estado: "Casi terminado", tareasPendientes: 3 },
    { id: 5, nombre: "Proyecto E", cliente: "Cliente V", fechaInicio: "2023-04-01", fechaFin: "2023-10-31", progreso: 40, estado: "En progreso", tareasPendientes: 15 },
  ];
}
