import axios from 'axios';
import { Tag } from '../../../utils/Tag';
import { ApiResponse } from '../../../utils/ApiResponse';

const postTag = async (newTag: Tag, token: string) => {
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