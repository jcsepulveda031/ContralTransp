import api from './../../../../services/api';

export const getCarga = async (params: { transporte_id: string | number }) => {
    
    const response = await api.get('/CargaInfoDatos', { params });
    return response.data;
  };

export const  AsignarCarga = async ( id: number,  transporteId: string, userId: number )  => { 

    await api.put(`/CargaInfoDatos/${id}`);

    // 2. Registrar en transp_conte_info
    const cargaTransporte = {
      zona_id: id,
      transp_id: transporteId, 
      estado: 'CARGADA',
      user_id: userId
  };

  await api.post('/CargaInfoDatos', cargaTransporte);

  return { success: true };
} 
export const getInfoCarga = async (id: string ) => { 
 
  const response =  await api.get(`/CargaInfoDatos/detalle/${id}`);
  return response.data;
}

export const deleteInfoCarga = async (id: number, ) => {
  console.log(id)
  const response = await api.delete(`/CargaInfoDatos/del/details/${id}` );
  return response.data;
}
export const deleteInfoCargaZona = async (id: number, ) => {
  console.log(id)
  const response = await api.delete(`/CargaInfoDatos/del/zona/${id}` );
  return response.data;
}