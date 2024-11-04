import { Component } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { EquipoService } from '../../../../services/main/equipo.service';
import { Usuarios } from '../../../interfaces/usuarios';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.css'
})
export class EquipoComponent {
  equipo: Usuarios[] = [];

  constructor(private equipoService: EquipoService) {}

  ngOnInit(): void {
    this.cargarEquipo();
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


}
