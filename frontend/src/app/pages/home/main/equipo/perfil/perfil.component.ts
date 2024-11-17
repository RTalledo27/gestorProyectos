import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EquipoService } from '../../../../../services/main/equipo.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {


  constructor(
    private route: ActivatedRoute,
    private equipoService: EquipoService
  ) {}

  ngOnInit() {

  }

  loadDeveloperProfile() {

  }
}
