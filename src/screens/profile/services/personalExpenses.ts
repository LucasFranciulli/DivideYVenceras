import axios from "axios";

export const getPersonalExpenses = async (token: string) => {
    try {
        const response = await axios.get(
            `https://backenddycgestion-production.up.railway.app/api/gastos/propios`,
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