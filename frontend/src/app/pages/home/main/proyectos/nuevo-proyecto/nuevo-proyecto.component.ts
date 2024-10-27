import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Servicios } from '../../../../interfaces/servicios';
import { Clientes } from '../../../../interfaces/clientes';
import { Proyectos } from '../../../../interfaces/proyectos';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nuevo-proyecto',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './nuevo-proyecto.component.html',
  styleUrl: './nuevo-proyecto.component.css'
})
export class NuevoProyectoComponent {

servicios: Servicios[] = [];
 clientes: Clientes[] = [];
  @Output() save = new EventEmitter<Proyectos>();
  //EMITER PARA EMITER EL EVENTO DE OCULTAR DIV
  @Output() ocultarDiv = new EventEmitter<void>();

  nuevoProyecto= {
    id: 0,
    nombre: '',
    descripcion: '',
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    estado: 'En Progreso',
    progreso: 0,
    creado_en: new Date(),
    actualizado_en: new Date(),
    servicios: [],
    clientes: []
  };

  onSubmit() {

  }

  //METODO PARA OCULTAR DIV DE NUEVO PROYECTO
  ocultarDivEditarProyecto() {
    this.ocultarDiv.emit();
  }

  onAddServicio() {

    console.log('Añadir nuevo servicio');
  }

  onAddCliente() {

    console.log('Añadir nuevo cliente');
  }

}
