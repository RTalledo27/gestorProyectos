import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
})
export class ProyectosComponent {
  proyectos: any[] = [
    {
      id: 1,
      nombre: 'Proyecto A',
      cliente: 'Cliente X',
      fechaInicio: '2023-01-15',
      fechaFin: '2023-07-15',
      progreso: 75,
      estado: 'En progreso',
      tareasPendientes: 8,
    },
    {
      id: 2,
      nombre: 'Proyecto B',
      cliente: 'Cliente Y',
      fechaInicio: '2023-03-01',
      fechaFin: '2023-09-30',
      progreso: 50,
      estado: 'En progreso',
      tareasPendientes: 12,
    },
    {
      id: 3,
      nombre: 'Proyecto C',
      cliente: 'Cliente Z',
      fechaInicio: '2023-05-01',
      fechaFin: '2023-11-30',
      progreso: 25,
      estado: 'En progreso',
      tareasPendientes: 18,
    },
    {
      id: 4,
      nombre: 'Proyecto D',
      cliente: 'Cliente W',
      fechaInicio: '2023-02-15',
      fechaFin: '2023-06-30',
      progreso: 90,
      estado: 'Casi terminado',
      tareasPendientes: 3,
    },
    {
      id: 5,
      nombre: 'Proyecto E',
      cliente: 'Cliente V',
      fechaInicio: '2023-04-01',
      fechaFin: '2023-10-31',
      progreso: 40,
      estado: 'En progreso',
      tareasPendientes: 15,
    },
  ];

  currentPage: number = 1;
  itemsPerPage: number = 5; // numero de items por página

  get paginatedProyectos(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.proyectos.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.proyectos.length / this.itemsPerPage);
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
