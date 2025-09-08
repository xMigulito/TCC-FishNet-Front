import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';
const EXTERNAL_API_URL = `${API_BASE_URL}/dashboard`;
const TANQUES_API_URL = `${API_BASE_URL}/tanque`;
const TANQUES_RESUMO_API_URL = `${API_BASE_URL}/tanque/resumo`;
const TANQUE_ALOJAMENTO_API_URL = `${API_BASE_URL}/tanque-alojamento`;
const AUTH_API_URL = `${API_BASE_URL}/auth`;

// Função para obter o token de autenticação
function getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
}

// Configurar axios para incluir o token automaticamente (apenas no cliente)
if (typeof window !== 'undefined') {
    const token = getAuthToken();
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
}

// Interceptor para atualizar o token automaticamente
axios.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para lidar com erros de autenticação
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
            // Token expirado ou inválido
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Funções de autenticação
export async function login(email: string, password: string) {
    try {
        const response = await axios.post(`${AUTH_API_URL}/login`, {
            email,
            password,
        });
        
        const { access_token, user } = response.data;
        
        // Salvar token e dados do usuário (apenas no cliente)
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Atualizar header do axios
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        }
        
        return { access_token, user };
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        throw error;
    }
}

export async function register(email: string, usuario: string, password: string, cooperativaId: number) {
    try {
        const response = await axios.post(`${AUTH_API_URL}/register`, {
            email,
            usuario,
            password,
            cooperativaId,
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        throw error;
    }
}

export function logout() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    }
}

export function getCurrentUser() {
    if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
    return null;
}

export function isAuthenticated(): boolean {
    return !!getAuthToken();
}

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
