export interface ExpensesScheme {
  id: number;
  nombre: string;
  descripcion: string;
  monto: string;
  monto_pagado: string;
  tipo: string;
  liquidacion: string;
  fecha: Date;
  id_categoria: number;
  id_grupo: number;
  categoria: Category;
  gastoFijo: FixedExpense;
  tags: Tag[];
}

interface Category {
  nombre: string;
}

interface FixedExpense {
  id: number;
  frecuencia: string;
  proxima_fecha: Date;
  agendado: boolean;
  id_gasto: number;
}

interface Tag {
  nombre: string;
  GastoTag: TagExpense;
}

interface TagExpense {
  id: number;
  id_gasto: number;
  id_tag: number;
}
