import api from './../../../../services/api';

export const getTransportes = async (searchTerm: string ) => {

    const response = await api.get('/CargaTransportes', { params: searchTerm });
    return response.data;
};

export const postTransportFinish = async (id:number) => {
    const response = await api.post(`/CargaTransportes/${id}` );
    return response.data;
}
