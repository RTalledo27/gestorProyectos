import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TareasService } from '../../../../../services/main/tareas.service';
import { Tareas } from '../../../../interfaces/tareas';
import { Proyectos } from '../../../../interfaces/proyectos';
import { ProyectosService } from '../../../../../services/main/proyectos.service';

@Component({
  selector: 'app-editar-tarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-tarea.component.html',
  styleUrl: './editar-tarea.component.css'
})
export class EditarTareaComponent {

  @Input() tarea!: Tareas;
  @Output() ocultarDiv = new EventEmitter<void>();
  @Output() tareaActualizada = new EventEmitter<Tareas>();

  formEditTarea: FormGroup;
  proyectos: Proyectos[] = [];

  constructor(
    private fb: FormBuilder,
    private tareasService: TareasService,
    private proyectosService: ProyectosService
  ) {
    this.formEditTarea = this.fb.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fecha_vencimiento: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      prioridad: ['', [Validators.required]],
      proyecto_id: [null, [Validators.required]],
      proyecto: [null, []],
    });
  }

  ngOnInit(): void {
    this.cargarProyectos();
    if (this.tarea) {
      this.formEditTarea.patchValue({
        ...this.tarea,
        proyecto_id: this.tarea.proyecto?.id,
        proyecto: this.tarea.proyecto?.id
      });
    }
  }

  cargarProyectos() {
    this.proyectosService.getProyectos().subscribe({
      next: (data: Proyectos[]) => {
        this.proyectos = data;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }

  onSubmit() {
    if (this.formEditTarea.valid) {
      const tareaEditada = {
        ...this.formEditTarea.value,
        id: this.tarea.id
      };
      this.tareasService.editTarea(this.tarea.id, tareaEditada).subscribe({
        next: (tareaActualizada) => {
          this.tareaActualizada.emit(tareaActualizada);
          this.ocultarDiv.emit();
        },
        error: (error) => {
          console.error('Error updating task:', error);
        }
      });
    }
  }

  cerrarModal() {
    this.ocultarDiv.emit();
  }
hasError(controlName: string, errorName: string): boolean {
  return this.formEditTarea.get(controlName)?.hasError(errorName) ?? false;
}
}
