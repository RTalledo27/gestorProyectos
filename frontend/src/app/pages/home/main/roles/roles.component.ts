import { Component } from '@angular/core';
import { Roles } from '../../../interfaces/roles';
import { FormGroup, FormBuilder, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { RolesService } from '../../../../services/main/roles.service';
import { PermisosService } from '../../../../services/main/permisos.service';
import { Permisos } from '../../../interfaces/permisos';
import { RolesPermisos } from '../../../interfaces/roles-permisos';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,NgFor],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {
  roles: Roles[] = [];
  permisos: Permisos[] = [];
  roleForm: FormGroup;
  editingRole: Roles | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private roleService: RolesService,
    private permisoService: PermisosService,
    //private auditService: AuditService
  ) {
    this.roleForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      permisos: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermisos();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe(
      (roles) => {
        this.roles = roles;
      },
      (error) => {
        console.error('Error cargando roles', error);
      }
    );
  }

  loadPermisos(): void {
    this.permisoService.getPermisos().subscribe(
      (permisos) => {
        this.permisos = permisos;
        this.updatePermisoFormArray();
      },
      (error) => {
        console.error('Error cargando permisos', error);
      }
    );
  }

  updatePermisoFormArray(): void {
    const permisoFormArray = this.roleForm.get('permisos') as FormArray;
    permisoFormArray.clear();
    this.permisos.forEach(permiso => {
      permisoFormArray.push(this.formBuilder.control(false));
    });
  }

  onSubmit(): void {
    if (this.roleForm.valid) {
      const roleData: Roles = {
        nombre: this.roleForm.get('nombre')?.value,
        descripcion: this.roleForm.get('descripcion')?.value
      };

      const selectedPermisos = this.getSelectedPermisos();

      if (this.editingRole) {
        this.updateRole(roleData, selectedPermisos);
      } else {
        this.createRole(roleData, selectedPermisos);
      }
    }
  }

  getSelectedPermisos(): number[] {
    const selectedPermisos: number[] = [];
    const permisoFormArray = this.roleForm.get('permisos') as FormArray;
    permisoFormArray.controls.forEach((control, index) => {
      if (control.value) {
        selectedPermisos.push(this.permisos[index].id!);
      }
    });
    return selectedPermisos;
  }

  createRole(roleData: Roles, selectedPermisos: number[]): void {
    this.roleService.createRole(roleData).subscribe(
      (createdRole) => {
        this.roles.push(createdRole);
        this.assignPermisosToRole(createdRole.id!, selectedPermisos);
      },
      (error) => {
        console.error('Error creando rol', error);
      }
    );
  }

  updateRole(roleData: Roles, selectedPermisos: number[]): void {
    if (this.editingRole && this.editingRole.id) {
      this.roleService.editRole(this.editingRole.id, roleData).subscribe(
        (updatedRole) => {
          const index = this.roles.findIndex(r => r.id === updatedRole.id);
          if (index !== -1) {
            this.roles[index] = updatedRole;
          }
          this.assignPermisosToRole(updatedRole.id!, selectedPermisos);
        },
        (error) => {
          console.error('Error actualizando rol', error);
        }
      );
    }
  }

  assignPermisosToRole(roleId: number, selectedPermisos: number[]): void {
    this.roleService.assignPermisosToRol(roleId, selectedPermisos).subscribe(
      () => {
        //this.auditService.logAction('Permisos asignados', { roleId, permisos: selectedPermisos });
        this.resetForm();
        this.loadRoles();
      },
      (error) => {
        console.error('Error asignando permisos al rol', error);
      }
    );
  }

  editRole(role: Roles): void {
    this.editingRole = role;
    this.roleForm.patchValue({
      nombre: role.nombre,
      descripcion: role.descripcion
    });
    this.updatePermisoFormArray();
    this.roleService.getRolesPermisos().subscribe(
      (rolePermisos) => {
        const permisoFormArray = this.roleForm.get('permisos') as FormArray;
        rolePermisos.forEach(rp => {
          const index = this.permisos.findIndex(p => p.id === rp.permiso);
          if (index !== -1) {
            permisoFormArray.at(index).setValue(true);
          }
        });
      },
      (error) => {
        console.error('Error cargando permisos del rol', error);
      }
    );
  }

  deleteRole(roleId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este rol?')) {
      this.roleService.deleteRole(roleId).subscribe(
        () => {
          this.roles = this.roles.filter(r => r.id !== roleId);
          //this.auditService.logAction('Rol eliminado', { roleId });
        },
        (error) => {
          console.error('Error eliminando rol', error);
        }
      );
    }
  }

  resetForm(): void {
    this.editingRole = null;
    this.roleForm.reset();
    this.updatePermisoFormArray();
  }
}
