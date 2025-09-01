import axios from 'axios';

const EXTERNAL_API_URL = 'https://fishnet-api-production.up.railway.app/dashboard';
const TANQUES_API_URL = 'https://fishnet-api-production.up.railway.app/tanque';
const TANQUES_RESUMO_API_URL = 'https://fishnet-api-production.up.railway.app/tanque/resumo';
const TANQUE_ALOJAMENTO_API_URL = 'https://fishnet-api-production.up.railway.app/tanque-alojamento';

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
        const response = await axios.patch(`${TANQUE_ALOJAMENTO_API_URL}/${alojamentoId}/desalojar`);
        return response.data;
    } catch (error) {
        console.error('Erro ao desalojar tanque:', error);
        throw error;
    }
}
