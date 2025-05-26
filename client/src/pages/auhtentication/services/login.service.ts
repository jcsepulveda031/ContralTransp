import api from '../../../services/api';
import { AuthUser } from '../../../types/types';

export const postLogin = async (User: Partial<AuthUser> ) => {

    const response = await api.post('/auth/login', User);
    return response.data;
 

};