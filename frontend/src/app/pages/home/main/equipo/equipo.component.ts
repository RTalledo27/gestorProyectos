import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { EquipoService } from '../../../../services/main/equipo.service';
import { Usuarios } from '../../../interfaces/usuarios';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PerfilComponent } from "./perfil/perfil.component";

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [NgFor, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.css'
})
export class EquipoComponent implements OnInit {
  desarrolladores: Usuarios[] = [];
  filteredDesarrolladores: Usuarios[] = [];
  searchTerm: string = '';
  especialidadFilter: string = '';
  sortColumn: keyof Usuarios = 'nombres';
  sortDirection: 'asc' | 'desc' = 'asc';
  cargos: any[] = [];
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showProfileModal: boolean = false;
  selectedDesarrollador: Usuarios | null = null;
  desarrolladorForm: FormGroup;


  constructor(
    private equipoService: EquipoService,
    private fb: FormBuilder
  ) {
    this.desarrolladorForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      is_active: [true],
      cargo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarDesarrolladores();
    this.cargarCargos();
    this.equipoService.equipoActualizado.subscribe(() => {
      this.cargarDesarrolladores();
    });
  }

  cargarDesarrolladores(): void {
    this.equipoService.getEquipoConProyectosActivos().subscribe({
      next: (data: Usuarios[]) => {
        this.desarrolladores = data.filter(usuario => usuario.cargo?.nombre?.toLowerCase().includes('desarrollador'));
        this.applyFilters();
      },
      error: (error) => console.error('Error al cargar desarrolladores:', error)
    });
  }

  cargarCargos(): void {
    this.equipoService.getCargos().subscribe({
      next: (data) => {
        this.cargos = data;
      },
      error: (error) => console.error('Error al cargar cargos:', error)
    });
  }

  applyFilters(): void {
    this.filteredDesarrolladores = this.desarrolladores.filter(dev =>
      (dev.nombres?.toLowerCase().includes(this.searchTerm?.toLowerCase()) ||
       dev.apellidos?.toLowerCase().includes(this.searchTerm?.toLowerCase()) ||
       dev.email?.toLowerCase().includes(this.searchTerm?.toLowerCase())) &&
      (this.especialidadFilter === '' || dev.cargo?.nombre === this.especialidadFilter)
    );
    this.sortDesarrolladores();
  }

  sortDesarrolladores(): void {
    this.filteredDesarrolladores.sort((a, b) => {
      const aValue = a[this.sortColumn] ?? '';
      const bValue = b[this.sortColumn] ?? '';

      if (typeof aValue === 'string' && typeof bValue === 'string'){
        if (aValue?.toLowerCase() < bValue?.toLowerCase()) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue?.toLowerCase() > bValue?.toLowerCase()) return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  onSort(column: keyof Usuarios): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortDesarrolladores();
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  verPerfilDesarrollador(id: number): void {
    this.selectedDesarrollador = this.desarrolladores.find(d => d.id === id) || null;
    this.showProfileModal = true;
  }

  openAddDesarrolladorModal(): void {
    this.desarrolladorForm.reset({is_active: true});
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  addDesarrollador(): void {
    if (this.desarrolladorForm.valid) {
      this.equipoService.addUsuario(this.desarrolladorForm.value).subscribe({
        next: (newDesarrollador) => {
          this.desarrolladores.push(newDesarrollador);
          this.applyFilters();
          this.closeAddModal();
        },
        error: (error) => console.error('Error al agregar desarrollador:', error)
      });
    }
  }

  closeProfileModal(): void {
    this.showProfileModal = false;
    this.selectedDesarrollador = null;
  }

  openEditModal(desarrollador: Usuarios): void {
    this.selectedDesarrollador = desarrollador;
    this.desarrolladorForm.patchValue({
      username: desarrollador.username,
      email: desarrollador.email,
      nombres: desarrollador.nombres,
      apellidos: desarrollador.apellidos,
      is_active: desarrollador.is_active,
      cargo: desarrollador.cargo?.id
    });
    this.desarrolladorForm.get('password')?.clearValidators();
    this.desarrolladorForm.get('password')?.updateValueAndValidity();
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedDesarrollador = null;
  }

  updateDesarrollador(): void {
    if (this.desarrolladorForm.valid && this.selectedDesarrollador) {
      const updatedData = {
        ...this.desarrolladorForm.value,
        id: this.selectedDesarrollador.id,
        // Ensure all required fields are included
        username: this.desarrolladorForm.get('username')?.value,
        email: this.desarrolladorForm.get('email')?.value,
        nombres: this.desarrolladorForm.get('nombres')?.value,
        apellidos: this.desarrolladorForm.get('apellidos')?.value,
        is_active: this.desarrolladorForm.get('is_active')?.value,
        cargo: this.desarrolladorForm.get('cargo')?.value
      };
      console.log('Enviando datos a la API:', updatedData);
      this.equipoService.updateUsuario(updatedData).subscribe({
        next: (updatedDesarrollador) => {
          console.log(' Datos actualizados:', updatedDesarrollador);
          const index = this.desarrolladores.findIndex(d => d.id === updatedDesarrollador.id);
          if (index !== -1) {
            this.desarrolladores[index] = updatedDesarrollador;
            this.applyFilters();
          }
          this.closeEditModal();
        },
        error: (error) => {
          console.error('Error al actualizar desarrollador:', error);
          // Display error message to the user
          alert('Error al actualizar el desarrollador. Por favor, intente de nuevo.');
        }
      });
    }
  }


}
