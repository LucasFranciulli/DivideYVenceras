import { Expense } from "./Expense";

export const parsePersonalResults = (response: any): Expense[] => {
  const {gastos} = response;

  return gastos.map((gasto: any) => ({
    id: gasto.id,
    nombre: gasto.nombre,
    descripcion: gasto.descripcion,
    monto: gasto.monto,
    monto_pagado: gasto.monto_pagado,
    tipo: gasto.tipo,
    liquidacion: gasto.liquidacion,
    fecha: gasto.fecha,
    id_categoria: gasto.id_categoria,
    id_grupo: gasto.id_grupo,
    categoria: gasto.categoria,
    gastoFijo: gasto.gastoFijo
      ? {
          id: gasto.gastoFijo.id,
          frecuencia: gasto.gastoFijo.frecuencia,
          proxima_fecha: gasto.gastoFijo.proxima_fecha,
          agendado: gasto.gastoFijo.agendado,
          id_gasto: gasto.gastoFijo.id_gasto,
        }
      : null,
    tags: gasto.tags.map((tag: any) => ({
      nombre: tag.nombre,
      GastoTag: {
        id: tag.GastoTag.id,
        id_gasto: tag.GastoTag.id_gasto,
        id_tag: tag.GastoTag.id_tag,
      },
    })),
    usuarios: gasto.usuarios
      ? gasto.usuarios.map((usuario: any) => ({
          id: usuario.id,
          nombre_usuario: usuario.nombre_usuario,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          contraseña: usuario.contraseña,
          saldo: usuario.saldo,
          gastos_usuarios: usuario.gastos_usuarios
            ? {
                id_gasto: usuario.gastos_usuarios.id_gasto,
                id_usuario: usuario.gastos_usuarios.id_usuario,
                monto_pagado: usuario.gastos_usuarios.monto_pagado,
                metodo_pago: usuario.gastos_usuarios.metodo_pago,
              }
            : null,
        }))
      : undefined,
  }));
};
