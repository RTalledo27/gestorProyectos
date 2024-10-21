import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  proyectos: number;
}
@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  servicios: Servicio[] = [
    { id: 1, nombre: "Desarrollo Web", descripcion: "Creación de sitios web y aplicaciones web personalizadas", icono: "fas fa-code", proyectos: 5 },
    { id: 2, nombre: "Diseño UX/UI", descripcion: "Diseño de interfaces de usuario intuitivas y atractivas", icono: "fas fa-paint-brush", proyectos: 3 },
    { id: 3, nombre: "Desarrollo de Backend", descripcion: "Implementación de lógica de servidor y APIs", icono: "fas fa-server", proyectos: 4 },
    { id: 4, nombre: "Bases de Datos", descripcion: "Diseño y optimización de bases de datos", icono: "fas fa-database", proyectos: 2 },
    { id: 5, nombre: "Cloud Computing", descripcion: "Soluciones en la nube y servicios de hosting", icono: "fas fa-cloud", proyectos: 3 },
    { id: 6, nombre: "Ciberseguridad", descripcion: "Protección de sistemas y datos contra amenazas", icono: "fas fa-shield-alt", proyectos: 1 },
  ];
}
