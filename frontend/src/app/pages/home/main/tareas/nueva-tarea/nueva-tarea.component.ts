import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TareasService } from '../../../../../services/main/tareas.service';
import { ProyectosService } from '../../../../../services/main/proyectos.service';
import { Tareas } from '../../../../interfaces/tareas';
import { Proyectos } from '../../../../interfaces/proyectos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nueva-tarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nueva-tarea.component.html',
  styleUrls: ['./nueva-tarea.component.css']
})
export class NuevaTareaComponent implements OnInit {
  @Output() ocultarDiv = new EventEmitter<void>();
  @Output() tareaCreada = new EventEmitter<Tareas>();

  formNuevaTarea: FormGroup;
  proyectos: Proyectos[] = [];

  constructor(
    private fb: FormBuilder,
    private tareasService: TareasService,
    private proyectosService: ProyectosService
  ) {
    this.formNuevaTarea = this.fb.group({
      titulo: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fecha_vencimiento: ['', [Validators.required]],
      estado: ['Pendiente', [Validators.required]],
      prioridad: ['Media', [Validators.required]],
      proyecto_id: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.cargarProyectos();
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
    if (this.formNuevaTarea.valid) {
      const nuevaTarea = {
        ...this.formNuevaTarea.value,
        proyecto: this.formNuevaTarea.value.proyecto_id
      }
      this.tareasService.createTareas(nuevaTarea).subscribe({
        next: (tareaCreada) => {
          this.tareaCreada.emit(tareaCreada);
          this.ocultarDiv.emit();
        },
        error: (error) => {
          console.error('Error creating task:', error);
        }
      });
    }
  }

  cerrarModal() {
    this.ocultarDiv.emit();
  }
}
