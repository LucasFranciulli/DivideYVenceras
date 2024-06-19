export interface Expense {
  id: number;
  nombre: string;
  descripcion: string;
  monto: string;
  monto_pagado: string;
  tipo: "FIJO" | "CASUAL";
  liquidacion: "EFECTIVO";
  fecha: Date;
  id_categoria: number;
  id_grupo: number | null;
  categoria: {
    nombre: string;
  };
  gastoFijo: {
    id: number;
    frecuencia: string;
    proxima_fecha: string;
    agendado: boolean;
    id_gasto: number;
  } | null;
  tags: {
    nombre: string;
    GastoTag: {
      id: number;
      id_gasto: number;
      id_tag: number;
    };
  }[] | null;
  usuarios?: {
    id: number,
    nombre_usuario: string,
    nombre: string,
    apellido: string,
    email: string,
    contraseña: string,
    saldo: string,
    gastos_usuarios: {
      id_gasto: number,
      id_usuario: number,
      monto_pagado: string,
      metodo_pago: string
    }
  }[]
}
