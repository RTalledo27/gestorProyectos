import { CommonModule } from '@angular/common';
import { Component,  } from '@angular/core';
import { NuevoProyectoComponent } from "./nuevo-proyecto/nuevo-proyecto.component";
import { EditarProyectoComponent } from "./editar-proyecto/editar-proyecto.component";
import { Proyectos } from '../../../interfaces/proyectos';
import { ProyectosService } from '../../../../services/main/proyectos.service';
import { FormsModule } from '@angular/forms';
import { GestionarEquipoComponent } from "./gestionar-equipo/gestionar-equipo.component";
@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule, NuevoProyectoComponent, EditarProyectoComponent, GestionarEquipoComponent],
  templateUrl: './proyectos.component.html',
  styleUrl: './proyectos.component.css'
})

export class ProyectosComponent {
  nuevoProyectoVisible = false;
  editarProyectoVisible = false;
  proyectoEditar: Proyectos[] = [];
  proyectos: Proyectos[] = [];
  filteredProyectos: Proyectos[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';
  sortColumn: keyof Proyectos = 'nombre';
  sortDirection: 'asc' | 'desc' = 'asc';
  estadoFilter: string = '';

  gestionarEquipoVisible = false;
  proyectoSeleccionado: Proyectos | null = null;

  constructor(private proyectosService: ProyectosService) {}

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.proyectosService.getProyectos().subscribe({
      next: (data: Proyectos[]) => {
        this.proyectos = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
      }
    });
  }

  applyFilters() {
    this.filteredProyectos = this.proyectos.filter(proyecto =>
      proyecto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.estadoFilter === '' || proyecto.estado === this.estadoFilter)
    );
    this.sortProyectos();
  }

  sortProyectos() {
    this.filteredProyectos.sort((a, b) => {
      const aValue = a[this.sortColumn] ?? '';
      const bValue = b[this.sortColumn] ?? '';
      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onSort(column: keyof Proyectos) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortProyectos();
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  get paginatedProyectos(): Proyectos[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredProyectos.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProyectos.length / this.itemsPerPage);
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

  openNuevoProyectoDiv() {
    this.nuevoProyectoVisible = true;
  }

  closeNuevoProyectoDiv() {
    this.nuevoProyectoVisible = false;
    this.cargarProyectos();
  }

  openEditarProyectoDiv(proyecto: Proyectos) {
    if (proyecto) {
      this.proyectoEditar = [proyecto];
      this.editarProyectoVisible = true;
    } else {
      this.proyectoEditar = [];
    }
  }

  closeEditarProyectoDiv() {
    this.editarProyectoVisible = false;
    this.cargarProyectos();
  }

  verDetallesProgreso(proyecto: Proyectos) {
    console.log('Ver detalles de progreso para:', proyecto.nombre);
  }

  deleteProyecto(proyecto: Proyectos) {
    if (confirm(`¿Estás seguro de que quieres eliminar el proyecto "${proyecto.nombre}"?`)) {
      this.proyectosService.deleteProyecto(proyecto.id || 0).subscribe({
        next: () => {
          this.cargarProyectos();
        },
        error: (error) => {
          console.error('Error al eliminar el proyecto:', error);
        }
      });
    }
  }

  gestionarEquipo(proyecto: Proyectos) {
    this.proyectoSeleccionado = proyecto;
    this.gestionarEquipoVisible = true;
  }

  closeGestionarEquipoDiv() {
    this.gestionarEquipoVisible = false;
    this.proyectoSeleccionado = null;
    this.cargarProyectos();
  }

}
