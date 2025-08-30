import axios from 'axios';

const EXTERNAL_API_URL = 'http://localhost:3001/dashboard';
const TANQUES_API_URL = 'http://localhost:3001/tanque';
const TANQUES_RESUMO_API_URL = 'http://localhost:3001/tanque/resumo';

export async function fetchDashBoardInfo() {
    try {
        const response = await axios.get(EXTERNAL_API_URL);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        throw error;
    }
}

export async function fetchTanques() {
    try {
        const response = await axios.get(TANQUES_API_URL);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar tanques:', error);
        throw error;
    }
}

export async function fetchResumoTanques() {
    try {
        const response = await axios.get(TANQUES_RESUMO_API_URL);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar resumo dos tanques:', error);
        throw error;
    }
}

export async function desalojarTanque(alojamentoId: number) {
    try {
        const response = await axios.patch(`${TANQUES_API_URL.replace('/tanque', '/tanque-alojamento')}/${alojamentoId}/desalojar`);
        return response.data;
    } catch (error) {
        console.error('Erro ao desalojar tanque:', error);
        throw error;
    }
}
