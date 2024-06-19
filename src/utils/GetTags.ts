import { getMyTags } from "../screens/expenses/services/tags";
import { Tag } from "./Tag";

export const getTags = async (id_tag: number, token: string) => {
  const tags: Tag[] = await getMyTags(token);
  const tag = tags.find(cat => cat.id === id_tag);
  return tag ? tag.nombre : '';
};
