import pool from '../utils/db';
import { UserTableInfo } from '../interfaces/IUser';

class UserInfoModel {
    static async getUserInfo(filters: any = {}){ 
        let  sql = `SELECT id, username, name, email, age, phone, role FROM users` 
        const params = [];

        if (filters.transporte_id) {
            sql += ` WHERE ( username LIKE ? or name LIKE ?)`;  
        params.push(filters.transporte_id);   
        }

        const [rows] = await pool.query(sql, params);
        return rows;

    }
    static async postUserRoleInfo(User: UserTableInfo){
        const { id,role } = User.params;
        const sql = 'UPDATE users SET role = ? where id = ?'
        const [rows] = await pool.query(sql, [role,id]);
        return rows;

    }
}

export default UserInfoModel;