import { Servicios } from './../../../../interfaces/servicios';
import { Component, EventEmitter, Input, input, Output, SimpleChanges } from '@angular/core';
import { Proyectos } from '../../../../interfaces/proyectos';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Clientes } from '../../../../interfaces/clientes';

@Component({
  selector: 'app-editar-proyecto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editar-proyecto.component.html',
  styleUrl: './editar-proyecto.component.css'
})
export class EditarProyectoComponent {

  @Input() proyecto: Proyectos[] = [];
  @Output() ocultarDiv = new EventEmitter<void>();

  editProyectoForm: FormGroup;
  servicios: Servicios[] = [];
  clientes: Clientes[] = [];

  constructor(private fb: FormBuilder ) {
    this.editProyectoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      estado: ['', Validators.required],
      cliente: ['', Validators.required],
      servicios: ['', Validators.required]
    });

   }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }


  //METODO PARA OCULTAR DIV DE EDITAR PROYECTO
  ocultarDivEditarProyecto() {
    this.ocultarDiv.emit();
  }







}
