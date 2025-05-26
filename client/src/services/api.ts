import axios from 'axios';

// Configuración base de la API
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ajusta según tu configuración del backend
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo de errores HTTP
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      const status = error.response.status;
      let errorMessage = 'Ocurrió un error';

      switch (status) {
        case 400:
          errorMessage = 'Solicitud incorrecta';
          break;
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error ${status}`;
      }

      if (error.response.data && error.response.data.message) {
        errorMessage += `: ${error.response.data.message}`;
      }

      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      return Promise.reject(new Error('No se recibió respuesta del servidor'));
    } else {
      // Algo sucedió al configurar la solicitud
      return Promise.reject(new Error('Error al configurar la solicitud'));
    }
  }
);

export default api;