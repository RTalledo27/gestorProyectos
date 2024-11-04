import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnInit,
  OnChanges,
} from '@angular/core';
import { Servicios } from '../../../../interfaces/servicios';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ServiciosService } from '../../../../../services/main/servicios.service';

@Component({
  selector: 'app-editar-servicio',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editar-servicio.component.html',
  styleUrls: ['./editar-servicio.component.css'],
})
export class EditarServicioComponent implements OnInit, OnChanges {
  @Input() servicio!: Servicios;
  @Output() ocultarDiv = new EventEmitter<void>();
  @Output() save = new EventEmitter<Servicios>();

  formEditServicio: FormGroup;

  constructor(
    private fb: FormBuilder,
    private serviciosService: ServiciosService
  ) {
    this.formEditServicio = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      estado: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.servicio) {
      this.formEditServicio.patchValue(this.servicio);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['servicio'] && this.servicio) {
      this.formEditServicio.patchValue(this.servicio);
    }
  }

  ocultarDivEditarServicio() {
    this.ocultarDiv.emit();
  }

  onEditServicio() {
    if (this.formEditServicio.valid && this.servicio.id !== undefined) {
      this.serviciosService
        .editServicio(this.servicio.id, this.formEditServicio.value)
        .subscribe(
          (servicioEditado: Servicios) => {
            console.log('Servicio editado:', servicioEditado);
            this.save.emit(servicioEditado);
            this.formEditServicio.reset();
            this.ocultarDivEditarServicio();
          },
          (error) => {
            console.log('Error al editar el servicio:', error);
          }
        );
    } else {
      console.log('Formulario no válido o ID del servicio es undefined');
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.formEditServicio.get(controlName)?.hasError(errorName) ?? false;
  }
}
