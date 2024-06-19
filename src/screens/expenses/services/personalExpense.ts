import axios from 'axios';
import {ExpenseRequest} from '../../../utils/ExpenseRequest';
import { ExpenseEdit } from '../../../utils/ExpenseEdit';

export const postExpensePersonal = async (
  expense: ExpenseRequest,
  token: string,
  type: string,
): Promise<string> => {
  console.log("expense to add: ", expense);
  const response = await axios.post(
    `https://backenddycgestion-production.up.railway.app/api/gastos/${type}`,
    expense,
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

export const editExpensePersonal = async (
  expense: ExpenseEdit,
  token: string,
  id: number,
): Promise<string> => {
  console.log("expense to edit: ", expense);
  const response = await axios.put(
    `https://backenddycgestion-production.up.railway.app/api/gastos/${id}`,
    expense,
    {
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
    },
  );

  return response.data;
};
