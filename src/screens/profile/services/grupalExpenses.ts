import axios from "axios";

export const getgrupalExpenses = async (token: string) => {
    try {
        const response = await axios.get(
            `https://backenddycgestion-production.up.railway.app/api/gastos/grupos`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
            }
        );
        return response.data.gastos;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message);
    }
}