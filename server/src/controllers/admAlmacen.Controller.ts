import { Request, Response } from 'express';
import AdministarAlmance from '../models/admAlmacen.models';

class AdministarAlmanceController {

    static async getAll(req: Request, res: Response): Promise<void> {
        try {

            const almacenes = await AdministarAlmance.getAll();
            res.json(almacenes);
        } catch (error) {
            console.error('Error en getAll:', error); // Log completo del error
        
            // Mejor manejo de errores
            if (error instanceof Error) {
                res.status(500).json({ 
                    message: 'Error al obtener almacenes',
                    error: error.message,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                });
            } else {
                res.status(500).json({ message: 'Error desconocido al obtener almacenes' });
            }
        }
      };
      static async searchByName(req: Request, res: Response): Promise<void> {
        try {
          const almacenes = await AdministarAlmance.getByName(req.query.nombre as string);
          res.json(almacenes);
        } catch (error) {
          if (error instanceof Error) {
            res.status(500).json({ message: error.message });
          } else {
            res.status(500).json({ message: 'Ocurrió un error desconocido' });
          }
        }
      };
      static async add(req: Request, res: Response): Promise<void> {
        try {
          const id = await AdministarAlmance.add(req.body);
          res.status(201).json({ id, ...req.body });
        } catch (error) {
          if (error instanceof Error) {
            res.status(500).json({ message: error.message });
          } else {
            res.status(500).json({ message: 'Ocurrió un error desconocido' });
          }
        }
      };
      static async update(req: Request, res: Response): Promise<void> {
        try {
          await AdministarAlmance.update(parseInt(req.params.id), req.body);
          res.json({ id: req.params.id, ...req.body });
        } catch (error) {
          if (error instanceof Error) {
            res.status(500).json({ message: error.message });
          } else {
            res.status(500).json({ message: 'Ocurrió un error desconocido' });
          }
        }
      };
      static async delete(req: Request, res: Response): Promise<void> {
        try {
          await AdministarAlmance.delete(parseInt(req.params.id));
          res.json({ message: 'Almacén eliminado' });
        } catch (error) {
          if (error instanceof Error) {
            res.status(500).json({ message: error.message });
          } else {
            res.status(500).json({ message: 'Ocurrió un error desconocido' });
          }
        }
      };
      static async showFinalId(req: Request, res: Response): Promise<void> {
        try {
          const id = await AdministarAlmance.showFinalId();
            res.status(201).json({ id });
        } catch (error) {
          res.status(500).json({ message: 'Ocurrió un error desconocido' });
        }
      
      };

      static async getUbicaciones(req: Request, res: Response): Promise<void> {
        try {
          console.log(req.params.almacenId);
          const ubicaciones = await AdministarAlmance.getUbicaciones(parseInt(req.params.almacenId));
          res.json(ubicaciones);
        } catch (error) {
          res.status(500).json({ message: 'Ocurrió un error desconocido' });
        }
      } 

      static async postUbicacion(req: Request, res: Response): Promise<void> {
        try {
          console.log(req.body);
          const ubicacion = await AdministarAlmance.postUbicacion(req.body);
          res.status(200).json({status: true, data:ubicacion, message: 'Ubicación creada correctamente'});
        } catch (error) {
          res.status(200).json({ status: false, message: 'Ocurrió un error desconocido' });
        }
      }

      static async putUbicacion(req: Request, res: Response): Promise<void> {
        try {
          console.log(req.body);
          console.log(req.params.id);
          const ubicacion = await AdministarAlmance.putUbicacion(parseInt(req.params.id), req.body);
          console.log(ubicacion);

          res.status(200).json({status: true, data:ubicacion, message: 'Ubicación actualizada correctamente'});
        } catch (error) {
          res.status(200).json({ status: false, message: 'Ocurrió un error desconocido' });
        }
      }

      static async getUsuarios(req: Request, res: Response): Promise<void> {
        try {
          const usuarios = await AdministarAlmance.getUsuarios(parseInt(req.params.almacenId));
          res.status(200).json({status: true, data:usuarios, message: 'Usuarios obtenidos correctamente'});
        } catch (error) {
          res.status(200).json({ status: false, message: 'Ocurrió un error desconocido' });
        }
      }

      static async addUsuarioAlmacen(req: Request, res: Response): Promise<void> {
        try {
          const usuario = await AdministarAlmance.addUsuarioAlmacen(parseInt(req.params.almacenId), parseInt(req.body.usuario_id));
          res.status(200).json({status: true, data:usuario, message: 'Usuario agregado correctamente'});
        } catch (error) {
          res.status(200).json({ status: false, message: 'Ocurrió un error desconocido' });
        }
      }

      static async getUsuariosDisponibles(req: Request, res: Response): Promise<void> {
        try {
          let usuarios: any = await AdministarAlmance.getUsuariosDisponibles();

          const usuariosFiltrados = usuarios.filter((usuario: any) => usuario.id_almacenUSer === null);
          usuarios = usuariosFiltrados;
          res.status(200).json({status: true, data:usuarios, message: 'Usuarios obtenidos correctamente'});
        } catch (error) {
          res.status(200).json({ status: false, message: 'Ocurrió un error desconocido' });
        }
      } 

      static async removeUsuarioAlmacen(req: Request, res: Response): Promise<void> {
        try {
          const usuario = await AdministarAlmance.removeUsuarioAlmacen(parseInt(req.params.userId));
          res.status(200).json({status: true, data:usuario, message: 'Usuario removido correctamente'});
        } catch (error) {
          res.status(200).json({ status: false, message: 'Ocurrió un error desconocido' });
        }
      }

      static async deleteUbicacion(req: Request, res: Response): Promise<void> {
        try {
          console.log(req.params.id);
          const ubicacion = await AdministarAlmance.deleteUbicacion(parseInt(req.params.id));
          res.status(200).json({status: true, data:ubicacion, message: 'Ubicación eliminada correctamente'});
        } catch (error) {
          res.status(200).json({ status: false, message: 'Ocurrió un error desconocido' });
        }
      }
}

export default AdministarAlmanceController;