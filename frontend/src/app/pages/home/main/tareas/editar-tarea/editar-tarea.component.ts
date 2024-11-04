import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TareasService } from '../../../../../services/main/tareas.service';
import { Tareas } from '../../../../interfaces/tareas';

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
  @Output() save = new EventEmitter<Tareas>();
  formEditTarea:FormGroup;
  constructor(private fb: FormBuilder, private tareasService: TareasService) {
    this.formEditTarea = this.fb.group({
      titulo: ['', [ Validators.required]],
      descripcion: ['', [ Validators.required]],
      fecha_vencimiento: ['', [ Validators.required]],
      estado: ['', [ Validators.required]],
      prioridad: ['', [ Validators.required]],
      usuarios_asignados: [[],],
      subTareas: [[],]
    });
   }

  ngOnInit(): void {
    if(this.tarea){
      this.formEditTarea.patchValue(this.tarea);
    }
  }



  onSubmit() {

    if (this.formEditTarea.valid) {
      const nuevaTarea = this.formEditTarea.value;
      this.tareasService.editTarea(this.tarea, nuevaTarea).subscribe({
        next: (tareaEditada) => {
          this.save.emit(tareaEditada);
          this.ocultarDivEditarTarea();
          console.log('Tarea editada:', tareaEditada);
        },
        error: (error) => {
          console.error('Error al editar la tarea:', error);
        }
      });
  }
}



  ocultarDivEditarTarea() {
    this.ocultarDiv.emit();
  }
hasError(controlName: string, errorName: string): boolean {
  return this.formEditTarea.get(controlName)?.hasError(errorName) ?? false;
}
}
