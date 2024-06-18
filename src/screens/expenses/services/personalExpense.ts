import axios from 'axios';
import { ExpenseRequest } from '../../../utils/ExpenseRequest';

export const postExpensePersonal = async (expense: ExpenseRequest, token: string, type: string): Promise<string> => {
    const response = await axios.post(
        `https://backenddycgestion-production.up.railway.app/api/gastos/${type}`,
        expense,
        {
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
        }
    );
    const msj: string = response.data.mensaje
    return msj;
}