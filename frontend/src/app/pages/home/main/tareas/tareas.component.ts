import { CommonModule } from '@angular/common';
import { Component, SimpleChanges } from '@angular/core';
import { Tareas } from '../../../interfaces/tareas';
import { TareasService } from '../../../../services/main/tareas.service';
import { EditarTareaComponent } from "./editar-tarea/editar-tarea.component";
import { NuevaSubtareaComponent } from "./nueva-subtarea/nueva-subtarea.component";
import { NuevaTareaComponent } from './nueva-tarea/nueva-tarea.component';



@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, EditarTareaComponent, NuevaSubtareaComponent,NuevaTareaComponent],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css',
})
export class TareasComponent {
  tareas: Tareas[] = [];

  tareaEditar: Tareas[]=[];
  eliminarTareaVisible = false;
  nuevaTareaVisible = false;
  nuevaSubtareaVisible = false;
  editarTareaVisible = false;
  tareaSeleccionada: any;

  currentPage: number = 1;
  itemsPerPage: number = 5; //  Numero de items por pag


  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log('ngOnChanges');
  }



  constructor(private tareasService:TareasService) {}



  ngOnInit(): void {

    this.cargarTareas();
    console.table(this.tareas);
  }

  cargarTareas(){
    this.tareasService.getTareas().subscribe({
      next: (data: Tareas[]) => {
        this.tareas = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }


  get paginatedTareas(): Tareas[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.tareas.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.tareas.length / this.itemsPerPage);
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


  ///METODO PARA OCULTAR DIV DE NUEVA TAREA
  openNuevaTareaDiv(){
    this.nuevaTareaVisible =true;
  }

  closeNuevaTareaDiv(){
    this.nuevaTareaVisible = false;
  }

  ///METODO PARA OCULTAR DIV DE NUEVA SUBTAREA
  openNuevaSubtareaDiv(event: Event,tarea: Tareas){
    event.stopPropagation();
    this.nuevaSubtareaVisible =true;
    if(tarea){
      this.tareaEditar = [tarea];
      this.nuevaSubtareaVisible = true;
      this.nuevaSubtareaVisible = true;
    }else{
      this.tareaEditar = [];
    }
  }

  closeNuevaSubtareaDiv(){
    this.nuevaSubtareaVisible = false;
  }

  ///METODO PARA OCULTAR DIV DE EDITAR TAREA
  openEditarTareaDiv(tarea: Tareas){
    if(tarea){
      this.tareaEditar = [tarea];
      this.editarTareaVisible = true;
    }else{
      this.tareaEditar = [];
    }
  }

  closeEditarTareaDiv(){
    this.editarTareaVisible = false;
  }

  ///METODO PARA ELIMINAR TAREA
  openEliminarTareaDiv(tarea: Tareas, event: Event){
    event.stopPropagation();
    this.tareaSeleccionada = tarea;
    this.eliminarTareaVisible = true;
  }

  closeEliminarTareaDiv(){
    this.eliminarTareaVisible = false;
  }


  eliminarTarea(){{
    this.tareasService.deletTarea(this.tareaSeleccionada).subscribe({
      next: (data: Tareas) => {
        this.eliminarTareaVisible = false;
        this.cargarTareas();
      },
      error: (error) => {
        console.log(error);
      }
    });
    }
  }




}
