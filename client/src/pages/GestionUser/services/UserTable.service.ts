import api from './../../../services/api';
import { UserTableInfo } from '../../../types/types';
export const getUser = async (searchTerm: string ) => {

    const response = await api.get('/UserInfo', { params: searchTerm });
    
    return response.data;
};

export const postUserRoleInfo = async (id: number, User: Partial<UserTableInfo>) => {
    const response = await api.post(`/UserInfo/${id}`, {params: User});
    
    return response.data;
}
