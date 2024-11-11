import { CommonModule } from '@angular/common';
import { TareasService } from './../../../../../services/main/tareas.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Tareas } from '../../../../interfaces/tareas';

@Component({
  selector: 'app-nueva-subtarea',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './nueva-subtarea.component.html',
  styleUrl: './nueva-subtarea.component.css'
})
export class NuevaSubtareaComponent {
  @Input() tarea!: Tareas[];
  @Output() close = new EventEmitter<void>();
  @Output() subtareaCreada = new EventEmitter<Tareas>();

  formNuevaSubtarea: FormGroup;

  constructor(
    private fb: FormBuilder,
    private tareasService: TareasService
  ) {
    this.formNuevaSubtarea = this.fb.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fecha_vencimiento: ['', [Validators.required]],
      estado: ['Pendiente', [Validators.required]],
      prioridad: ['Media', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.formNuevaSubtarea.valid && this.tarea.length > 0) {
      const nuevaSubtarea = {
        ...this.formNuevaSubtarea.value,
        tarea_padre_id: this.tarea[0].id
      };
      this.tareasService.createTareas(nuevaSubtarea).subscribe({
        next: (subtareaCreada) => {
          this.subtareaCreada.emit(subtareaCreada);
          this.close.emit();
        },
        error: (error) => {
          console.error('Error creating subtask:', error);
        }
      });
    }
  }

  cerrarModal() {
    this.close.emit();
  }
}
