import { Request, Response } from 'express';
import ConductorModel from '../models/admConductor.models';
import User from '../models/auth.model';
import bcrypt from 'bcryptjs';

class AdmConductorController {
    static async getAll(req: Request, res: Response): Promise<void>  {
        try {
          const conductores = await ConductorModel.getAll();
          res.status(200).json(conductores);
        } catch (error) {
          res.status(500).json({ message: 'Error al obtener conductores' });
        }
    };

    static async add(req: Request, res: Response): Promise<void> {
        try {
          const newConductor = req.body;
          
      
          // Si no existe, lo crea
          await ConductorModel.add(newConductor);
      
          res.status(201).json({ message: 'Conductor agregado correctamente' });
          
        } catch (error) {
          res.status(500).json({ message: 'Error al crear el conductor, revise que el correo y la cedula no este restrada' });
        }
    };

    static async update(req: Request, res: Response): Promise<void>  {
        try {
          const { cedula } = req.params;
          const updatedConductor = req.body;
          await ConductorModel.update(cedula, updatedConductor);
          res.status(200).json({ message: 'Conductor actualizado correctamente' });
        } catch (error) {
          res.status(500).json({ message: 'Error al actualizar conductor' });
        }
    };

    static async deleteConductor (req: Request, res: Response): Promise<void> {
        try {
          const id = parseInt(req.params.id);
          await ConductorModel.delete(id);
    
          res.status(200).json({ message: 'Conductor eliminado correctamente' });
        } catch (error) {
          res.status(500).json({ message: 'Error al eliminar conductor' });
        }
    };

    static async crearUsuarioDriver (req: Request, res: Response): Promise<void> { 
      const {id,nombre,telefono,email} = req.body.params
      try {
        const userExists = await User.findByUsername(req.body.userUname);
        console.log(userExists)
        if (userExists.length > 0) {
          res.status(200).json({ status: 400, message: 'El nombre de usuario ya existe', field: 'username' });
          return;
        }
        const  username  = req.body.userUname;
        const originalPassword = req.body.password; // Guardamos la contraseña original
        const hashedPassword = await bcrypt.hash(originalPassword, 10);
        const newUser = { 
          username, 
          email, 
          name: nombre, 
          age: 18, 
          phone: telefono,
          password: hashedPassword,
          original_password: originalPassword, // Agregamos el campo para la contraseña original
          role: 'driver'
        };

        await ConductorModel.UpdateUserDriver(id, newUser);
      
        res.status(201).json({ 
          status: 201, 
          message: 'Usuario registrado exitosamente',
          credentials: {
            username: username,
            password: originalPassword
          }
        });

      } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error en el servidor' });
      }
    }
    static async getUserForConductor (req: Request, res: Response): Promise<void> {
      const { user_id } = req.params;
      const user = await ConductorModel.getUserForConductor(parseInt(user_id));
      
      if(user.length > 0){
        // Incluimos las credenciales en la respuesta
        const userData = {
          ...user[0],
          credentials: {
            username: user[0].username,
            password: user[0].password
          }
        };
        res.status(200).json(userData);
      }else{
        res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
      }
    }
  } 

export default AdmConductorController;









