import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Clientes } from '../../../../interfaces/clientes';
import { ClientesService } from '../../../../../services/main/clientes.service';

@Component({
  selector: 'app-nuevo-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css'],
})
export class NuevoClienteComponent {
  @Output() save = new EventEmitter<Clientes>();
  @Output() ocultarDiv = new EventEmitter<void>();

  nuevoClienteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService
  ) {
    this.nuevoClienteForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      fecha_nacimiento: ['', [Validators.required]],
      genero: ['Masculino', [Validators.required]],
      direccion: ['', [Validators.required]],
      estado: ['Activo', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Inicializar cualquier cosa si es necesario
  }

  onSubmit() {
    if (this.nuevoClienteForm.valid) {
      const nuevoCliente = this.nuevoClienteForm.value;

      this.clientesService.createCliente(nuevoCliente).subscribe({
        next: (clienteCreado) => {
          this.save.emit(clienteCreado);
          this.ocultarDivNuevoCliente();
        },
        error: (error) => {
          console.error('Error al crear el cliente:', error);
        },
      });
    }
  }

  ocultarDivNuevoCliente() {
    this.ocultarDiv.emit();
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.nuevoClienteForm.get(controlName)?.hasError(errorName) ?? false;
  }
}
