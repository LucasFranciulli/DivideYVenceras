export interface ExpensesGroupScheme {
  descripcion: string;
  fecha: string;
  grupo: Grupo;
  id: number;
  id_categoria: number;
  id_grupo: number;
  liquidacion: string;
  monto: string;
  monto_pagado: string;
  nombre: string;
  tipo: string;
  usuarios: Usuario[];
}

interface Grupo {
  color: string;
  descripcion: string;
  id: number;
  limite_gasto: string;
  monto_gastado: string;
  nombre: string;
  token: string;
}

interface Usuario {
  id: number;
  nombre_usuario: string;
  nombre: string;
  apellido: string;
  email: string;
  contraseña: string;
  saldo: string;
}
