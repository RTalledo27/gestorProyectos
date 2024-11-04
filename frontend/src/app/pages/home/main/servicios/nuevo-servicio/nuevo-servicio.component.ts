import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Servicios } from '../../../../interfaces/servicios';
import { ServiciosService } from '../../../../../services/main/servicios.service';

@Component({
  selector: 'app-nuevo-servicio',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './nuevo-servicio.component.html',
  styleUrls: ['./nuevo-servicio.component.css'],
})
export class NuevoServicioComponent {
  @Output() save = new EventEmitter<Servicios>();
  @Output() ocultarDiv = new EventEmitter<void>();

  nuevoServicioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private serviciosService: ServiciosService
  ) {
    this.nuevoServicioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      precio: [0, [Validators.required, Validators.min(0)]],
      estado: ['Activo', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Inicializar cualquier cosa si es necesario
  }

  onSubmit() {
    if (this.nuevoServicioForm.valid) {
      const nuevoServicio = this.nuevoServicioForm.value;

      this.serviciosService.createServicio(nuevoServicio).subscribe({
        next: (servicioCreado) => {
          this.save.emit(servicioCreado);
          this.ocultarDivNuevoServicio();
        },
        error: (error) => {
          console.error('Error al crear el servicio:', error);
        },
      });
    }
  }

  ocultarDivNuevoServicio() {
    this.ocultarDiv.emit();
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.nuevoServicioForm.get(controlName)?.hasError(errorName) ?? false;
  }
}
