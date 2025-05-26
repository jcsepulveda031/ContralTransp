import { Request, Response } from 'express';
import AsignarCargaModel from '../models/asignarCarga.model';

class AsignarCarga {

  static async getAll(req: Request, res: Response) {
    try {
      const zonaCarga= await AsignarCargaModel.getAll(req.query);
      res.json(zonaCarga);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los transportes' });
    }
  };
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id  =  parseInt(req.params.id);
      const zonaCarga = await AsignarCargaModel.getById(id);
      if (!zonaCarga) {
        res.status(404).json({ message: 'Valores no encontrados en zona de carga' });
        return
      }
      res.json(zonaCarga);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los valores de la zona de carga' });
    }
  };
    static async update(req: Request, res: Response): Promise<void> {
        try {
          const id = parseInt(req.params.id);
          
          const result = await AsignarCargaModel.update(id);
          
          if (!result) {
            res.status(404).json({ message: 'Error al cargar el transporte' });
            return;
          }
          
          res.json({ message: 'Registro cargado correctamente' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error al actualizar la carga' });
        }
    };
    static async postAsignarInfoContr(req: Request, res: Response): Promise<void> { 

      try {
        const { zona_id, transp_id, estado = 'CARGADA', user_id } = req.body;
    
        if (!zona_id || !transp_id || !user_id) {
          res.status(400).json({ error: 'Faltan datos obligatorios.' });
          return
        }
    
        const insertId = await AsignarCargaModel.postCartgaInfo({ zona_id, transp_id, estado, user_id });
        // Actualiza el estado del transprote a CARGANDO
        const updateTra = await AsignarCargaModel.postCargaTransp(transp_id);

        res.status(201).json({ success: true, id: insertId , tranp: updateTra });
      } catch (error) {
        console.error('Error al insertar carga de transporte:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    };
    static async getDetalleCarga (req: Request, res: Response): Promise<void> {  

      const id = parseInt(req.params.id);
      try {
        const result = await AsignarCargaModel.getDetalleCargaM(id);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
      
    };
    static async delete (req: Request, res: Response): Promise<void> { 
      try {
        console.log(req);
        const id  =  parseInt(req.params.id);
        
        const result = await AsignarCargaModel.delete(id)
        res.json(result);
      } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el registro' });
      }

    };
    static async deleteZona (req: Request, res: Response): Promise<void> { 
      try {
        console.log(req);
        const id  =  parseInt(req.params.id);
        
        const result = await AsignarCargaModel.deleteZona(id)
        res.json(result);
      } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el registro' });
      }

    };

}

export default AsignarCarga;