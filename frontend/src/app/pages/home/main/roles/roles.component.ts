import { Component, inject } from '@angular/core';
import { Roles } from '../../../interfaces/roles';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { RolesService } from '../../../../services/main/roles.service';
import { PermisosService } from '../../../../services/main/permisos.service';
import { Permisos } from '../../../interfaces/permisos';
import { RolesPermisos } from '../../../interfaces/roles-permisos';
import { CommonModule, NgFor } from '@angular/common';
import { AuditService } from '../../../../services/main/audit.service';
import { firstValueFrom, forkJoin } from 'rxjs';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {
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
    this.loadInitialData();
  }

  async loadInitialData(): Promise<void> {
    this.loading = true;
    try {
      const [permisosResponse, rolesResponse] = await Promise.all([
        firstValueFrom(this.permisoService.getPermisos()),
        firstValueFrom(this.roleService.getRoles())
      ]);

      this.permisos = permisosResponse || [];
      this.roles = rolesResponse.map(role => ({
        ...role,
        permisos: role.permisos || [] // Asegura que siempre haya un array de permisos
      }));

      this.initializePermisoFormArray();
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      this.error = 'Error cargando datos. Por favor, intente nuevamente.';
    } finally {
      this.loading = false;
    }
  }

  initializePermisoFormArray(): void {
    const permisoFormArray = this.roleForm.get('permisos') as FormArray;
    permisoFormArray.clear();

    this.permisos.forEach(() => {
      permisoFormArray.push(this.formBuilder.control(false));
    });
  }

  get permisosFormArray(): FormArray {
    return this.roleForm.get('permisos') as FormArray;
  }

  async onSubmit(): Promise<void> {
    if (this.roleForm.invalid) return;

    const roleData: Roles = {
      nombre: this.roleForm.get('nombre')?.value,
      descripcion: this.roleForm.get('descripcion')?.value
    };

    const selectedPermisos = this.getSelectedPermisos();
    console.log('Permisos seleccionados:', selectedPermisos);

    try {
      if (this.editingRole) {
        await this.updateRole(roleData, selectedPermisos);
      } else {
        await this.createRole(roleData, selectedPermisos);
      }

      await this.loadInitialData();
      this.resetForm();
    } catch (error) {
      console.error('Error:', error);
      this.error = 'Error procesando la solicitud. Por favor, intente nuevamente.';
    }
  }

  getSelectedPermisos(): number[] {
    return this.permisosFormArray.controls
      .map((control, index) => control.value ? this.permisos[index].id : null)
      .filter((id): id is number => id !== null);
  }

  async createRole(roleData: Roles, selectedPermisos: number[]): Promise<void> {
    const createdRole = await firstValueFrom(this.roleService.createRol(roleData));
    if (createdRole && createdRole.id) {
      await firstValueFrom(this.roleService.assignPermisosToRol(createdRole.id, selectedPermisos));
    }
  }

  async updateRole(roleData: Roles, selectedPermisos: number[]): Promise<void> {
    if (!this.editingRole?.id) return;

    try {
      await firstValueFrom(this.roleService.editRol(this.editingRole.id, roleData));
      await firstValueFrom(this.roleService.assignPermisosToRol(this.editingRole.id, selectedPermisos));
    } catch (error) {
      console.error('Error actualizando el rol:', error);
    }
  }

  editRole(role: Roles): void {
    this.editingRole = role;

    this.roleForm.patchValue({
      nombre: role.nombre,
      descripcion: role.descripcion
    });

    const permisoFormArray = this.permisosFormArray;
    permisoFormArray.clear();

    this.permisos.forEach(permiso => {
      permisoFormArray.push(this.formBuilder.control(
        role.permisos?.some(p => p.id === permiso.id) || false
      ));
    });
  }


  updatePermisosCheckboxes(role: Roles): void {
    const permisoFormArray = this.permisosFormArray;
    permisoFormArray.clear();
    this.permisos.forEach(permiso => {
      const hasPermiso = role.permisos?.some(p => p.id === permiso.id);
      permisoFormArray.push(this.formBuilder.control(hasPermiso || false));
    });
  }

  async deleteRole(roleId: number): Promise<void> {
    if (!confirm('¿Está seguro de que desea eliminar este rol?')) return;

    try {
      await firstValueFrom(this.roleService.deleteRol(roleId));
      this.roles = this.roles.filter(r => r.id !== roleId);
    } catch (error) {
      console.error('Error eliminando rol:', error);
      this.error = 'Error eliminando el rol. Por favor, intente nuevamente.';
    }
  }

  resetForm(): void {
    this.editingRole = null;
    this.roleForm.reset();
    this.initializePermisoFormArray();
    this.error = '';
  }

}
