import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Clientes } from '../../../../interfaces/clientes';
import { Servicios } from '../../../../interfaces/servicios';
import { Usuarios } from '../../../../interfaces/usuarios';
import { ProyectosService } from '../../../../../services/main/proyectos.service';
import { Proyectos } from '../../../../interfaces/proyectos';

interface ProjectDetails {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  progreso: number;
  clientes: Clientes[];
  servicios: Servicios[];
  equipo: Usuarios[];
  tareas: { id: number; titulo: string; estado: string; progreso: number; subtareas: { id: number; titulo: string; estado: string }[] }[];
}

@Component({
  selector: 'app-detalles-proyecto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalles-proyecto.component.html',
  styleUrls: ['./detalles-proyecto.component.css']
})
export class DetallesProyectoComponent implements OnInit {
  @Input() proyecto!: Proyectos;
  @Output() ocultarDiv = new EventEmitter<boolean>();

  proyectoDetalle: ProjectDetails | null = null;
  loading: boolean = true;

  constructor(private proyectosService: ProyectosService) { }

  ngOnInit(): void {
    this.getProyectoDetalle(this.proyecto.id || 0);

  }

  getProyectoDetalle(id: number) {
    this.loading = true;
    this.proyectosService.getProyectoDetalle(id).subscribe({
      next: (data: ProjectDetails) => {
        this.proyectoDetalle = data;
        this.loading = false;
        console.log(this.proyectoDetalle);
      },
      error: (error) => {
        console.error('Error al obtener detalles del proyecto:', error);
        this.loading = false;
      }
    });
  }

  cerrarModal() {
    this.ocultarDiv.emit(true);
  }
}

