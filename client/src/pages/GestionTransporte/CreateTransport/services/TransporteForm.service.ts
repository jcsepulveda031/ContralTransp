
import api from './../../../../services/api';

export const getTransConductoresSearch = async (cedula: string ) => {

    const response = await api.get( `/CreateTransportes/search/Cond/${cedula}`);
    return response.data;
};

export const getTransVehiculoSearch = async (placa: string) => {
  const response = await api.get(`/CreateTransportes/search/Vehi/${placa}`);
  return response.data;
};

export const getTransAlmacenSearch = async (Codigo: string) => {
  const response = await api.get(`/CreateTransportes/search/Alm/${Codigo}`);
  return response.data;
};
export const getTransIdTransp = async(codigo : string) => {
  const response = await api.get(`/CreateTransportes/search/tra/${codigo}`);
  return response.data;
}

export const deleteTransporte = async (id: number) => {
  const response = await api.delete(`/CreateTransportes/${id}`);
  return response.data;
};
export const getAlmacenesModalSearch = async () => {
  const response = await api.get('/AdmAlmacen');
  return response.data;
};

export const getConductoresModalSearch = async () => {
  const response = await api.get('/AdmConductor');
  return response.data;
};

export const getVehiculosModalSearch = async () => {
  const response = await api.get('/AdmVehiculo');
  return response.data;
};
export const showFinalTrans = async ( ) =>{

  const response = await api.get('/CreateTransportes/search/show');
  return response.data;
 
}