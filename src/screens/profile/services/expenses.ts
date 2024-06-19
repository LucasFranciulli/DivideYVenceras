import axios from 'axios';
import {
  GetGroupExpensesResponse,
  GetPersonalExpensesResponse,
} from '../../../utils/GetPersonalExpensesResponse';

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
  console.log("currentDateFormatted", currentDateFormatted);
  const oneYearAgoFormatted = formatDate(oneYearAgo);
  console.log("oneYearAgoFormatted", oneYearAgoFormatted);
  console.log(`${URL}/api/gastos/propios?inicio=${oneYearAgoFormatted}&fin=${currentDateFormatted}`);
  try {
    const response = await axios.get<GetPersonalExpensesResponse>(
      `${URL}/api/gastos/propios?inicio=${oneYearAgoFormatted}&fin=${currentDateFormatted}`,
      {
        headers: {
          token: token,
        },
      },
    );
    console.log("response.data ACA DEVUELVE", response.data);
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
