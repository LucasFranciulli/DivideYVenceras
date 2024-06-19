import axios from 'axios';
import {
  GetGroupExpensesResponse,
  GetPersonalExpensesResponse,
} from '../../../utils/GetPersonalExpensesResponse';

const URL = 'https://backenddycgestion-production.up.railway.app';

export const getPersonalExpenses = async (token: string) => {
  try {
    const response = await axios.get<GetPersonalExpensesResponse>(
      `${URL}/api/gastos/propios`,
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
    console.log('RESPONSE DATA: ', response.data);
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
