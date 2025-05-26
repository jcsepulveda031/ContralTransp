

import pool from '../utils/db';

class UserModel {
    static async getUserInfo(nombre_usuario: string) {
        const [result] = await pool.query('SELECT id,username, email, name,age, phone FROM users WHERE username = ?', [nombre_usuario]);
        return result;
    }
    static async updateUserInfo( info: any) {
        const {id, name, email, age, phone} = info;
        const [result] = await pool.query('UPDATE users SET name = ?, email = ?, age = ?, phone = ? WHERE id = ?', [name, email, age, phone, id]);
        return result;
    }
    static async changePassword(id: number, password: string) {
        const [result] = await pool.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
        return result;
    }
    static async changePhoto(id: number, photo: string) {
        const [result] = await pool.query('UPDATE users SET photo = ? WHERE id = ?', [photo, id]);
        return result;
    }
}

export default UserModel;
