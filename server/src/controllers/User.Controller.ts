import UserModel from "../models/users.models";
import User from "../models/auth.model";
import bcrypt from "bcryptjs";
import { Request, Response } from 'express';


class UserController {
    async getUserInfo(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const user = await UserModel.getUserInfo(id);
            if (!user) {
                return res.status(200).json({ status: false, message: 'Usuario no encontrado' });
            }
            res.json({ status: true, data: user });
        } catch (error) {
            res.status(200).json({ status: false, message: 'Error al obtener la información del usuario' });
        }
    }   
    async updateUserInfo(req: Request, res: Response) {
        const  info  = req.body.params;
        try {
            const user = await UserModel.updateUserInfo( info);
            res.json({status: true, message: 'Información actualizada correctamente'});
        } catch (error) {
            res.status(200).json({ message: 'Error al actualizar la información del usuario' });
        }
    }
    async changePassword(req: Request, res: Response) {
        const {  password } = req.body;
        const id = req.params.id;
        console.log(id,password);

        try {

            if(password.nueva !== password.confirmar){
                res.status(200).json({ status: false, message: 'Las contraseñas no coinciden' });
                return;
            }

            // Buscar el usuario por id
            const user: any = await User.findById(id);
            console.log(user);
            if (!user) {
                console.log(user.password);
                res.status(200).json({ status: false, message: 'Usuario o contraseña incorrecta- usuarios' });
                return;
            }
            console.log(user.password);
            // Comparar la contraseña
            const isPasswordValid = await bcrypt.compare(password.actual, user.password);
            if (!isPasswordValid) {
                res.status(200).json({ status: false, message: 'Usuario o contraseña incorrecta' });
                return;
            }

            const hashedPassword = await bcrypt.hash(password.nueva, 10);
            console.log(hashedPassword);
            await UserModel.changePassword(Number(id), hashedPassword);

            res.json({status: true, message: 'Contraseña cambiada correctamente'});
        } catch (error) {
            res.status(200).json({ message: 'Error al cambiar la contraseña' });
        }
    }
    async changePhoto(req: Request, res: Response) {
        const { id, photo } = req.body;
        try {
            const user = await UserModel.changePhoto(id, photo);
            res.json({status: true, message: 'Foto cambiada correctamente'});
        } catch (error) {
            res.status(200).json({ message: 'Error al cambiar la foto del usuario' });
        }
    }
}

export default new UserController();