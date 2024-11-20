export interface AuditLog {
  id?: number;
  usuario?: number;
  accion: string;
  detalles: string;
  timestamp: string;
}
