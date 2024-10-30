import { SubTarea } from "./sub-tarea";

export interface Tareas {
  id: number;  // ID autogenerado al crear en el backend
  proyecto: number; // ID del proyecto al que pertenece
  titulo: string;
  descripcion?: string;
  estado: 'Pendiente' | 'En Proceso' | 'Completada' | 'Retrasada';
  prioridad: 'Alta' | 'Media' | 'Baja';
  creadoEn: string; // Fecha en formato ISO
  actualizadoEn: string; // Fecha en formato ISO
  fechaVencimiento: string; // Fecha en formato ISO
  completadoEn?: string; // Fecha en formato ISO o null si no está completada
  usuariosAsignados: number[]; // IDs de usuarios asignados a la tarea
  subTareas: SubTarea[]; // Array de subtareas asociadas
}
