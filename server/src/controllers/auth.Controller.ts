import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/auth.model';
import nodemailer from 'nodemailer';

// import { sendMail } from '../utils/mailer'; // <-- Implementa esta función según tu sistema de correo

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jcsepulveda031@gmail.com',
        pass: 'npxy qmhe rlgs smry',
    },
});

class Authentication {

    static async register(req: Request, res: Response): Promise<void> { 
        
        const { username, email, name, age, role, phone, password } = req.body;
        try {
            console.log(req.body)
            // Verificar si el usuario ya existe
            const userExists = await User.findByUsername(username);
            console.log(userExists);
            if (userExists.length > 0) {
                res.status(200).json({ status: 400, message: 'El nombre de usuario ya existe', field: 'username' });
                return;
            }
            console.log('Usuario bien')

            // Verificar si el email ya existe
            const emailExists = await User.findByEmail(email);
            if (emailExists.length > 0) {
                res.status(200).json({ status: 400, message: 'El email ya está registrado', field: 'email' });
                return
            }
            console.log('password bien')
            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Crear el nuevo usuario
            const newUser = {
                username,
                email,
                name,
                age,
                phone,
                password: hashedPassword,
                role: role, // Rol por defecto
            };

            // Guardar el usuario en la base de datos
            await User.create(newUser);

            res.status(201).json({ status: 201, message: 'Usuario registrado exitosamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500, message: 'Error en el servidor' });
        }
    }

    static async Login(req: Request, res: Response): Promise<void>  {  
        const { username, password } = req.body;

        try {
            // Buscar el usuario por nombre de usuario
            const user = await User.findByUsername(username);
            if (user.length === 0) {
                res.status(400).json({ message: 'Usuario o contraseña incorrecta- usuarios' });
                return;
            }

            // Comparar la contraseña
            const isPasswordValid = await bcrypt.compare(password, user[0].password);
            if (!isPasswordValid) {
                res.status(400).json({ message: 'Usuario o contraseña incorrecta' });
                return;
            }


            // Generar un token JWT
            const expiresIn = 3600;
            const token = jwt.sign( {   id: user[0].id, username: user[0].username, role: user[0].role },
                                        process.env.JWT_SECRET!, { expiresIn: expiresIn });
            
            const userData = {
                id: user[0].id,
                nombre_usuario: user[0].username,
                rol: user[0].role,
            };
            
            // Enviar el token como respuesta
            res.status(200).json({ 
                token, 
                user: userData,
                expiresIn 
            });
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error en el servidor' });
        }

    }

    static async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        try {
            const user = await User.findByEmail(email);
            if (user.length === 0) {
                res.status(200).json({ status: false, message: 'Email no encontrado' });
                return;
            }
            const code = generateCode();
            const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
            await User.updateResetToken(email, code, expires);

            await Authentication.sendMail(email, 'Código de recuperación', `Tu código es: ${code}`);

            res.status(200).json({ status: true, message: 'Código enviado al correo' });
        } catch (error) {
            console.error(error);
            res.status(200).json({ status: false, message: 'Error en el servidor' });
        }
    }
    static async sendMail(email: string, subject: string, text: string): Promise<void> {
        await transporter.sendMail({
            from: 'jcsepulveda031@gmail.com',
            to: email,
            subject,
            text,
        });
    }
    static async verifyResetCode(req: Request, res: Response): Promise<void> {
        const { email, code } = req.body;
        const user = await User.findByEmail(email);
        if (user.length === 0) {
            res.status(200).json({ status: false, message: 'Email no encontrado' });
            return;
        }
        const dbCode = user[0].reset_token;
        const expires = user[0].reset_token_expires;
    
        if (!dbCode || dbCode !== code) {
            res.status(200).json({ status: false, message: 'Código incorrecto' });
            return;
        }
        if (!expires || new Date() > new Date(expires)) {
            res.status(200).json({ status: false, message: 'Código expirado' });
            return;
        }
        res.status(200).json({ status: true, message: 'Código válido' });
    }

    static async resetPassword(req: Request, res: Response): Promise<void> {
        const { email, code, newPassword, confirmPassword } = req.body;
        console.log(req.body)
        const user = await User.findByEmail(email);
        
        if (user.length === 0) {
            res.status(200).json({ status: false, message: 'Email no encontrado' });
            return;
        }
        if (newPassword !== confirmPassword) {
            res.status(200).json({ status: false, message: 'Las contraseñas no coinciden' });
            return;
        }
        
        const hashed = await bcrypt.hash(newPassword, 10);
        await User.changePassword(user[0].id as string, hashed);
        await User.updateResetToken(email, null, null);
        res.status(200).json({ status: true, message: 'Contraseña actualizada' });
    }

    static async resendResetCode(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        const user = await User.findByEmail(email);
        if (user.length === 0) {
            res.status(200).json({ status: false, message: 'Email no encontrado' });
            return;
        }
        const code = generateCode();
        const expires = new Date(Date.now() + 10 * 60 * 1000);
        await User.updateResetToken(email, code, expires);
        await Authentication.sendMail(email, 'Código de recuperación', `Tu nuevo código es: ${code}`);
        res.status(200).json({ status: true, message: 'Nuevo código enviado' });
    }
}

export default Authentication;
