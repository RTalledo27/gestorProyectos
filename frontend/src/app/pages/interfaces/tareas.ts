import { Proyectos } from "./proyectos";
import { SubTarea } from "./sub-tarea";
import { Usuarios } from "./usuarios";

export interface Tareas {
  id: number;  // ID autogenerado al crear en el backend
  proyecto: Proyectos; // ID del proyecto al que pertenece
  titulo: string;
  descripcion?: string;
  estado: 'Pendiente' | 'En Progreso' | 'Completada' | 'Retrasada';
  prioridad: 'Alta' | 'Media' | 'Baja';
  creado_en: string; // Fecha en formato ISO
  actualizado_en: string; // Fecha en formato ISO
  fecha_vencimiento: string; // Fecha en formato ISO
  completado_en?: string; // Fecha en formato ISO o null si no está completada
  usuarios_asignados: Usuarios[]; // IDs de usuarios asignados a la tarea
  subTareas: SubTarea[]; // Array de subtareas asociadas
}
