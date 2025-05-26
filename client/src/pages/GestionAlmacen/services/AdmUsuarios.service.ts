import api from '../../../services/api';


class AdmUsuariosService {
    async getAlmacenUsuarios(almacenId: number) {
        const response = await api.get(`/AdmAlmacen/usuarios/${almacenId}`);
        return response.data;
    }
    async addUsuarioAlmacen(almacenId: number, userId: number) {
        const response = await api.post(`/AdmAlmacen/usuarios/${almacenId}`, { usuario_id: userId});
        return response.data;
    }
    async getAvailableUsers() {
        const response = await api.get('/AdmAlmacen/usuarios');
        return response.data;
    }
    async removeUsuarioAlmacen( userId: number) {
        const response = await api.delete(`/AdmAlmacen/usuarios/${userId}`);
        return response.data;
    }
}

export default new AdmUsuariosService();
