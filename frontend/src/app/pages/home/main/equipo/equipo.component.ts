import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
interface Miembro {
  id: number;
  nombre: string;
  cargo: string;
  email: string;
  proyectos: number;
}
@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [NgFor],
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.css'
})
export class EquipoComponent {
  miembros: Miembro[] = [
    { id: 1, nombre: "Ana García", cargo: "Gerente de Proyectos", email: "ana.garcia@tjsoluciones.com", proyectos: 3 },
    { id: 2, nombre: "Carlos López", cargo: "Desarrollador Senior", email: "carlos.lopez@tjsoluciones.com", proyectos: 2 },
    { id: 3, nombre: "María Rodríguez", cargo: "Diseñadora UX/UI", email: "maria.rodriguez@tjsoluciones.com", proyectos: 4 },
    { id: 4, nombre: "Juan Pérez", cargo: "Analista de Datos", email: "juan.perez@tjsoluciones.com", proyectos: 1 },
    { id: 5, nombre: "Laura Martínez", cargo: "Desarrolladora Backend", email: "laura.martinez@tjsoluciones.com", proyectos: 3 },
    { id: 6, nombre: "Pedro Sánchez", cargo: "Tester QA", email: "pedro.sanchez@tjsoluciones.com", proyectos: 2 },
  ];
}
