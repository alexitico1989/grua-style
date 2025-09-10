export const authService = {
  login: async (username, password) => {
    try {
      console.log('API URL:', API_ENDPOINTS.LOGIN);
      console.log('Datos enviados:', { username, password });
      
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });
      
      console.log('Respuesta exitosa:', response.data);
      return response.data;
    } catch (error) {
      console.log('Error detallado:', error.response?.data);
      console.log('Status code:', error.response?.status);
      console.log('URL intentada:', error.config?.url);
      throw error;
    }
  },
};