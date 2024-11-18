import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NuevoPermisoComponent } from './nuevo-permiso/nuevo-permiso.component';
import { EditarPermisoComponent } from './editar-permiso/editar-permiso.component';
import { Permisos } from '../../../interfaces/permisos';
import { PermisosService } from '../../../../services/main/permisos.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [CommonModule, FormsModule, NuevoPermisoComponent, EditarPermisoComponent],
  templateUrl: './permisos.component.html',
  styleUrls: ['./permisos.component.css'],
})
export class PermisosComponent {
  nuevoPermisoVisible = false;
  editarPermisoVisible = false;
  eliminarPermisoVisible = false;
  permisoEditar: Permisos[] = [];
  permisos: Permisos[] = [];
  filteredPermisos: Permisos[] = [];
  permisoAEliminar: Permisos | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchTerm: string = '';
  estadoFilter: string = '';

  constructor(private permisosService: PermisosService) {}

  ngOnInit(): void {
    this.cargarPermisos();
  }

  cargarPermisos() {
    this.permisosService.getPermisos().subscribe({
      next: (data: Permisos[]) => {
        this.permisos = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error al cargar permisos:', error);
      },
    });
  }

  applyFilters() {
    this.filteredPermisos = this.permisos.filter(permiso =>
      permiso.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.estadoFilter === '' || permiso.estado === this.estadoFilter)
    );
  }

  onSearch() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  get paginatedPermisos(): Permisos[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPermisos.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPermisos.length / this.itemsPerPage);
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

  openNuevoPermisoDiv() {
    this.nuevoPermisoVisible = true;
  }

  closeNuevoPermisoDiv() {
    this.nuevoPermisoVisible = false;
    this.cargarPermisos();
  }

  openEditarPermisoDiv(permiso: Permisos) {
    if (permiso) {
      this.permisoEditar = [permiso];
      this.editarPermisoVisible = true;
    } else {
      this.permisoEditar = [];
    }
  }

  closeEditarPermisoDiv() {
    this.editarPermisoVisible = false;
    this.cargarPermisos();
  }

  openEliminarPermisoConfirm(permiso: Permisos) {
    this.permisoAEliminar = permiso;
    this.eliminarPermisoVisible = true;
  }

  closeEliminarPermisoConfirm() {
    this.eliminarPermisoVisible = false;
    this.permisoAEliminar = null;
  }

  confirmarEliminarPermiso() {
    if (this.permisoAEliminar && this.permisoAEliminar.id !== undefined) {
      this.permisosService.deletePermiso(this.permisoAEliminar.id).subscribe({
        next: () => {
          console.log('Permiso eliminado');
          this.cargarPermisos();
          this.closeEliminarPermisoConfirm();
        },
        error: (error) => {
          console.error('Error al eliminar el permiso:', error);
        },
      });
    }
  }
}
