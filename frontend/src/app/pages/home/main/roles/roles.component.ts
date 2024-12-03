import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Roles } from '../../../interfaces/roles';
import { Permisos } from '../../../interfaces/permisos';
import { RolesService } from '../../../../services/main/roles.service';
import { PermisosService } from '../../../../services/main/permisos.service';

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

    // Create a FormControl for each permission
    this.permisos.forEach((permiso) => {
      const control = this.formBuilder.control(false);
      // Add change listener to debug
      control.valueChanges.subscribe(value => {
        console.log(`Permiso ${permiso.id} changed to:`, value);
        console.log('Current FormArray values:', this.getSelectedPermisos());
      });
      permisosFormArray.push(control);
    });
  }
  onSubmit(): void {
    if (this.roleForm.invalid) return;

    const roleData = {
      nombre: this.roleForm.get('nombre')?.value,
      descripcion: this.roleForm.get('descripcion')?.value
    };

    const selectedPermisos = this.getSelectedPermisos();
    console.log('Permisos seleccionados al enviar:', selectedPermisos);
    this.logPermisosState();

    this.loading = true;
    if (this.editingRole) {
      this.updateRole(roleData, selectedPermisos);
    } else {
      this.createRole(roleData, selectedPermisos);
    }
  }

  createRole(roleData: Partial<Roles>, selectedPermisos: number[]): void {
    this.roleService.createRol(roleData).subscribe({
      next: (savedRole) => {
        this.assignPermissionsToRole(savedRole.id || 0, selectedPermisos);
      },
      error: (error) => {
        console.error('Error creando rol:', error);
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
      .filter((_, index) => permisosFormArray.at(index).value === true)
      .map(permiso => permiso.id)
      .filter((id): id is number => id !== undefined);
  }

  editRole(role: Roles): void {
    this.editingRole = role;
    this.roleForm.patchValue({
      nombre: role.nombre,
      descripcion: role.descripcion,
    });

    // Reset and set permissions
    const permisosFormArray = this.roleForm.get('permisos') as FormArray;
    permisosFormArray.valueChanges.subscribe(values => {
      console.log('FormArray values changed:', values);
    });

    this.permisos.forEach((permiso) => {
      const isSelected = role.permisos?.some(p => p.id === permiso.id) ?? false;
      const control = this.formBuilder.control(isSelected);
      permisosFormArray.push(control);
    });
  }

  deleteRole(roleId: number): void {
    if (!confirm('¿Está seguro de que desea eliminar este rol?')) return;

    this.roleService.deleteRol(roleId).subscribe({
      next: () => this.fetchRoles(),
      error: (error) => {
        console.error('Error eliminando rol:', error);
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.editingRole = null;
    this.roleForm.reset();
  }

  get permisosFormArray(): FormArray {
    return this.roleForm.get('permisos') as FormArray;
  }

  logPermisosState(): void {
    const permisosFormArray = this.roleForm.get('permisos') as FormArray;
    console.log('Estado actual de permisos:');
    this.permisos.forEach((permiso, index) => {
      console.log(`${permiso.nombre}: ${permisosFormArray.at(index).value}`);
    });
    console.log('Permisos seleccionados:', this.getSelectedPermisos());
  }
}

