import api from './../../../../services/api';

class HistorialService {
    async getHistorial() {
        const response = await api.get('/TransporteHistorial');
        return response.data;
    }
}

export default new HistorialService();

