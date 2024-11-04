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
  @Output() close = new EventEmitter<void>();
  @Output() subtareaCreated = new EventEmitter<any>();
  @Output() subtareaUpdated = new EventEmitter<any>();

  subtareaForm: FormGroup;
  subtareas: any[] = [];
  @Input() tarea: Tareas[] = [];

  constructor(
    private fb: FormBuilder,
    private tareasService: TareasService
  ) {
    this.subtareaForm = this.fb.group({
      titulo: ['', Validators.required],
      estado: [false]
    });
  }

  ngOnInit() {
    this.loadSubtareas();
  }

  loadSubtareas() {
    this.tareasService.getSubtareasByTarea(this.tarea[0].id).subscribe({
      next: (data) => {
        this.subtareas = data;
      },
      error: (error) => {
        console.error('Error loading subtareas:', error);
      }
    });
  }

  onSubmit() {


  }

  toggleSubtareaEstado(subtarea: any) {
    const updatedSubtarea = {
      ...subtarea,
      estado: !subtarea.estado
    };

    this.tareasService.updateSubtarea(subtarea.id, updatedSubtarea).subscribe({
      next: (updated) => {
        const index = this.subtareas.findIndex(s => s.id === updated.id);
        if (index !== -1) {
          this.subtareas[index] = updated;
        }
        this.subtareaUpdated.emit(updated);
      },
      error: (error) => {
        console.error('Error updating subtarea:', error);
      }
    });
  }

  deleteSubtarea(subtarea: any) {
    this.tareasService.deleteSubtarea(subtarea.id).subscribe({
      next: () => {
        this.subtareas = this.subtareas.filter(s => s.id !== subtarea.id);
      },
      error: (error) => {
        console.error('Error deleting subtarea:', error);
      }
    });
  }

  onCancel() {
    this.close.emit();
  }
}
