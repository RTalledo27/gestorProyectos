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
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {

  nuevoClienteVisible = false;
  editarClienteVisible = false;
  clienteEditar: Clientes[] = [];
  clientes: Clientes[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private clientesService: ClientesService) { }

  ngOnInit(): void {
    // Llamado después del constructor, inicializa las propiedades de entrada y la primera llamada a ngOnChanges.
    this.cargarClientes();
    console.table(this.clientes);
  }

  // Método para cargar todos los clientes
  cargarClientes() {
    this.clientesService.getClientes().subscribe({
      next: (data: Clientes[]) => {
        this.clientes = data;
      },
      error: (error) => {
        console.log(error);
      }
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

  // Método para mostrar y ocultar el div de Nuevo Cliente
  openNuevoClienteDiv() {
    this.nuevoClienteVisible = true;
  }

  closeNuevoClienteDiv() {
    this.nuevoClienteVisible = false;
  }

  // Método para mostrar y ocultar el div de Editar Cliente
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
  }
}
