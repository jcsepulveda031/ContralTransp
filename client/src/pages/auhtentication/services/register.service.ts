import api from '../../../services/api';
import { AxiosError } from 'axios';
import { AuthRegister } from '../../../types/types';

export const fecthRegister = async (User: Partial<AuthRegister> ) => {

    const response = await api.post('/auth/registro', User);
    console.log(response);
    return response;
};