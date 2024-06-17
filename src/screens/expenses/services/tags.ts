import axios from 'axios';
import { Tag } from '../../../utils/Tag';
import { ApiResponse } from '../../../utils/ApiResponse';

const postTag = async (newTag: Tag, token: string) => {
    const response = await axios.post<ApiResponse>(
        'http://192.168.1.47:3000/api/tags',
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