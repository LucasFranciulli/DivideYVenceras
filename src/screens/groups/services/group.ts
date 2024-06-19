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
  console.log('GRUPO CREAR: ', response);
};

export const joinGroupByToken = async (tokenGrupo: string, token: string) => {
  console.log('tokenGrupo: ', tokenGrupo);
  console.log('token: ', token);
  try {
    const response = await axios.post(
      `https://backenddycgestion-production.up.railway.app/api/grupos/addIntegrante/${tokenGrupo}`, {},
      {
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
      },
    );
    console.log('UNIRSE a Grupo: ', response);
    return response.data.message === "Usuario agregado al grupo correctamente";
  } catch (error: any) {
    console.log('error: ', error);
  }
};
