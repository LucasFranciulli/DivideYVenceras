import axios from "axios";
import { GroupRequest } from "../../../utils/GroupRequest";

export const getMyGroups = async (token: string) => {
    const response = await axios.get(
        `https://backenddycgestion-production.up.railway.app/api/grupos/mios`,
        {
          headers: {
            'Content-Type': 'application/json',
            'token': token
          },
        }
    );
    const grupos: GroupRequest[] = response.data.grupos;
    return grupos;
}