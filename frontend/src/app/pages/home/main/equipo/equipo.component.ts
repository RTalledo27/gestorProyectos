import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EquipoService } from '../../../../services/main/equipo.service';
import { ProyectosService } from '../../../../services/main/proyectos.service';
import { Usuarios } from '../../../interfaces/usuarios';
import { Proyectos } from '../../../interfaces/proyectos';
import { Cargos } from '../../../interfaces/cargos';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {
  desarrolladores: Usuarios[] = [];
  filteredDesarrolladores: Usuarios[] = [];
  proyectos: Proyectos[] = [];
  cargos: Cargos[] = [];
  searchTerm: string = '';
  especialidadFilter: string = '';
  proyectoFilter: string = '';
  sortColumn: keyof Usuarios = 'nombres';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private equipoService: EquipoService,
    private proyectoService: ProyectosService
  ) {}

  ngOnInit(): void {
    this.cargarDesarrolladores();
    this.cargarCargos();
    this.cargarProyectos();
    this.equipoService.equipoActualizado.subscribe(() => {
      this.cargarDesarrolladores();
    });
  }

  cargarDesarrolladores(): void {
    this.equipoService.getEquipoConProyectosActivos().subscribe({
      next: (data: Usuarios[]) => {
        this.desarrolladores = data;
        this.applyFilters();
      },
      error: (error) => console.error('Error al cargar desarrolladores:', error)
    });
  }

  cargarCargos(): void {
    this.equipoService.getCargos().subscribe({
      next: (data: Cargos[]) => {
        this.cargos = data;
      },
      error: (error) => console.error('Error al cargar cargos:', error)
    });
  }

  cargarProyectos(): void {
    this.proyectoService.getProyectos().subscribe({
      next: (data: Proyectos[]) => {
        this.proyectos = data;
      },
      error: (error) => console.error('Error al cargar proyectos:', error)
    });
  }

  applyFilters(): void {
    this.filteredDesarrolladores = this.desarrolladores.filter(dev =>
      (dev.nombres?.toLowerCase().includes(this.searchTerm?.toLowerCase()) ||
       dev.apellidos?.toLowerCase().includes(this.searchTerm?.toLowerCase()) ||
       dev.email?.toLowerCase().includes(this.searchTerm?.toLowerCase())) &&
      (this.especialidadFilter === '' || dev.cargo?.nombre === this.especialidadFilter) &&
      (this.proyectoFilter === '' || dev.proyectos?.some(p => p.id?.toString() === this.proyectoFilter))
    );
    this.sortDesarrolladores();
  }

  sortDesarrolladores(): void {
    this.filteredDesarrolladores.sort((a, b) => {
      const aValue = a[this.sortColumn] ?? '';
      const bValue = b[this.sortColumn] ?? '';

      if (typeof aValue === 'string' && typeof bValue === 'string'){
        if (aValue?.toLowerCase() < bValue?.toLowerCase()) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue?.toLowerCase() > bValue?.toLowerCase()) return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  onSort(column: keyof Usuarios): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortDesarrolladores();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  calculateWorkload(desarrollador: Usuarios): string {
    const projectCount = desarrollador.proyectos?.length || 0;
    if (projectCount === 0) return 'Baja';
    if (projectCount === 1) return 'Media';
    return 'Alta';
  }
}

