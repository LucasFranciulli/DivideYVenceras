import {Expense} from './Expense';
import {GetGroupExpensesResponse} from './GetPersonalExpensesResponse';

export const parseGroupResults = (
  response: GetGroupExpensesResponse,
): Expense[] => {
  const {gastos} = response;

  return gastos.map((gasto: any) => ({
    id: Number(gasto.id),
    nombre: gasto.nombre,
    descripcion: gasto.descripcion,
    monto: gasto.monto,
    monto_pagado:gasto.monto_pagado,
    tipo: gasto.tipo,
    liquidacion: gasto.liquidacion,
    fecha:  new Date(gasto.fecha),
    id_categoria: Number(gasto.id_categoria),
    id_grupo: Number(gasto.id_grupo),
    categoria: {
      nombre: '',
    },
    gastoFijo: null,
    tags: null,
    /* grupo: {
      color: gasto.grupo.color,
      descripcion: gasto.grupo.descripcion,
      id: gasto.grupo.id,
      limite_gasto: gasto.grupo.limite_gasto,
      monto_gastado: gasto.grupo.monto_gastado,
      nombre: gasto.grupo.nombre,
      token: gasto.grupo.token,
    }, */
    usuarios: gasto.usuarios.map((usuario: any) => ({
      id: Number(usuario.id),
      nombre_usuario: usuario.nombre_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      contraseña: usuario.contraseña,
      saldo: usuario.saldo,
    })),
  }));
};
