import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NuevoClienteComponent } from './nuevo-cliente/nuevo-cliente.component';
import { EditarClienteComponent } from './editar-cliente/editar-cliente.component';
import { Clientes } from '../../../interfaces/clientes';
import { ClientesService } from '../../../../services/main/clientes.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, NuevoClienteComponent, EditarClienteComponent],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent {
  nuevoClienteVisible = false;
  editarClienteVisible = false;
  eliminarClienteVisible = false;
  clienteEditar: Clientes[] = [];
  clientes: Clientes[] = [];
  filteredClientes: Clientes[] = [];
  clienteAEliminar: Clientes | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';
  estadoFilter: string = '';

  constructor(private clientesService: ClientesService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clientesService.getClientes().subscribe({
      next: (data: Clientes[]) => {
        this.clientes = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
      },
    });
  }

  applyFilters() {
    this.filteredClientes = this.clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (this.estadoFilter === '' || cliente.estado === this.estadoFilter)
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

  get paginatedClientes(): Clientes[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredClientes.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredClientes.length / this.itemsPerPage);
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

  openNuevoClienteDiv() {
    this.nuevoClienteVisible = true;
  }

  closeNuevoClienteDiv() {
    this.nuevoClienteVisible = false;
    this.cargarClientes();
  }

  openEditarClienteDiv(cliente: Clientes) {
    if (cliente) {
      this.clienteEditar = [cliente];
      this.editarClienteVisible = true;
    } else {
      this.clienteEditar = [];
    }
  }

  closeEditarClienteDiv() {
    this.editarClienteVisible = false;
    this.cargarClientes();
  }

  openEliminarClienteConfirm(cliente: Clientes) {
    this.clienteAEliminar = cliente;
    this.eliminarClienteVisible = true;
  }

  closeEliminarClienteConfirm() {
    this.eliminarClienteVisible = false;
    this.clienteAEliminar = null;
  }

  confirmarEliminarCliente() {
    if (this.clienteAEliminar && this.clienteAEliminar.id !== undefined) {
      this.clientesService.deleteCliente(this.clienteAEliminar.id).subscribe({
        next: () => {
          console.log('Cliente eliminado');
          this.cargarClientes();
          this.closeEliminarClienteConfirm();
        },
        error: (error) => {
          console.error('Error al eliminar el cliente:', error);
        },
      });
    }
  }
}
