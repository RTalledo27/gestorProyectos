import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Roles } from '../../../interfaces/roles';
import { Permisos } from '../../../interfaces/permisos';
import { RolesService } from '../../../../services/main/roles.service';
import { PermisosService } from '../../../../services/main/permisos.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  roles: Roles[] = [];
  permisos: Permisos[] = [];
  roleForm: FormGroup;
  editingRole: Roles | null = null;
  loading = false;
  error = '';

  private formBuilder = inject(FormBuilder);
  private roleService = inject(RolesService);
  private permisoService = inject(PermisosService);

  constructor() {
    this.roleForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      permisos: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.fetchRoles();
    this.fetchPermissions();
  }

  fetchRoles(): void {
    this.loading = true;
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching roles:', error);
        this.loading = false;
      }
    });
  }

  fetchPermissions(): void {
    this.permisoService.getPermisos().subscribe({
      next: (data) => {
        this.permisos = data;
        this.initializePermisosFormArray();
      },
      error: (error) => console.error('Error fetching permissions:', error)
    });
  }

  initializePermisosFormArray(): void {
    const permisosFormArray = this.roleForm.get('permisos') as FormArray;
    permisosFormArray.clear();
    this.permisos.forEach(() => {
      permisosFormArray.push(this.formBuilder.control(false));
    });
  }

  onSubmit(): void {
    if (this.roleForm.invalid) return;

    const roleData = {
      nombre: this.roleForm.get('nombre')?.value,
      descripcion: this.roleForm.get('descripcion')?.value
    };

    // Obtén los permisos seleccionados
    const selectedPermisos = this.getSelectedPermisos();
    console.log('Permisos seleccionados:', selectedPermisos);

    this.loading = true;
    if (this.editingRole) {
      this.updateRole(roleData, selectedPermisos); // Enviar en actualización
    } else {
      this.createRole(roleData, selectedPermisos); // Enviar en creación
    }
  }

  createRole(roleData: Partial<Roles>, selectedPermisos: number[]): void {
    this.roleService.createRol(roleData).subscribe({
      next: (savedRole) => {
        this.assignPermissionsToRole(savedRole.id || 0, selectedPermisos); // Asignar permisos al nuevo rol
      },
      error: (error) => {
        console.error('Error creating role:', error);
        this.loading = false;
      }
    });
  }

  updateRole(roleData: Partial<Roles>, selectedPermisos: number[]): void {
    if (!this.editingRole) return;

    this.roleService.editRol(this.editingRole.id || 0, roleData, selectedPermisos).subscribe({
      next: () => {
        this.fetchRoles();
        this.resetForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error updating role:', error);
        this.loading = false;
      }
    });
  }

  assignPermissionsToRole(roleId: number, selectedPermisos: number[]): void {
    this.roleService.assignPermisosToRol(roleId, selectedPermisos).subscribe({
      next: () => {
        this.fetchRoles();
        this.resetForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error assigning permissions:', error);
        this.loading = false;
      }
    });
  }

  getSelectedPermisos(): number[] {
    const permisosFormArray = this.roleForm.get('permisos') as FormArray;
    return this.permisos
      .filter((_, index) => permisosFormArray.at(index).value) // Verifica si el checkbox está marcado
      .map(permiso => permiso.id || 0); // Devuelve el ID del permiso marcado
  }

  editRole(role: Roles): void {
    this.editingRole = role;
    this.roleForm.patchValue({
      nombre: role.nombre,
      descripcion: role.descripcion
    });

    const permisosFormArray = this.roleForm.get('permisos') as FormArray;
    permisosFormArray.clear();
    this.permisos.forEach((permiso) => {
      const hasPermiso = role.permisos?.some((p) => p.id === permiso.id);
      permisosFormArray.push(this.formBuilder.control(hasPermiso));
    });
  }

  deleteRole(roleId: number): void {
    if (!confirm('¿Está seguro de que desea eliminar este rol?')) return;

    this.roleService.deleteRol(roleId).subscribe({
      next: () => this.fetchRoles(),
      error: (error) => {
        console.error('Error deleting role:', error);
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.editingRole = null;
    this.roleForm.reset();
    this.initializePermisosFormArray();
  }
}
