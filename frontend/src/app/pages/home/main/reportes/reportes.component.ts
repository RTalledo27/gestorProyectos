import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProyectosService } from '../../../../services/main/proyectos.service';
import { Proyectos } from '../../../interfaces/proyectos';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  reportes = [
    {
      titulo: 'Progreso de Proyectos',
      descripcion: 'Visión general del avance de todos los proyectos',
      icono: 'fas fa-chart-bar',
      tipo: 'pdf',
    },
    {
      titulo: 'Rendimiento del Equipo',
      descripcion: 'Métricas de productividad y eficiencia',
      icono: 'fas fa-users',
      tipo: 'pdf',
    },
    {
      titulo: 'Distribución de Tareas',
      descripcion: 'Análisis de la asignación de tareas por proyecto',
      icono: 'fas fa-tasks',
      tipo: 'excel',
    },
  ];
  proyectos: Proyectos[] = [];
  mostrarModal = false;

  constructor(private proyectosService: ProyectosService) {}

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos() {
    this.proyectosService.getProyectos().subscribe({
      next: (data: Proyectos[]) => {
        this.proyectos = data;
      },
      error: (error) => {
        console.error('Error al cargar proyectos:', error);
      },
    });
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  descargarReporte(reporte: any) {
    if (reporte.tipo === 'pdf') {
      this.generarPDF(reporte.titulo);
    }
  }

  generarPDF(titulo: string) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(titulo, 10, 10);

    const columns = [
      'ID',
      'Nombre del Proyecto',
      'Cliente',
      'Fecha de Inicio',
      'Fecha de Fin',
      'Progreso',
      'Estado',
      'Tareas Pendientes',
    ];
    const rows = this.proyectos.map((proyecto) => [
      proyecto.id,
      proyecto.nombre,
      proyecto.clientes?.[0]?.nombre || 'N/A',
      new Date(proyecto.fecha_inicio).toLocaleDateString(),
      new Date(proyecto.fecha_fin).toLocaleDateString(),
      `${proyecto.progreso}%`,
      proyecto.estado,
      proyecto.tareas_pendientes,
    ]);

    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [22, 160, 133] },
      styles: { fontSize: 10, cellPadding: 4 },
      margin: { top: 20 },
    });

    doc.save(`${titulo}.pdf`);
  }
}
