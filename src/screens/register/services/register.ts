import axios, { AxiosError } from 'axios';
import { ApiResponse } from '../../../utils/ApiResponse';
import { User } from '../../../utils/User';

export const register = async (newUser: User) => {
  try {
    const response = await axios.post<ApiResponse>(
        'https://backenddycgestion-production.up.railway.app/api/usuarios',
        {
            usuario: newUser.nombre_usuario,
            nombre: newUser.nombre,
            apellido: newUser.apellido,
            email: newUser.email,
            contraseña: newUser.contraseña,
        },
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

export default { register };
