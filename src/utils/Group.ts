import { User } from "./User";

export interface Group {
  id: number;
  nombre: string;
  color: string;
  limite_gasto: number;
  monto_gastado: number;
  usuarios: User[];
  codigo: string;
}