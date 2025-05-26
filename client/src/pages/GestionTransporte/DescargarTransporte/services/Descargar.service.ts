import api from './../../../../services/api';

class DescargarService {
    async getTransportes(searchTerm: string ) {
        const response = await api.get('/DescargarTransporte', { params: searchTerm });
        return response.data;
    }
    async finishCarga(id: number) {
        const response = await api.post(`/DescargarTransporte/FinishDescarga/${id}`);
        return response.data;
    }
    async getInfoCarga(id: number) {
        const response = await api.get(`/DescargarTransporte/InfoCarga/${id}`);
        return response.data;
    }
    async getAll(id: number)   {    
        const response = await api.get(`/DescargarTransporte/getAll/${id}`);
        return response.data;
    }
    async descargarCarga(id: number, zona_id: number, user_id: number) {
        const response = await api.post(`/DescargarTransporte/descargarCarga/${id}/${zona_id}`, {params: user_id });
        return response.data;
    }
    async getInfoID(id: number) {
        const response = await api.get(`/DescargarTransporte/InfoID/${id}`);
        return response.data;
    }
}

export default new DescargarService();
