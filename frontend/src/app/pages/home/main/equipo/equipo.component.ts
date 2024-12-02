import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipoService } from '../../../../services/main/equipo.service';
import { ProyectosService } from '../../../../services/main/proyectos.service';
import { Usuarios } from '../../../interfaces/usuarios';
import { Proyectos } from '../../../interfaces/proyectos';
import { Cargos } from '../../../interfaces/cargos';
import { AsignacionProyectos } from '../../../interfaces/asignacion-proyectos';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {
  desarrolladores: Usuarios[] = [];
  filteredDesarrolladores: Usuarios[] = [];
  proyectos: Proyectos[] = [];
  cargos: Cargos[] = [];
  searchTerm: string = '';
  especialidadFilter: string = '';
  proyectoFilter: string = '';
  sortColumn: keyof Usuarios = 'nombres';
  sortDirection: 'asc' | 'desc' = 'asc';
  showAssignModal: boolean = false;
  selectedUser: Usuarios | null = null;
  selectedProject: Proyectos | null = null;
  selectedRole: Cargos | null = null;
  showAddUserModal: boolean = false;
  newUserForm: FormGroup;

  constructor(
    private equipoService: EquipoService,
    private proyectoService: ProyectosService,
    private formBuilder: FormBuilder
  ) {
    this.newUserForm = this.formBuilder.group({
      nombres: ['', Validators.required],
      username: ['', Validators.required],
      apellidos: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cargo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarDesarrolladores();
    this.cargarCargos();
    this.cargarProyectos();
    this.equipoService.equipoActualizado.subscribe(() => {
      this.cargarDesarrolladores();
    });
  }

  cargarDesarrolladores(): void {
    this.equipoService.getEquipoConProyectosActivos().subscribe({
      next: (data: Usuarios[]) => {
        this.desarrolladores = data;
        this.applyFilters();
      },
      error: (error) => console.error('Error al cargar desarrolladores:',error)
    });
  }

  cargarCargos(): void {
    this.equipoService.getCargos().subscribe({
      next: (data: Cargos[]) => {
        this.cargos = data;
      },
      error: (error) => console.error('Error al cargar cargos:', error)
    });
  }

  cargarProyectos(): void {
    this.proyectoService.getProyectos().subscribe({
      next: (data: Proyectos[]) => {
        this.proyectos = data;
      },
      error: (error) => console.error('Error al cargar proyectos:', error)
    });
  }

  applyFilters(): void {
    this.filteredDesarrolladores = this.desarrolladores.filter(dev =>
      (dev.nombres?.toLowerCase().includes(this.searchTerm?.toLowerCase()) ||
       dev.apellidos?.toLowerCase().includes(this.searchTerm?.toLowerCase()) ||
       dev.email?.toLowerCase().includes(this.searchTerm?.toLowerCase())) &&
      (this.especialidadFilter === '' || dev.cargo?.nombre === this.especialidadFilter) &&
      (this.proyectoFilter === '' || dev.proyectos?.some(p => p.id?.toString() === this.proyectoFilter))
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

  calculateWorkload(desarrollador: Usuarios): string {
    const projectCount = desarrollador.proyectos?.length || 0;
    if (projectCount === 0) return 'Baja';
    if (projectCount === 1) return 'Media';
    return 'Alta';
  }

  openAssignModal(user: Usuarios): void {
    this.selectedUser = user;
    this.showAssignModal = true;
  }

  closeAssignModal(): void {
    this.showAssignModal = false;
    this.selectedUser = null;
    this.selectedProject = null;
    this.selectedRole = null;
  }

  assignProject(): void {
    if (this.selectedUser && this.selectedProject && this.selectedRole) {
      // Asegúrate de que 'selectedRole' sea el ID del rol y no el nombre o un objeto
      const asignacion: AsignacionProyectos = {
        usuario_id: this.selectedUser.id,  // ID del usuario
        proyecto_id: this.selectedProject.id||0,  // ID del proyecto
        rol: this.selectedRole?.id ||0 // Asegúrate de que 'selectedRole' es un objeto con 'id' y no un string
      };

      // Llamada al servicio para asignar el proyecto
      this.equipoService.asignarProyecto(asignacion.usuario_id,asignacion.proyecto_id,asignacion.rol).subscribe({
        next: (response) => {
          console.log('Proyecto asignado exitosamente', response);
          this.cargarDesarrolladores();
          this.closeAssignModal();
        },
        error: (error) => {
          console.error('Error al asignar proyecto', error);
          // Aquí puedes agregar manejo de errores, como mostrar un mensaje de error al usuario
        }
      });
    }
  }




  openAddUserModal(): void {
    this.showAddUserModal = true;
  }

  closeAddUserModal(): void {
    this.showAddUserModal = false;
    this.newUserForm.reset();
  }

  addNewUser(): void {
    if (this.newUserForm.valid) {
      this.equipoService.addUsuario(this.newUserForm.value).subscribe({
        next: (newUser) => {
          this.desarrolladores.push(newUser);
          this.applyFilters();
          this.closeAddUserModal();
        },
        error: (error) => console.error('Error al agregar usuario:', error)
      });
    }
  }
}

