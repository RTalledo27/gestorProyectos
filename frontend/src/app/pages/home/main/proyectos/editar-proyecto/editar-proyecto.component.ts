import { Servicios } from './../../../../interfaces/servicios';
import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { Proyectos } from '../../../../interfaces/proyectos';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Clientes } from '../../../../interfaces/clientes';
import { ProyectosService } from '../../../../../services/main/proyectos.service';

@Component({
  selector: 'app-editar-proyecto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editar-proyecto.component.html',
  styleUrls: ['./editar-proyecto.component.css']
})
export class EditarProyectoComponent implements OnInit, OnChanges {

  @Input() proyecto!: Proyectos;
  @Output() ocultarDiv = new EventEmitter<void>();
  @Output() save = new EventEmitter<Proyectos>();

  servicios: Servicios[] = [];
  clientes: Clientes[] = [];
  formEditProyecto: FormGroup;

  constructor(private fb: FormBuilder, private proyectoService: ProyectosService) {
    this.formEditProyecto = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      estado: [''],
      servicios: [[]],
      cliente: ['']
    });
  }

  ngOnInit(): void {
    if (this.proyecto) {
      this.formEditProyecto.patchValue(this.proyecto);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['proyecto'] && this.proyecto) {
      this.formEditProyecto.patchValue(this.proyecto);
    }
  }

  ocultarDivEditarProyecto() {
    this.ocultarDiv.emit();
  }

  onEditProyecto() {
    if (this.formEditProyecto.valid) {
      this.proyectoService.editProyecto(this.proyecto, this.formEditProyecto.value).subscribe(
        (proyectoEditado: Proyectos) => {
          console.log('Proyecto editado:', proyectoEditado);
          this.save.emit(proyectoEditado);
          this.formEditProyecto.reset();
          this.ocultarDivEditarProyecto();
        },
        error => {
          console.log('Error al editar el proyecto:', error);
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.formEditProyecto.get(controlName)?.hasError(errorName) ?? false;
  }
}
