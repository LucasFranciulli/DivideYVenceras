import axios from 'axios';
import { ApiResponse } from '../../../utils/ApiResponse';

export const login = async (usuario: string, contrasena: string) => {
  try {
    const response = await axios.post<ApiResponse>(
      `http://192.168.1.47:3000/api/auth/login`,
      { usuario, contraseña: contrasena },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export default { login };
