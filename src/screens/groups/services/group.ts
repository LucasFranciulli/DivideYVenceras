import axios from 'axios';
import {GrupoByID} from '../../../utils/GroupById';

export const getGroupById = async (id: number, token: string) => {
  const response = await axios.get(
    `https://backenddycgestion-production.up.railway.app/api/grupos/${id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
    },
  );
  const grupos: GrupoByID = response.data;
  return grupos;
};

export const createGroup = async (
  name: string,
  description: string,
  limit: number,
  color: string,
  token: string,
) => {
  const response = await axios.post(
    `https://backenddycgestion-production.up.railway.app/api/grupos`,
    {
      nombre: name,
      descripcion: description,
      limite_gasto: limit,
      color: color,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
    },
  );
};

export const joinGroupByToken = async (tokenGrupo: string, token: string) => {
  try {
    const response = await axios.post(
      `https://backenddycgestion-production.up.railway.app/api/grupos/addIntegrante/${tokenGrupo}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
      },
    );
    return response.data.message === 'Usuario agregado al grupo correctamente';
  } catch (error: any) {
    console.log('error: ', error);
  }
};

export const leaveGroup = async (groupId: number, token: string) => {
  try {
    const response = await axios.post(
      `https://backenddycgestion-production.up.railway.app/api/grupos/removeIntegrante/${groupId}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
      },
    );
    return response.data.message === 'Usuario agregado al grupo correctamente';
  } catch (error: any) {
    console.log('error: ', error);
  }
};
