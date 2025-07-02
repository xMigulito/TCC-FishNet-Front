import axios from 'axios';

const EXTERNAL_API_URL = 'http://localhost:3001/dashboard';
const TANQUES_API_URL = 'http://localhost:3001/tanque';
const TANQUES_RESUMO_API_URL = 'http://localhost:3001/tanque/resumo';

export async function fetchDashBoardInfo() {
    try {
        const response = await axios.get(EXTERNAL_API_URL);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchTanques() {
    try {
        const response = await axios.get(TANQUES_API_URL);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export async function fetchResumoTanques() {
    try {
        const response = await axios.get(TANQUES_RESUMO_API_URL);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
