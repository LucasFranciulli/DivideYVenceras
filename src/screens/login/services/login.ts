import axios from 'axios';
import {ApiResponse} from '../../../utils/ApiResponse';

const URL = 'https://backenddycgestion-production.up.railway.app';

export const login = async (usuario: string, contrasena: string) => {
  try {
    const response = await axios.post<ApiResponse>(
      `${URL}/api/auth/login`,
      {usuario: usuario, contraseña: contrasena},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    console.log('error: ', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

export default {login};
