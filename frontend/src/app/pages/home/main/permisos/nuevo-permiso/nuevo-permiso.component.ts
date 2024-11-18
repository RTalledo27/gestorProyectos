import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Permisos } from '../../../../interfaces/permisos';  
import { PermisosService } from '../../../../../services/main/permisos.service'; 

@Component({
  selector: 'app-nuevo-permiso',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './nuevo-permiso.component.html',
  styleUrls: ['./nuevo-permiso.component.css'],
})
export class NuevoPermisoComponent {
  @Output() save = new EventEmitter<Permisos>();
  @Output() ocultarDiv = new EventEmitter<void>();

  nuevoPermisoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private permisosService: PermisosService
  ) {
    this.nuevoPermisoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.nuevoPermisoForm.valid) {
      const nuevoPermiso = this.nuevoPermisoForm.value;

      this.permisosService.createPermiso(nuevoPermiso).subscribe({
        next: (permisoCreado) => {
          this.save.emit(permisoCreado);
          this.ocultarDivNuevoPermiso();
        },
        error: (error) => {
          console.error('Error al crear el permiso:', error);
        },
      });
    }
  }

  ocultarDivNuevoPermiso() {
    this.ocultarDiv.emit();
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.nuevoPermisoForm.get(controlName)?.hasError(errorName) ?? false;
  }
}
