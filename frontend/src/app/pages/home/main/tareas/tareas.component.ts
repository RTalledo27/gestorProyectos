import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Tarea {
  id: number;
  descripcion: string;
  proyecto: string;
  asignado: string;
  vencimiento: string;
  estado: string;
}

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css',
})
export class TareasComponent {
  tareas: Tarea[] = [
    {
      id: 1,
      descripcion: 'Diseño de interfaz',
      proyecto: 'Proyecto A',
      asignado: 'Ana García',
      vencimiento: '2023-06-30',
      estado: 'Completado',
    },
    {
      id: 2,
      descripcion: 'Desarrollo de API',
      proyecto: 'Proyecto B',
      asignado: 'Carlos López',
      vencimiento: '2023-07-15',
      estado: 'En progreso',
    },
    {
      id: 3,
      descripcion: 'Pruebas de integración',
      proyecto: 'Proyecto C',
      asignado: 'María Rodríguez',
      vencimiento: '2023-07-05',
      estado: 'Atrasado',
    },
    {
      id: 4,
      descripcion: 'Documentación',
      proyecto: 'Proyecto A',
      asignado: 'Juan Pérez',
      vencimiento: '2023-07-20',
      estado: 'Pendiente',
    },
    {
      id: 5,
      descripcion: 'Despliegue',
      proyecto: 'Proyecto D',
      asignado: 'Laura Martínez',
      vencimiento: '2023-07-10',
      estado: 'En progreso',
    },
  ];

  currentPage: number = 1;
  itemsPerPage: number = 5; //  Numero de items por pag

  get paginatedTareas(): Tarea[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.tareas.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.tareas.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
