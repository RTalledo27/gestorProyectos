import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/home/main/dashboard/dashboard.component';
import { ProyectosComponent } from './pages/home/main/proyectos/proyectos.component';

export const routes: Routes = [

  {
    path:'',
    component: HomeComponent,
    children:[
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/home/main/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'proyectos',
        loadComponent:()=> import('./pages/home/main/proyectos/proyectos.component').then(m=>m.ProyectosComponent)
      },
      {
        path: 'tareas',
        loadComponent: () => import('./pages/home/main/tareas/tareas.component').then(m => m.TareasComponent)
      },
      {
        path: 'equipo',
        loadComponent: () => import('./pages/home/main/equipo/equipo.component').then(m => m.EquipoComponent)
      },
      {
        path: 'reportes',
        loadComponent: () => import('./pages/home/main/reportes/reportes.component').then(m => m.ReportesComponent)
      },
      {
        path:'clientes',
        loadComponent:()=> import('./pages/home/main/clientes/clientes.component').then(m=>m.ClientesComponent)
      },
      {
        path:'servicios',
        loadComponent:()=> import('./pages/home/main/servicios/servicios.component').then(m=>m.ServiciosComponent)
      }
    ],

  },
  {
    path:'auth',
    loadComponent:()=> import('./pages/auth/auth.component').then(m=>m.AuthComponent),
    children:[
      {
        path:'login',
        loadComponent:()=> import('./pages/auth/login/login.component').then(m=>m.LoginComponent)
      },
    ]

  }


];
