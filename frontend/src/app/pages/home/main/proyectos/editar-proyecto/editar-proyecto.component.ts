import { Servicios } from './../../../../interfaces/servicios';
import { Component, EventEmitter, Input, Output, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { Proyectos } from '../../../../interfaces/proyectos';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Clientes } from '../../../../interfaces/clientes';
import { ProyectosService } from '../../../../../services/main/proyectos.service';
import { ServiciosService } from '../../../../../services/main/servicios.service';
import { ClientesService } from '../../../../../services/main/clientes.service';

@Component({
  selector: 'app-editar-proyecto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editar-proyecto.component.html',
  styleUrls: ['./editar-proyecto.component.css']
})
export class EditarProyectoComponent implements OnInit {

  @Input() proyecto!: Proyectos;
  @Output() ocultarDiv = new EventEmitter<void>();
  @Output() save = new EventEmitter<Proyectos>();

  formEditProyecto: FormGroup;
  servicios: Servicios[] = [];
  clientes: Clientes[] = [];

  constructor(
    private fb: FormBuilder,
    private proyectoService: ProyectosService,
    private serviciosService: ServiciosService,
    private clientesService: ClientesService
  ) {
    this.formEditProyecto = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      estado: ['', Validators.required],
      servicios: [[]],
      cliente: [[]]
    });
  }

  ngOnInit(): void {
    if (this.proyecto) {
      this.formEditProyecto.patchValue(this.proyecto);
    }
    this.cargarServicios();
    this.cargarClientes();
  }

  cargarServicios() {
    this.serviciosService.getServicios().subscribe(
      (servicios) => this.servicios = servicios,
      (error) => console.error('Error al cargar servicios:', error)
    );
  }

  cargarClientes() {
    this.clientesService.getClientes().subscribe(
      (clientes) => this.clientes = clientes,
      (error) => console.error('Error al cargar clientes:', error)
    );
  }

  ocultarDivEditarProyecto() {
    this.ocultarDiv.emit();
  }

  onEditProyecto() {
    if (this.formEditProyecto.valid) {
      const proyectoEditado: Proyectos = this.formEditProyecto.value;
      this.proyectoService.editProyecto(proyectoEditado).subscribe(
        (response: Proyectos) => {
          console.log('Proyecto editado:', response);
          this.save.emit(response);
          this.ocultarDivEditarProyecto();
        },
        error => {
          console.error('Error al editar el proyecto:', error);
          // TODO: Mostrar mensaje de error al usuario
        }
      );
    } else {
      console.log('Formulario no válido');
      // TODO: Mostrar errores de validación al usuario
    }
  }

  anadirServicio() {
    // Lógica para añadir un servicio al proyecto
    console.log('Añadir servicio');
  }

  anadirCliente() {
    // Lógica para añadir un cliente al proyecto
    console.log('Añadir cliente');
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.formEditProyecto.get(controlName)?.hasError(errorName) ?? false;
  }
}
