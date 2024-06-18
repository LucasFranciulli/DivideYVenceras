import axios from 'axios';
import { Tag } from '../../../utils/Tag';
import { ApiResponse } from '../../../utils/ApiResponse';

export const postTag = async (newTag: Tag, token: string) => {
    const response = await axios.post<ApiResponse>(
        'https://backenddycgestion-production.up.railway.app/api/tags',
        newTag,
        {
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
        }
    );
    return response.data;
}

export const getMyTags = async (token: string) => {
  const response = await axios.get(
      'https://backenddycgestion-production.up.railway.app/api/tags/mios',
      {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
      }
  );
  const tags: Tag[] = response.data.tags;
  return tags;
}

export const getMyTagsGroups = async (token: string, idGrupo: number) => {
  const response = await axios.get(
      `https://backenddycgestion-production.up.railway.app/api/tags/grupo/${idGrupo}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
      }
  );
  const tags: Tag[] = response.data.tags;
  return tags;
}

