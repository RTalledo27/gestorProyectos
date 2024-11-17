import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, MainComponent, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  title: string = 'Dashboard';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        switch (event.url) {
          case '/dashboard':
            this.title = 'Dashboard';
            break;
          case '/proyectos':
            this.title = 'Proyectos';
            break;
          case '/tareas':
            this.title = 'Tareas';
            break;
          case '/equipo':
            this.title = 'Equipo';
            break;
          case '/reportes':
            this.title = 'Reportes';
            break;
          case '/clientes':
            this.title = 'Clientes';
            break;
          case '/servicios':
            this.title = 'Servicios';
            break;
          default:
            this.title = 'Dashboard';
            break;
        }
      }
    });
  }
}
