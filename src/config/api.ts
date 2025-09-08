// Configuração da API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://fishnet-api-production.up.railway.app';

// URLs específicas
export const API_ENDPOINTS = {
  TANQUES: `${API_BASE_URL}/tanque`,
  TANQUES_RESUMO: `${API_BASE_URL}/tanque/resumo`,
  ALOJAMENTOS: `${API_BASE_URL}/tanque-alojamento`,
  BIOMETRIAS_DIARIAS: `${API_BASE_URL}/biometria-diaria`,
  BIOMETRIAS_SEMANAIS: `${API_BASE_URL}/biometria-semanal`,
  DASHBOARD: `${API_BASE_URL}/dashboard`,
  AUTH: `${API_BASE_URL}/auth`,
} as const;
