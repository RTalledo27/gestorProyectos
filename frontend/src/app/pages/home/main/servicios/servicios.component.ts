import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NuevoServicioComponent } from './nuevo-servicio/nuevo-servicio.component';
import { EditarServicioComponent } from './editar-servicio/editar-servicio.component';
import { Servicios } from '../../../interfaces/servicios';
import { ServiciosService } from '../../../../services/main/servicios.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, NuevoServicioComponent, EditarServicioComponent],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent {

  nuevoServicioVisible = false;
  editarServicioVisible = false;
  servicioEditar: Servicios[] = [];
  servicios: Servicios[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private serviciosService: ServiciosService) { }

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios() {
    this.serviciosService.getServicios().subscribe({
      next: (data: Servicios[]) => {
        this.servicios = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  get paginatedServicios(): Servicios[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.servicios.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.servicios.length / this.itemsPerPage);
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

  eliminarServicio(servicioId: number | undefined) {
    if (servicioId === undefined) {
      console.error('El ID del servicio es undefined');
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      this.serviciosService.deleteServicio(servicioId).subscribe({
        next: () => {
          console.log('Servicio eliminado');
          this.cargarServicios();
        },
        error: (error) => {
          console.error('Error al eliminar el servicio:', error);
        }
      });
    }
  }
}
