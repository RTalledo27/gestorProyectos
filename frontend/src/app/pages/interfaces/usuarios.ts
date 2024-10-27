export interface Usuarios {
  id?: number; // Django lo genera automáticamente
  username: string;
  email: string;
  password: string;
  nombres?: string;
  apellidos?: string;
  created_at?: Date;
  last_login?: Date | null;
  is_active?: boolean;
}
