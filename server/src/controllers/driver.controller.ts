import { Request, Response } from 'express';
import DriverModels from '../models/driver.models';
import { RowDataPacket } from 'mysql2';

class driverController {

    static async getInfoDriver(req: Request, res: Response): Promise<void>  {
        try {
            const id = parseInt(req.params.id)
            const result = (await DriverModels.getInfoDriver(id)) as RowDataPacket[];
            
            if(result.length > 0){
                res.status(200).json({status: 'OK', data: result});
            }else{
                res.status(200).json({status: 'ERROR', message: 'El conductor No tiene activo un transporte'});
            }
        } catch (error) {
            res.status(200).json({status: 'ERROR', message: 'El conductor No tiene activo un transporte'});
        }
        
    }
    static async postStatusDriver(req: Request, res: Response): Promise<void>  { 

        const id = parseInt(req.params.id);
        const status = req.body.params;
        try {
            
            await DriverModels.postStatusDriverModel(id,status);
            console.log('Estado modificado');
            console.log(status);
            
            if (status == "EN_PROCESO") {
                await DriverModels.postTransportStatus(id, "ENTRANSITO");
            
            }else if (status === "FINALIZADO") {
                console.log('Estado finalizado');
                await DriverModels.postTransportStatus(id, "ARRIBADO");
                
            }
            res.status(200).json({status: 'OK', data: 'Estado modificado correctamente'});
        } catch (error) {
            res.status(200).json({status: 'ERROR', data: 'Error al modificar el estado '});
        }
    }
    static async getHistoryDriver(req: Request, res: Response): Promise<void>  { 
        try {
            const id = parseInt(req.params.id)
            console.log(id);
            const result = await DriverModels.getHistoryDriverModel(id);
            
            res.status(200).json({status: 'OK', data: result});
        } catch (error) {
            res.status(200).json({status: 'ERROR', message: 'El conductor No tiene historial de transportes'});
        }
    }
    static async getHistoryDriverById(req: Request, res: Response): Promise<void>  { 
        try {
            const id = parseInt(req.params.id)
            const result = await DriverModels.getHistoryDriverModelById(id);
            res.status(200).json({status: 'OK', data: result});
        } catch (error) {
            res.status(200).json({status: 'ERROR', message: 'El conductor No tiene historial de transportes'});
        }
    }  
    static async postDetailDriver(req: Request, res: Response): Promise<void>  { 
        try {
            const id = parseInt(req.params.id)
            console.log(req.body.params)
            console.log(id)
            const result = await DriverModels.postDetailDriverModel(id, req.body.params);
            res.status(200).json({status: 'OK', data: result});
        } catch (error) {
            res.status(200).json({status: 'ERROR', message: 'Error al capturar el detalle'});
        }
    }   
    static async getDetailDriver(req: Request, res: Response): Promise<void>  { 
        try {
            const id = parseInt(req.params.id)
            const result = await DriverModels.getDetailDriverModel(id);
            res.status(200).json({status: 'OK', data: result});
        } catch (error) {
            res.status(200).json({status: 'ERROR', message: 'Error al capturar el detalle'});
        }
    }
};

export default driverController;