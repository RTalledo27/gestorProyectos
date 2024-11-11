import { Clientes } from "./clientes";
import { Servicios } from "./servicios";

export interface Proyectos {
  id?: number;
  nombre: string;
  descripcion?: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  estado: string;
  progreso: number;
  servicios?: Servicios[];
  clientes?: Clientes[];
  creado_en?: Date;
  actualizado_en?: Date;
  tareas_pendientes: number;
}
