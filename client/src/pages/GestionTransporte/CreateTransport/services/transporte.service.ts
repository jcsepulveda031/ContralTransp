import { Transporte } from '../../../../types/types';
import api from './../../../../services/api';

export const getTransportes = async ( ) => {
  const response = await api.get('/CreateTransportes');
  return response.data;
};

export const getTransportesId = async (id: number ) => {
  const response = await api.get(`/CreateTransportes/${id}` );
  return response.data;
};

export const createTransporte = async (transporte: Omit<Transporte, 'id' | 'fecha_creacion' | 'hora_creacion' | 'estado'>) => {
  const response = await api.post('/CreateTransportes', transporte);
  return response.data;
};

export const updateTransporte = async (id: number, transporte: Partial<Transporte>) => {
  const response = await api.put(`/CreateTransportes/${id}`, transporte);
  return response.data;
};

export const deleteTransporte = async (id: number) => {
  const response = await api.delete(`/CreateTransportes/${id}`);
  return response.data;
};

