import { Permisos } from "./permisos";

export interface Roles {
  id?: number;
  nombre: string;
  descripcion: string;
  permisos?: Permisos[];
}
