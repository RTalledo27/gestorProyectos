import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Servicios } from '../../../../interfaces/servicios';
import { Clientes } from '../../../../interfaces/clientes';
import { Proyectos } from '../../../../interfaces/proyectos';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProyectosService } from '../../../../../services/main/proyectos.service';
import { ClientesService } from '../../../../../services/main/clientes.service';
import { ServiciosService } from '../../../../../services/main/servicios.service';

@Component({
  selector: 'app-nuevo-proyecto',
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './nuevo-proyecto.component.html',
  styleUrl: './nuevo-proyecto.component.css'
})
export class NuevoProyectoComponent {

servicios: Servicios[] = [];
 clientes: Clientes[] = [];
 cliente: Clientes[]=[]
  @Output() save = new EventEmitter<Proyectos>();
  //EMITER PARA EMITER EL EVENTO DE OCULTAR DIV
  @Output() ocultarDiv = new EventEmitter<void>();

  nuevoProyectoForm: FormGroup;


  constructor(private fb: FormBuilder, private proyectosService: ProyectosService, private clientesService: ClientesService, private serviciosService: ServiciosService) {
    this.nuevoProyectoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      fecha_inicio: ['', [Validators.required]],
      fecha_fin: ['', [Validators.required]],
      estado: ['En Progreso', [Validators.required]],
      progreso: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      clientes: [[], [Validators.required]],
      servicios: [[], [Validators.required]]
    });
  }

  /*
  nuevoProyecto= {
    id: 0,
    nombre: '',
    descripcion: '',
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    estado: 'En Progreso',
    progreso: 0,
    creado_en: new Date(),
    actualizado_en: new Date(),
    servicios: [],
    clientes: []
  };
*/

  //XCONSUMIR API NUEVO PROYECTO

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarServicios();
  }

  onSubmit() {
    if (this.nuevoProyectoForm.valid) {
      const nuevoProyecto = this.nuevoProyectoForm.value;



      this.proyectosService.createProyecto(nuevoProyecto).subscribe({
        next: (proyectoCreado) => {
          this.save.emit(proyectoCreado);
          this.ocultarDivEditarProyecto();
        },
        error: (error) => {
          console.error('Error al crear el proyecto:', error);
        }
      });
    }
  }

  cargarServicios() {
    this.serviciosService.getServicios().subscribe({
      next: (data: Servicios[]) => {
        this.servicios = data;
      },
      error: (error) => {
        console.error('Error al cargar servicios:', error);
      }
    });
  }

  cargarClientes() {
    this.clientesService.getClientes().subscribe({
      next: (data: Clientes[]) => {
        this.clientes = data;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
      }
    });
  }

  ocultarDivEditarProyecto() {
    this.ocultarDiv.emit();
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.nuevoProyectoForm.get(controlName)?.hasError(errorName) ?? false;
  }
}
