import api from '../../../../services/api';

class InventarioService {
    

    async getPickingLocations(id: string) {
        const response = await api.get(`/Inventario/${id}`);
        return response.data;
    }
    async getZonaCarga(id: string) {
        const response = await api.get(`/Inventario/zonaCarga/${id}`);
        return response.data;
    }

    async moveToLoadingZone(unidadId: number, cantidad: number) {
        const response = await api.post('/Inventario/moveToLoadingZone', { unidadId, cantidad });
        return response.data;
    }

    async moveToPickingLocation(unidadId: number, cantidad: number, ubicacionId: number,zonaUnidadId: number) {
        const response = await api.post('/Inventario/moveToPickingLocation', { unidadId, cantidad, ubicacionId,zonaUnidadId });
        return response.data;
    }

    async moveToPickingLocationZone(movimiento: any) {
        const response = await api.post('/Inventario/moveToPickingLocationZone', movimiento);
        return response.data;
    }

    async createMovimientoStock(movimiento: any) {
        console.log('Prueba de movimiento',movimiento);
        const response = await api.post('/Inventario/UbicationToUbication',  movimiento);
        return response.data;
    }
}

export default new InventarioService();
