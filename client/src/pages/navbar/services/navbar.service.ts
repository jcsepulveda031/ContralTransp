import api from '../../../services/api';


class NavbarService {
    async getAlarms(username: string) {
        const response = await api.get(`/alarms/${username}`);
        return response.data;
    }

    async getProfileImage(id: string) {
        const response = await api.get(`/users/${id}/profile-image`);
        return response.data;
    }

    async updateInfo(info: any) {
        console.log(info);
        const response = await api.put('/users', {params: info});
        return response.data;
    }

    async changePassword(password: any, id: number) {
        const response = await api.put(`/users/change-password/${id}`, {password: password});
        return response.data;
    }

    async changePhoto(selectedFile: any) {
        const response = await api.post('/users/change-photo', selectedFile);
        return response.data;
    }

    async getUserInfo(id: string) {
        const response = await api.get(`/users/${id}`);
        return response.data;
    }

}   

export default new NavbarService();