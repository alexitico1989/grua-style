const API_BASE_URL = 'http://192.168.1.4:8000/api/v1';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login/`,
  REGISTER: `${API_BASE_URL}/auth/register/`,
  SOLICITUDES: `${API_BASE_URL}/solicitudes/`,
  PERFIL: `${API_BASE_URL}/perfil/`,
  TARIFAS: `${API_BASE_URL}/tarifas/`,
};

export default API_BASE_URL;