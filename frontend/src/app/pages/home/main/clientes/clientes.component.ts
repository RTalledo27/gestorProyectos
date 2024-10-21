import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Cliente {
  id: number;
  nombre: string;
  contacto: string;
  email: string;
  telefono: string;
  proyectosActivos: number;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {
  clientes: Cliente[] = [
    { id: 1, nombre: "Empresa ABC", contacto: "Juan Pérez", email: "juan@empresaabc.com", telefono: "123-456-7890", proyectosActivos: 2 },
    { id: 2, nombre: "Corporación XYZ", contacto: "María López", email: "maria@corpxyz.com", telefono: "098-765-4321", proyectosActivos: 1 },
    { id: 3, nombre: "Industrias 123", contacto: "Carlos Rodríguez", email: "carlos@industrias123.com", telefono: "456-789-0123", proyectosActivos: 3 },
    { id: 4, nombre: "Tech Solutions", contacto: "Ana Martínez", email: "ana@techsolutions.com", telefono: "789-012-3456", proyectosActivos: 0 },
    { id: 5, nombre: "Global Services", contacto: "Pedro Sánchez", email: "pedro@globalservices.com", telefono: "321-654-0987", proyectosActivos: 1 },
  ];
}
