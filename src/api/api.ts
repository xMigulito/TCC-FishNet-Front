import axios from 'axios';
import { cache, createCacheConfig, CACHE_KEYS } from '../utils/cache';

const API_BASE_URL = 'https://fishnet-api-production.up.railway.app';
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
        // Limpar cache ao fazer logout
        cache.clear();
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

export async function fetchDashBoardInfo(forceRefresh: boolean = false) {
    try {
        // Verificar cache primeiro (se não for refresh forçado)
        if (!forceRefresh) {
            const cachedData = cache.get(createCacheConfig(CACHE_KEYS.DASHBOARD));
            if (cachedData) {
                console.log('📦 Dados do dashboard carregados do cache');
                return cachedData;
            }
        }

        console.log('🌐 Buscando dados do dashboard da API...');
        const response = await axios.get(EXTERNAL_API_URL);
        
        // Salvar no cache
        cache.set(createCacheConfig(CACHE_KEYS.DASHBOARD), response.data);
        
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        throw error;
    }
}

export async function fetchTanques(forceRefresh: boolean = false) {
    try {
        // Verificar cache primeiro (se não for refresh forçado)
        if (!forceRefresh) {
            const cachedData = cache.get(createCacheConfig(CACHE_KEYS.TANQUES));
            if (cachedData) {
                console.log('📦 Dados dos tanques carregados do cache');
                return cachedData;
            }
        }

        console.log('🌐 Buscando tanques da API...');
        const response = await axios.get(TANQUES_API_URL);
        
        // Salvar no cache
        cache.set(createCacheConfig(CACHE_KEYS.TANQUES), response.data);
        
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar tanques:', error);
        throw error;
    }
}

export async function fetchResumoTanques(forceRefresh: boolean = false) {
    try {
        // Verificar cache primeiro (se não for refresh forçado)
        if (!forceRefresh) {
            const cachedData = cache.get(createCacheConfig(CACHE_KEYS.TANQUES_RESUMO));
            if (cachedData) {
                console.log('📦 Resumo dos tanques carregado do cache');
                return cachedData;
            }
        }

        console.log('🌐 Buscando resumo dos tanques da API...');
        const response = await axios.get(TANQUES_RESUMO_API_URL);
        
        // Salvar no cache
        cache.set(createCacheConfig(CACHE_KEYS.TANQUES_RESUMO), response.data);
        
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar resumo dos tanques:', error);
        throw error;
    }
}

export async function fetchAlojamentos(forceRefresh: boolean = false) {
    try {
        // Verificar cache primeiro (se não for refresh forçado)
        if (!forceRefresh) {
            const cachedData = cache.get(createCacheConfig(CACHE_KEYS.ALOJAMENTOS));
            if (cachedData) {
                console.log('📦 Dados dos alojamentos carregados do cache');
                return cachedData;
            }
        }

        console.log('🌐 Buscando alojamentos da API...');
        const response = await axios.get(TANQUE_ALOJAMENTO_API_URL);
        
        // Salvar no cache
        cache.set(createCacheConfig(CACHE_KEYS.ALOJAMENTOS), response.data);
        
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar alojamentos:', error);
        throw error;
    }
}

export async function fetchBiometriasDiarias(forceRefresh: boolean = false) {
    try {
        // Verificar cache primeiro (se não for refresh forçado)
        if (!forceRefresh) {
            const cachedData = cache.get(createCacheConfig(CACHE_KEYS.BIOMETRIAS_DIARIAS));
            if (cachedData) {
                console.log('📦 Biometrias diárias carregadas do cache');
                return cachedData;
            }
        }

        console.log('🌐 Buscando biometrias diárias da API...');
        const response = await axios.get(`${API_BASE_URL}/biometria-diaria`);
        
        // Salvar no cache
        cache.set(createCacheConfig(CACHE_KEYS.BIOMETRIAS_DIARIAS), response.data);
        
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar biometrias diárias:', error);
        throw error;
    }
}

export async function fetchBiometriasSemanais(forceRefresh: boolean = false) {
    try {
        // Verificar cache primeiro (se não for refresh forçado)
        if (!forceRefresh) {
            const cachedData = cache.get(createCacheConfig(CACHE_KEYS.BIOMETRIAS_SEMANAIS));
            if (cachedData) {
                console.log('📦 Biometrias semanais carregadas do cache');
                return cachedData;
            }
        }

        console.log('🌐 Buscando biometrias semanais da API...');
        const response = await axios.get(`${API_BASE_URL}/biometria-semanal`);
        
        // Salvar no cache
        cache.set(createCacheConfig(CACHE_KEYS.BIOMETRIAS_SEMANAIS), response.data);
        
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar biometrias semanais:', error);
        throw error;
    }
}

export async function desalojarTanque(alojamentoId: number) {
    try {
        const response = await axios.patch(`${TANQUE_ALOJAMENTO_API_URL}/${alojamentoId}/desalojar`);
        
        // Invalidar cache relacionado a alojamentos
        cache.invalidateOnInsert('alojamento');
        
        return response.data;
    } catch (error) {
        console.error('Erro ao desalojar tanque:', error);
        throw error;
    }
}

// Função para forçar refresh de todos os dados
export async function refreshAllData() {
    console.log('🔄 Forçando refresh de todos os dados...');
    
    try {
        const [dashboard, tanques, resumoTanques, alojamentos, biometriasDiarias, biometriasSemanais] = await Promise.all([
            fetchDashBoardInfo(true),
            fetchTanques(true),
            fetchResumoTanques(true),
            fetchAlojamentos(true),
            fetchBiometriasDiarias(true),
            fetchBiometriasSemanais(true)
        ]);

        return {
            dashboard,
            tanques,
            resumoTanques,
            alojamentos,
            biometriasDiarias,
            biometriasSemanais
        };
    } catch (error) {
        console.error('Erro ao fazer refresh dos dados:', error);
        throw error;
    }
}

// Função para verificar status do cache
export function getCacheStatus() {
    const keys = Object.values(CACHE_KEYS);
    const status: Record<string, any> = {};
    
    keys.forEach(key => {
        status[key] = cache.getCacheInfo(key);
    });
    
    return status;
}
