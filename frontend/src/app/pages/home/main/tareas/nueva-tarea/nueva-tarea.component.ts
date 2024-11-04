import { Proyectos } from './../../../../interfaces/proyectos';
import { Component, EventEmitter, Output } from '@angular/core';
import { Tareas } from '../../../../interfaces/tareas';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TareasService } from '../../../../../services/main/tareas.service';
import { ProyectosService } from '../../../../../services/main/proyectos.service';

@Component({
  selector: 'app-nueva-tarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nueva-tarea.component.html',
  styleUrl: './nueva-tarea.component.css'
})
export class NuevaTareaComponent {

  @Output() save = new EventEmitter<Tareas>();
  @Output() ocultarDiv = new EventEmitter<void>();
  nuevaTareaForm: FormGroup;
  tareas: Tareas[] = [];
  proyectos: Proyectos[] = [];


  constructor(private tareasService: TareasService, private fb: FormBuilder, private proyectosService: ProyectosService) {

    this.nuevaTareaForm = this.fb.group({
       proyecto: [null, [Validators.required]],  // Use `null` for a single selection
  titulo: ['', [Validators.required]],
  descripcion: ['', [Validators.required]],
  estado: ['', [Validators.required]],
  prioridad: ['', [Validators.required]],
  fecha_vencimiento: ['', [Validators.required]]
  //usuarios_asignados: [[], [Validators.required]],
  //subTareas: [[], [Validators.required]]

    });

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.cargarProyectos()

  }

  onSubmit() {
    if (this.nuevaTareaForm.valid) {
      const nuevaTarea = {
        ...this.nuevaTareaForm.value,
        proyecto_id: this.nuevaTareaForm.value.proyecto  // Directly use `proyecto` as the ID
      };

      this.tareasService.createTareas(nuevaTarea).subscribe({
        next: (tareaCreada) => {
          this.ocultarDivEditarTarea();
        },
        error: (error) => {
          console.error('Error al crear la tarea:', error);
        }
      });
    }
  }


  cargarProyectos(){
    this.proyectosService.getProyectos().subscribe({
      next: (data: Proyectos[]) => {
        this.proyectos = data;
      },
      error: (error) => {
        console.log(error);
      }
    });

  }

  ocultarDivEditarTarea() {
    this.ocultarDiv.emit();
  }


  onCancel(): void {
    this.ocultarDiv.emit();
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.nuevaTareaForm.get(controlName)?.hasError(errorName) ?? false;
  }

}
