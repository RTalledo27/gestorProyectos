import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { EquipoService } from '../../../../services/main/equipo.service';
import { Usuarios } from '../../../interfaces/usuarios';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Proyectos } from '../../../interfaces/proyectos';
import { ProyectosService } from '../../../../services/main/proyectos.service';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [NgFor, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.css'
})
export class EquipoComponent {
  equipo: Usuarios[] = [];
  mostrarModal = false;
  miembroSeleccionado: any = null;
  rolSeleccionado: string = '';
  searchTerm: string = '';
  estadoFiltro: string = '';
  proyectos: Proyectos[]=[];

  constructor(private equipoService: EquipoService, private proyectoService: ProyectosService) {}

  ngOnInit(): void {
    this.cargarEquipo();
    this.cargarProyectos();
  }


  cargarProyectos(){
    this.proyectoService.getProyectos().subscribe({
      next: (data: Proyectos[]) => {
        this.proyectos = data;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

    cargarEquipo() {
      this.equipoService.getEquipoConProyectosActivos().subscribe({
        next: (data: Usuarios[]) => {
          this.equipo = data;
        },
        error: (error) => {
          console.error('Error al cargar el equipo:', error);
        }
      });

  }

  abrirModalAsignacion(miembro: Usuarios) {
    this.miembroSeleccionado = miembro;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.miembroSeleccionado = null;
  }

  asignarProyecto(proyecto: Proyectos) {
    if (this.miembroSeleccionado) {
      console.log(`Asignando ${proyecto.nombre} a ${this.miembroSeleccionado.nombres}`);
      console.log(proyecto);
      this.cerrarModal();
    }
  }

  filtrarProyectos() {
    return this.proyectos.filter(proyecto => {
      const matchesSearch = proyecto.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.estadoFiltro || proyecto.estado === this.estadoFiltro;
      return matchesSearch && matchesStatus;
    });
  }

  //OBTENER EERRORES


}
