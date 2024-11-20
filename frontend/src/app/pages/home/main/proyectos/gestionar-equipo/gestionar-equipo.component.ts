import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EquipoService } from '../../../../../services/main/equipo.service';
import { Proyectos } from '../../../../interfaces/proyectos';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Roles } from '../../../../interfaces/roles';

@Component({
  selector: 'app-gestionar-equipo',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './gestionar-equipo.component.html',
  styleUrl: './gestionar-equipo.component.css'
})
export class GestionarEquipoComponent {
  @Input() proyecto!: Proyectos;
  @Output() ocultarDiv = new EventEmitter<void>();

  miembrosEquipo: any[] = [];
  desarrolladoresDisponibles: any[] = [];
  roles: Roles[] = [];

  constructor(private equipoService: EquipoService) {}

  ngOnInit() {
    this.cargarMiembrosEquipo();
    this.cargarDesarrolladoresDisponibles();
  }

  cargarMiembrosEquipo() {
    this.equipoService.getMiembrosEquipo(this.proyecto.id || 0).subscribe(
      miembros => this.miembrosEquipo = miembros,
      error => console.error('Error loading team members:', error)
    );
  }

  cargarDesarrolladoresDisponibles() {
    this.equipoService.getDesarrolladoresDisponibles().subscribe(
      desarrolladores => this.desarrolladoresDisponibles = desarrolladores,
      error => console.error('Error loading available developers:', error)
    );
  }

  asignarDesarrollador(desarrolladorId: number, rol: string) {
    this.equipoService.asignarDesarrollador(this.proyecto.id || 0, desarrolladorId, rol).subscribe(
      () => {
        this.cargarMiembrosEquipo();
        this.cargarDesarrolladoresDisponibles();
      },
      error => console.error('Error assigning developer:', error)
    );
  }

  cambiarRol(miembroId: number, nuevoRol: string) {
    this.equipoService.cambiarRol(this.proyecto.id || 0, miembroId, nuevoRol).subscribe(
      () => this.cargarMiembrosEquipo(),
      error => console.error('Error changing role:', error)
    );
  }

  removerMiembro(miembroId: number) {
    this.equipoService.removerMiembro(this.proyecto.id || 0, miembroId).subscribe(
      () => {
        this.cargarMiembrosEquipo();
        this.cargarDesarrolladoresDisponibles();
      },
      error => console.error('Error removing member:', error)
    );
  }

  cerrar() {
    this.ocultarDiv.emit();
  }

}
