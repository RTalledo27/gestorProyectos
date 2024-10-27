export interface Clientes {
  id?: number;
  nombre: string;
  apellido: string;
  genero: string;
  fecha_nacimiento?: Date;
  telefono?: string;
  direccion?: string;
  correo: string;
  foto?: string;
  estado: string;
  created_at?: Date;
  updated_at?: Date;
}

