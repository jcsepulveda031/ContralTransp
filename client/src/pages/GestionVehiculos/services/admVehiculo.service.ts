import api from '../../../services/api';
import { Vehiculo } from '../../../types/types';


export const getAdminVehiculo = async ( ) => {

    const response = await api.get('/AdmVehiculo');
    console.log(response.data);
    return response.data;
    
}

export const deleteAdminVehiculo = async ( id : number )  => {
    const response = await api.delete(`/AdmVehiculo/${id}`);
    return response.data;
}

export const putAdminVehiculo = async ( id : number, vehiculo: Partial<Vehiculo>) => { 
    const response = await api.put(`/AdmVehiculo/${id}`,vehiculo );
    return response.data;

}

export const postAdminVehiculo = async ( vehiculo: Partial<Vehiculo> ) => { 
    const response = await api.post(`/AdmVehiculo`, {params : vehiculo});
    return response.data;
}
