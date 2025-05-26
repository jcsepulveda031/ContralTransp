import api from './../../../services/api';

export const getDiverHistoryTransporte = async ( id:number ) => {  
    const response = await api.get(`/Driver/History/${id}`)
    return response.data;
}
export const getDiverHistoryTransporteById = async ( id:number ) => {  
    const response = await api.get(`/Driver/History/show/${id}`)
    return response.data;
}

