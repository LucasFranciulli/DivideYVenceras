import axios from 'axios';
import {ExpenseRequest} from '../../../utils/ExpenseRequest';

export const postExpenseGrupal = async (
  expense: ExpenseRequest,
  token: string,
  type: string,
  id: number | string,
): Promise<string> => {

  const newExpense = {
    nombre: expense.nombre,
    descripcion: expense.descripcion,
    monto: expense.monto.toString(),
    fecha: expense.fecha,
    id_categoria: expense.id_categoria,
    tags: expense.tags,
    saldado: expense.saldado,
  };
  const response = await axios.post(
    `https://backenddycgestion-production.up.railway.app/api/gastos/casual/grupo/${id}`,
    newExpense,
    {
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
    },
  );
  const msj: string = response.data.mensaje;
  return msj;
};
