import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnInit,
  OnChanges,
} from '@angular/core';
import { Clientes } from '../../../../interfaces/clientes';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ClientesService } from '../../../../../services/main/clientes.service';

@Component({
  selector: 'app-editar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './editar-cliente.component.html',
  styleUrls: ['./editar-cliente.component.css'],
})
export class EditarClienteComponent implements OnInit, OnChanges {
  @Input() cliente!: Clientes;
  @Output() ocultarDiv = new EventEmitter<void>();
  @Output() save = new EventEmitter<Clientes>();

  formEditCliente: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService
  ) {
    this.formEditCliente = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      direccion: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.cliente) {
      this.formEditCliente.patchValue(this.cliente);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cliente'] && this.cliente) {
      this.formEditCliente.patchValue(this.cliente);
    }
  }

  ocultarDivEditarCliente() {
    this.ocultarDiv.emit();
  }

  onEditCliente() {
    if (this.formEditCliente.valid && this.cliente.id !== undefined) {
      this.clientesService
        .editCliente(this.cliente.id, this.formEditCliente.value)
        .subscribe(
          (clienteEditado: Clientes) => {
            console.log('Cliente editado:', clienteEditado);
            this.save.emit(clienteEditado);
            this.formEditCliente.reset();
            this.ocultarDivEditarCliente();
          },
          (error) => {
            console.log('Error al editar el cliente:', error);
          }
        );
    } else {
      console.log('Formulario no válido o ID del cliente es undefined');
    }
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.formEditCliente.get(controlName)?.hasError(errorName) ?? false;
  }
}
