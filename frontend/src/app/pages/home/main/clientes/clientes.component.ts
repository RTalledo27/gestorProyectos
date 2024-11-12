import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NuevoClienteComponent } from './nuevo-cliente/nuevo-cliente.component';
import { EditarClienteComponent } from './editar-cliente/editar-cliente.component';
import { Clientes } from '../../../interfaces/clientes';
import { ClientesService } from '../../../../services/main/clientes.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, NuevoClienteComponent, EditarClienteComponent],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent {
  nuevoClienteVisible = false;
  editarClienteVisible = false;
  eliminarClienteVisible = false; // Nueva variable para el modal de eliminación
  clienteEditar: Clientes[] = [];
  clientes: Clientes[] = [];
  clienteAEliminar: Clientes | null = null; // Variable para almacenar el cliente a eliminar

  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private clientesService: ClientesService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clientesService.getClientes().subscribe({
      next: (data: Clientes[]) => {
        this.clientes = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  get paginatedClientes(): Clientes[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.clientes.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.clientes.length / this.itemsPerPage);
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
