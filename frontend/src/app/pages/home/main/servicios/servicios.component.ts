import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NuevoServicioComponent } from './nuevo-servicio/nuevo-servicio.component';
import { EditarServicioComponent } from './editar-servicio/editar-servicio.component';
import { Servicios } from '../../../interfaces/servicios';
import { ServiciosService } from '../../../../services/main/servicios.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule,FormsModule, NuevoServicioComponent, EditarServicioComponent],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent {

  nuevoServicioVisible = false;
  editarServicioVisible = false;
  eliminarServicioVisible = false; 
  servicioEditar: Servicios[] = [];
  servicios: Servicios[] = [];
  filteredServicios: Servicios[] = [];
  servicioAEliminar: Servicios | null = null; 

  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchTerm: string = '';
  estadoFilter: string = '';

  constructor(private serviciosService: ServiciosService) { }

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios() {
    this.serviciosService.getServicios().subscribe({
      next: (data: Servicios[]) => {
        this.servicios = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
      }
    });
  }

  applyFilters() {
    this.filteredServicios = this.servicios.filter(servicio =>
      servicio.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.estadoFilter === '' || servicio.estado === this.estadoFilter)
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

  get paginatedServicios(): Servicios[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredServicios.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredServicios.length / this.itemsPerPage);
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

  openNuevoServicioDiv() {
    this.nuevoServicioVisible = true;
  }

  closeNuevoServicioDiv() {
    this.nuevoServicioVisible = false;
    this.cargarServicios();
  }

  openEditarServicioDiv(servicio: Servicios) {
    if (servicio) {
      this.servicioEditar = [servicio];
      this.editarServicioVisible = true;
    } else {
      this.servicioEditar = [];
    }
  }

  closeEditarServicioDiv() {
    this.editarServicioVisible = false;
    this.cargarServicios();
  }

  openEliminarServicioConfirm(servicio: Servicios) {
    this.servicioAEliminar = servicio;
    this.eliminarServicioVisible = true;
  }

  closeEliminarServicioConfirm() {
    this.eliminarServicioVisible = false;
    this.servicioAEliminar = null;
  }

  confirmarEliminarServicio() {
    if (this.servicioAEliminar && this.servicioAEliminar.id !== undefined) {
      this.serviciosService.deleteServicio(this.servicioAEliminar.id).subscribe({
        next: () => {
          console.log('Servicio eliminado');
          this.cargarServicios();
          this.closeEliminarServicioConfirm(); 
        },
        error: (error) => {
          console.error('Error al eliminar el servicio:', error);
        }
      });
    }
  }
}
