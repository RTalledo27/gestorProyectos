export interface SubTarea {
  id: number; // ID autogenerado al crear en el backend
  tarea: number; // ID de la tarea a la que pertenece
  titulo: string;
  estado: boolean; // True si está completada, False si no
}
