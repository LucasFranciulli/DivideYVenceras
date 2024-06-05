import { User } from "./Users";

export interface Group {
  id: number;
  nombre: string;
  color: string;
  limite_gasto: number;
  monto_gastado: number;
  usuarios: User[]
}