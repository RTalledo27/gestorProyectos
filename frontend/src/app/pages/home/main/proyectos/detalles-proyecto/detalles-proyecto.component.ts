import { Component, EventEmitter, Input, input, Output } from '@angular/core';
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
  imports: [],
  templateUrl: './detalles-proyecto.component.html',
  styleUrl: './detalles-proyecto.component.css'
})
export class DetallesProyectoComponent {


  constructor(private proyectosService: ProyectosService) { }

  proyectoDetalle: ProjectDetails[]=[];
  @Output() ocultarDiv = new EventEmitter<boolean>();
  @Input() proyecto!: Proyectos;



  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getProyectoDetalle(this.proyecto.id||0);
  }


  getProyectoDetalle(id: number) {
    this.proyectosService.getProyectoDetalle(id).subscribe({
      next: (data: any) => {
        this.proyectoDetalle = data;
      },
      error: (error) => {
        console.error('Error al obtener detalles del proyecto:', error);
      }
    });
  }



}
