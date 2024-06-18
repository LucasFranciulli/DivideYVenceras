import axios from "axios";

export const deleteExpenseBD = async (token: string, id: number) => {
    try {
        await axios.delete(
            `https://backenddycgestion-production.up.railway.app/api/gastos/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
            }
        );
        return true;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message);
    }
}