import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { EquipoService } from '../../../../services/main/equipo.service';
import { Usuarios } from '../../../interfaces/usuarios';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Proyectos } from '../../../interfaces/proyectos';
import { ProyectosService } from '../../../../services/main/proyectos.service';
import { PerfilComponent } from "./perfil/perfil.component";

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [NgFor, CommonModule, ReactiveFormsModule, FormsModule, PerfilComponent],
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.css'
})
export class EquipoComponent {
  desarrolladores: Usuarios[] = [];
  filteredDesarrolladores: Usuarios[] = [];
  searchTerm: string = '';
  sortColumn: keyof Usuarios = 'nombres';
  sortDirection: 'asc' | 'desc' = 'asc';
  especialidadFilter: string = '';

  constructor(private equipoService: EquipoService) {}

  ngOnInit(): void {
    this.cargarDesarrolladores();
    this.equipoService.equipoActualizado.subscribe(() => {
      this.cargarDesarrolladores();
    });
  }

  cargarDesarrolladores(): void {
    this.equipoService.getEquipoConProyectosActivos().subscribe({
      next: (data: Usuarios[]) => {
        this.desarrolladores = data.filter(usuario => usuario.cargo?.nombre.toLowerCase().includes('desarrollador'));
        this.applyFilters();
      },
      error: (error) => console.error('Error al cargar desarrolladores:', error)
    });
  }

  applyFilters(): void {
    this.filteredDesarrolladores = this.desarrolladores.filter(dev =>
      (dev.nombres.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       dev.apellidos.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       dev.email.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.especialidadFilter === '' || dev.cargo?.nombre === this.especialidadFilter)
    );
    this.sortDesarrolladores();
  }

  sortDesarrolladores(): void {
    this.filteredDesarrolladores.sort((a, b) => {
      const aValue = a[this.sortColumn] ?? '';
      const bValue = b[this.sortColumn] ?? '';

      if (typeof aValue === 'string' && typeof bValue === 'string'){
        if (aValue.toLowerCase() < bValue.toLowerCase()) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue.toLowerCase() > bValue.toLowerCase()) return this.sortDirection === 'asc' ? 1 : -1;
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

  verPerfilDesarrollador(id: number): void {
    // Implementar navegación al perfil del desarrollador
    console.log(`Navegar al perfil del desarrollador con ID: ${id}`);
  }

  //OBTENER EERRORES


}
