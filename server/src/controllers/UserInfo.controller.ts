import { Request, Response } from 'express';
import UserInfoModel from '../models/UserInfo.models';
class UserInfoController {

    static async getUserInfo(req: Request, res: Response): Promise<void>  {
        try {
            
            const response = await UserInfoModel.getUserInfo(req.query);
            res.status(200).json({status: 'OK', data: response })
        } catch (error) {
            res.status(200).json({status: 'ERROR', data: 'Error al Obtener los usuarios ' })
        }
    }
    static async posUserRoleInfo(req: Request, res: Response): Promise<void>  { 
        try {
            
            const updUser = req.body;
            const response = await UserInfoModel.postUserRoleInfo(updUser);
            res.status(200).json({status: 'OK', data: response })
        } catch (error) {
            res.status(200).json({status: 'ERROR', data: 'Error al Obtener los usuarios ' })
        }
    }

};

export default UserInfoController;