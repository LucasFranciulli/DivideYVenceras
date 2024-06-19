export interface Transaccion {
  from: string;
  to: string;
  amount: string;
}

export interface TransaccionesResponse {
  transacciones: Transaccion[];
}
