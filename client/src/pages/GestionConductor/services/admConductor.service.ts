import api from '../../../services/api';
import { Conductor } from '../../../types/types';

export const getAdminConductor = async ( ) => {

    try {
        const response = await api.get('/AdmConductor');
        return response.data;
    } catch (error) {
        console.error('Error al obtener Conductores:', error);
        throw error;
    }
    
};

export const putAdminConductor = async ( cedula: string, conductor: Partial<Conductor>  ) => {

    const response = await api.put(`/AdmConductor/${cedula}`,{params : conductor});
    return response.data;

}

export const postAdminConductor = async ( conductor: Partial<Conductor> ) => {

    const response = await api.post(`/AdmConductor`, {params : conductor});
    return response.data;
}

export const deleteAdminConductor = async (id : number ) => {

    const response = await api.delete(`/AdmConductor/${id}`);
    return response.data;
}
export const createUserForConductor = async (userUname: string, password:string, conductor: Partial<Conductor> ) => {

    const response = await api.post(`/AdmConductor/crear-usuario`, { params: conductor, userUname, password });
    return response.data;
    ;

}
export const getUserForConductor = async (user_id: number) => {

    const response = await api.get(`/AdmConductor/obtener-usuario/${user_id}`);
    
    return response.data;
};
