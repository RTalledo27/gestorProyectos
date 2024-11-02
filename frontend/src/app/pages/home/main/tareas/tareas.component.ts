import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  tareas: Tareas[] = [
  ];

  nuevaTareaVisible = false;
  nuevaSubtareaVisible = false;
  editarTareaVisible = false;
  tareaSeleccionada: Tareas | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 5; //  Numero de items por pag





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
  openNuevaSubtareaDiv(){
    this.nuevaSubtareaVisible =true;
  }

  closeNuevaSubtareaDiv(){
    this.nuevaSubtareaVisible = false;
  }

  ///METODO PARA OCULTAR DIV DE EDITAR TAREA
  openEditarTareaDiv(){
    this.editarTareaVisible = true;
  }

  closeEditarTareaDiv(){
    this.editarTareaVisible = false;
  }




}
