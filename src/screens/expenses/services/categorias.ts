import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from "../../../utils/Category";
import axios from 'axios';

export const getCategorias = async (token: string) => {
  try {
    const response = await axios.get(`https://backenddycgestion-production.up.railway.app/api/categorias`, {
      headers: {
        token: token,
      },
    });
    const allCategories: Category[] = response.data.categorias;

    return allCategories;
  } catch (error: any) {
    console.error('Error al obtener categorías:', error);
    throw new Error(error.response?.data?.message || error.message);
  }
};
