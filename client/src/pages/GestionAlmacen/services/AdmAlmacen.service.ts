import api from '../../../services/api';
import { Almacen, Ubicacion } from '../../../types/types';

export const getAdminAlmacenes = async ( ) => {

    try {
        const response = await api.get('/AdmAlmacen');
        return response.data;
    } catch (error) {
        console.error('Error al obtener almacenes:', error);
        throw error;
    }
    
};

export const getAdminAlmacenesName = async (searchTerm: string ) => {

    const response = await api.get(`/AdmAlmacen/search?nombre=${searchTerm}`);
    return response.data;  
}

export const postAlmacen =  async (almacen: Omit<Almacen, 'id'> ) => {
    const response = await api.post(`/AdmAlmacen`,almacen );
    return response.data;  
}

export const putAlmacen =  async (id: number , almacen: Partial<Almacen> ) => {
    const response = await api.put(`/AdmAlmacen/${id}`,almacen );
    return response.data;  
}

export const deleteAlmacen =  async (id: number ) => {
    const response = await api.delete(`/AdmAlmacen/${id}`);
    return response.data;  
}

export const  showFinalAlmacen = async ( )=> {
    try {
        const response = await api.get('/AdmAlmacen/show');
        return response.data;
    } catch (error) {
        console.error('Error al obtener El id del Almacen:', error);
        throw error;
    } 
}
export const getUbicaciones = async (almacenId: number) => {
    const response = await api.get(`/AdmAlmacen/ubicaciones/${almacenId}`);
    return response.data;
}   

export const postUbicacion = async (ubicacion: Ubicacion) => {
    console.log(ubicacion);
    const response = await api.post(`/AdmAlmacen/ubicaciones`, ubicacion);
    return response.data;
}

export const putUbicacion = async (id: number, ubicacion: Ubicacion) => {
    const response = await api.put(`/AdmAlmacen/ubicaciones/${id}`, ubicacion);
    return response.data;
}

export const deleteUbicacion = async (id: number) => {
    const response = await api.delete(`/AdmAlmacen/ubicaciones/${id}`);
    return response.data;
}


