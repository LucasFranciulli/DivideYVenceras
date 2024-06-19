import {getCategorias} from '../screens/expenses/services/categorias';
import {Category} from './Category';

export const getCategory = async (id_categoria: number, token: string) => {
  const categorias: Category[] = await getCategorias(token);
  const category = categorias.find(cat => cat.id === id_categoria);
  return category ? category.nombre : '';
};
