import axios from 'axios';
import {
  GetGroupExpensesResponse,
  GetPersonalExpensesResponse,
} from '../../../utils/GetPersonalExpensesResponse';
import {TransaccionesResponse} from '../../../utils/DivideExpenses';
import {PayExpenseResponse} from '../../../utils/PayExpense';

const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses son 0-indexados
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const URL = 'https://backenddycgestion-production.up.railway.app';

export const getPersonalExpenses = async (token: string) => {
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const currentDateFormatted = formatDate(now);
  const oneYearAgoFormatted = formatDate(oneYearAgo);
  try {
    const response = await axios.get<GetPersonalExpensesResponse>(
      `${URL}/api/gastos/propios?inicio=${oneYearAgoFormatted}&fin=${currentDateFormatted}`,
      {
        headers: {
          token: token,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.log('error: ', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const getGroupExpenses = async (token: string) => {
  try {
    const response = await axios.get<GetGroupExpensesResponse>(
      `${URL}/api/gastos/perfil/grupos`,
      {
        headers: {
          token: token,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.log('error: ', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const deleteExpense = async (token: string, id: number) => {
  try {
    await axios.delete<GetGroupExpensesResponse>(`${URL}/api/gastos/${id}`, {
      headers: {
        token: token,
      },
    });
    return true;
  } catch (error: any) {
    console.log('error: ', error);
    return false;
  }
};

export const divideGroupExpenses = async (id: number, token: string) => {
  try {
    const result = await axios.post<TransaccionesResponse>(
      `${URL}/api/grupos/${id}/dividir`,
      {},
      {
        headers: {
          token: token,
        },
      },
    );
    console.log('result: ', result.data);
    return result.data.transacciones;
  } catch (error: any) {
    console.log('error: ', error);
  }
};

export const payExpense = async (id: number, token: string) => {
  try {
    const result = await axios.post<PayExpenseResponse>(
      `${URL}/api/gastos/pagar/${id}`,
      {},
      {
        headers: {
          token: token,
        },
      },
    );
    console.log('PAY result: ', result.data);
    return result.data;
  } catch (error: any) {
    console.log('error: ', error);
  }
};
