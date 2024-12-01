import { Cargos } from "./cargos";
import { Proyectos } from "./proyectos";

export interface Usuarios {
  id: number;
  username: string;
  email: string;
  nombres: string;
  apellidos: string;
  created_at: string;
  last_login: string | null;
  is_active: boolean;
  cargo?: {
    id: number;
    nombre: string;
    descripcion: string;
  };
  proyectos_activos: number;
  proyectos?: Proyectos[];
}
