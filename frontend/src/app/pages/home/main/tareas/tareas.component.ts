import { CommonModule } from '@angular/common';
import { Component, model, SimpleChanges } from '@angular/core';
import { Tareas } from '../../../interfaces/tareas';
import { TareasService } from '../../../../services/main/tareas.service';
import { EditarTareaComponent } from './editar-tarea/editar-tarea.component';
import { NuevaSubtareaComponent } from './nueva-subtarea/nueva-subtarea.component';
import { NuevaTareaComponent } from './nueva-tarea/nueva-tarea.component';
import {
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [
    CommonModule,
    EditarTareaComponent,
    NuevaSubtareaComponent,
    NuevaTareaComponent,
    FormsModule,
  ],
  templateUrl: './tareas.component.html',
  styleUrl: './tareas.component.css',
})
export class TareasComponent {
  tareas: Tareas[] = [];
  filteredTareas: Tareas[] = [];
  selectedProyecto: string = '';
  searchTerm: string = '';
  priorityFilter: string = '';
  statusFilter: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;

  nuevaTareaVisible = false;
  editarTareaVisible = false;
  nuevaSubtareaVisible = false;
  eliminarTareaVisible = false;
  tareaEditar: Tareas[] = [];
  tareaSeleccionada: Tareas | null = null;

  constructor(private tareasService: TareasService) {}

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas() {
    this.tareasService.getTareas().subscribe({
      next: (data: Tareas[]) => {
        this.tareas = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      },
    });
  }

  applyFilters() {
    this.filteredTareas = this.tareas.filter(
      (tarea) =>
        (!this.selectedProyecto ||
          tarea.proyecto?.nombre === this.selectedProyecto) &&
        (!this.searchTerm ||
          tarea.titulo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          tarea.descripcion
            ?.toLowerCase()
            .includes(this.searchTerm.toLowerCase())) &&
        (!this.priorityFilter || tarea.prioridad === this.priorityFilter) &&
        (!this.statusFilter || tarea.estado === this.statusFilter)
    );
    this.currentPage = 1;
  }

  onSearchChange() {
    this.applyFilters();
  }

  onPriorityFilterChange() {
    this.applyFilters();
  }

  onStatusFilterChange() {
    this.applyFilters();
  }

  onProyectoChange() {
    this.applyFilters();
  }

  updateTaskPriority(task: Tareas, newPriority: string) {
    this.tareasService.updateTaskPriority(task.id, newPriority).subscribe({
      next: (updatedTask) => {
        const index = this.tareas.findIndex((t) => t.id === updatedTask.id);
        if (index !== -1) {
          this.tareas[index] = updatedTask;
          this.applyFilters();
        }
      },
      error: (error) => console.error('Error updating task priority:', error),
    });
  }

  updateTaskStatus(task: Tareas, newStatus: string) {
    this.tareasService.updateTaskStatus(task.id, newStatus).subscribe({
      next: (updatedTask) => {
        const index = this.tareas.findIndex((t) => t.id === updatedTask.id);
        if (index !== -1) {
          this.tareas[index] = updatedTask;
          this.applyFilters();
        }
      },
      error: (error) => console.error('Error updating task status:', error),
    });
  }

  get paginatedTareas(): Tareas[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredTareas.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTareas.length / this.itemsPerPage);
  }

  get uniqueProjectNames(): string[] {
    return Array.from(
      new Set(
        this.tareas
          .map((t) => t.proyecto?.nombre)
          .filter((nombre): nombre is string => Boolean(nombre))
      )
    );
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

  openNuevaTareaDiv() {
    this.nuevaTareaVisible = true;
  }

  closeNuevaTareaDiv() {
    this.nuevaTareaVisible = false;
  }

  openNuevaSubtareaDiv(event: Event, tarea: Tareas) {
    event.stopPropagation();
    this.nuevaSubtareaVisible = true;
    if (tarea) {
      this.tareaEditar = [tarea];
    } else {
      this.tareaEditar = [];
    }
  }

  closeNuevaSubtareaDiv() {
    this.nuevaSubtareaVisible = false;
  }

  openEditarTareaDiv(tarea: Tareas) {
    if (tarea) {
      this.tareaEditar = [tarea];
      this.editarTareaVisible = true;
    } else {
      this.tareaEditar = [];
    }
  }

  closeEditarTareaDiv() {
    this.editarTareaVisible = false;
  }

  openEliminarTareaDiv(tarea: Tareas, event: Event) {
    event.stopPropagation();
    this.tareaSeleccionada = tarea;
    this.eliminarTareaVisible = true;
  }

  closeEliminarTareaDiv() {
    this.eliminarTareaVisible = false;
  }

  eliminarTarea() {
    if (this.tareaSeleccionada) {
      this.tareasService.deletTarea(this.tareaSeleccionada.id).subscribe({
        next: () => {
          this.eliminarTareaVisible = false;
          this.cargarTareas();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        },
      });
    }
  }
}
