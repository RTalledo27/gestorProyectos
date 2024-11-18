import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { Permisos } from '../../../../interfaces/permisos';  // Asegúrate de tener esta interfaz
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PermisosService } from '../../../../../services/main/permisos.service';  // Servicio de permisos

@Component({
  selector: 'app-editar-permiso',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editar-permiso.component.html',
  styleUrls: ['./editar-permiso.component.css'],
})
export class EditarPermisoComponent implements OnInit, OnChanges {
  @Input() permiso!: Permisos;
  @Output() ocultarDiv = new EventEmitter<void>();
  @Output() save = new EventEmitter<Permisos>();

  formEditPermiso: FormGroup;

  constructor(
    private fb: FormBuilder,
    private permisosService: PermisosService 
  ) {
    this.formEditPermiso = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    if (this.permiso) {
      this.formEditPermiso.patchValue(this.permiso);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['permiso'] && this.permiso) {
      this.formEditPermiso.patchValue(this.permiso);
    }
  }

  ocultarDivEditarPermiso() {
    this.ocultarDiv.emit();
  }

  onEditPermiso() {
    if (this.formEditPermiso.valid && this.permiso.id !== undefined) {
      this.permisosService
        .editPermiso(this.permiso.id, this.formEditPermiso.value) 
        .subscribe(
          (permisoEditado: Permisos) => {
            console.log('Permiso editado:', permisoEditado);
            this.save.emit(permisoEditado); 
            this.formEditPermiso.reset();
            this.ocultarDivEditarPermiso();
          },
          (error) => {
            console.log('Error al editar el permiso:', error);
          }
        );
    } else {
      console.log('Formulario no válido o ID del permiso es undefined');
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.formEditPermiso.get(controlName)?.hasError(errorName) ?? false;
  }
}
