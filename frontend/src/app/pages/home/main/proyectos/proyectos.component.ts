import { CommonModule } from '@angular/common';
import { Component,  } from '@angular/core';
import { NuevoProyectoComponent } from "./nuevo-proyecto/nuevo-proyecto.component";
import { EditarProyectoComponent } from "./editar-proyecto/editar-proyecto.component";
import { Proyectos } from '../../../interfaces/proyectos';
import { ProyectosService } from '../../../../services/main/proyectos.service';
@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, NuevoProyectoComponent, EditarProyectoComponent],
  templateUrl: './proyectos.component.html',
  styleUrl: './proyectos.component.css'
})

export class ProyectosComponent {

  nuevoProyectoVisible = false;
  editarProyectoVisible = false;
  proyectoEditar: Proyectos[]=[];
  proyectos: Proyectos[] = [

  ];

  constructor(private proyectosService: ProyectosService){

  }



  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.cargarProyectos();
    console.table(this.proyectos);
  }



  //METODO CARGAR TODOS LOS PROYECTOS:
  cargarProyectos(){
    this.proyectosService.getProyectos().subscribe( {
      next: (data: Proyectos[]) => {
        this.proyectos = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

 //METODO PARA OCULTAR Y MOSTRAR  DIV DE NUEVO PROYECTO
  openNuevoProyectoDiv(){
    this.nuevoProyectoVisible =true;
  }

  closeNuevoProyectoDiv(){
    this.nuevoProyectoVisible = false;
  }

  openEditarProyectoDiv(proyecto: Proyectos){
    if(proyecto){
    this.proyectoEditar = [proyecto];
    this.editarProyectoVisible = true;
    }else{
      this.proyectoEditar = [];
    }
  }

  closeEditarProyectoDiv(){
    this.editarProyectoVisible = false;
  }




}
