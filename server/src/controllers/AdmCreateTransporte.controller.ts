import { Request, Response } from 'express';
import TransporteModel from '../models/AdmCreateTransporte.models';


class TransporteController_t {
  static async getAll(req: Request, res: Response) : Promise<void>{
    try {
      
      const transportes = await TransporteModel.getAll('NUEVO');
      res.json(transportes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los transportes' });
    }
  };
  static async create(req: Request, res: Response) {
    console.log(req.body);
    try {
      console.log(req.body);
      const newTransporte = await TransporteModel.create(req.body);
      res.status(201).json(newTransporte);
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear el transporte' });
    }
  };
  static async getById(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const transporte = await TransporteModel.getById(id);
        if (!transporte) {
          res.status(404).json({ message: 'Transporte no encontrado' });
          return
        }

        res.json(transporte);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el transporte' });
    }
  };
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      
      const result = await TransporteModel.update(id, req.body);
      
      if (!result) {
        res.status(404).json({ message: 'Transporte no encontrado o no se puede editar' });
        return;
      }
      
      res.json({ message: 'Transporte actualizado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el transporte' });
    }
  };
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const result = await TransporteModel.delete(id);
      
      if (!result) {
        res.status(404).json({ message: 'Transporte no encontrado o no eliminable' });
        return;
      }
      
      res.json({ message: 'Transporte eliminado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar' });
    }
  };
  static async getSearchConductor (req: Request, res: Response): Promise<void> { 
    try {

      const cedula = req.params.cedula;
      const conductor = await TransporteModel.getSearchConductor(cedula);

      if (!conductor) {
        res.status(404).json({ message: 'Conductor no encontrado cedula ' });
        return;
      }
      
      res.json(conductor);

    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el conductor cedula' });
    }
  };
  static async getSearchAlmacen (req: Request, res: Response): Promise<void> { 
    try {

      const codigo = req.params.codigo;
      const almacen = await TransporteModel.getSearchAlmacen(codigo);

      if (!almacen) {
        res.status(404).json({ message: 'Almacén no encontrado' });
      }
      res.json(almacen);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el almacén por codigo' });
    }

  };
  static async getSearchVehiculo (req: Request, res: Response): Promise<void> { 
 
    try {
      
      const placa = req.params.placa
      const vehiculo = await TransporteModel.getSearchVehiculo(placa);

      if (!vehiculo) {
        res.status(404).json({ message: 'Vehículo no encontrado' });
        return;
      }

      
      res.json(vehiculo);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error al obtener el vehículo',
        
      });
    }

  };
  static async getSerchtransporte (req: Request, res: Response): Promise<void> { 
    try {
      
      const codigo = req.params.codigo
      const transporte = await TransporteModel.getSearchTransporte(codigo);

      res.json(transporte);
    } catch (error) {

      res.status(500).json({ 
        message: 'Error al obtener el Transporte',
        
      });
    }

  };
  static async showFinalTransp(req: Request, res: Response): Promise<void> {
    try {

      const id = await TransporteModel.showFinalTransp();
      res.status(201).json({ id });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
          success: false,
          message: 'Error en el servidor',
          error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  };

} 

export default TransporteController_t;