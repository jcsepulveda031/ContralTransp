import { Request, Response } from 'express';
import DescargarModels from '../models/Descargar.models';

class DescarTransporController {

    static async getTransportes(req: Request, res: Response): Promise<void> {
        try {
            const { searchTerm } = req.query;
            const transportes = await DescargarModels.getTransportes(searchTerm as string);
            res.json({status: 'OK', data:transportes });
        } catch (error) {
            res.json({status: 'ERROR', data:'Error al obtener los transportes' });
        }
        
    }
    static async getInfoCarga(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const infoCarga = await DescargarModels.getInfoCarga(Number(id));
            res.json({status: 'OK', data:infoCarga });
        } catch (error) {
            res.json({status: 'ERROR', data:'Error al obtener la información de la carga' });
        }
    }
    static async descargarCarga(req: Request, res: Response): Promise<void> {
        try {
            const { id, zona_id } = req.params;
            const { params } = req.body;
            const user_id = params;
            const descargarCarga = await DescargarModels.descargarCarga(Number(id), Number(zona_id), Number(user_id));
            res.json({status: 'OK', data:descargarCarga });
        } catch (error) {
            res.json({status: 'ERROR', data:'Error al descargar la carga' });
        }
    }   
    static async getInfoID(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const infoID = await DescargarModels.getInfoID(Number(id));
            res.json({status: 'OK', data:infoID });
        } catch (error) {
            res.json({status: 'ERROR', data:'Error al obtener la información de la carga' });
        }
    }   
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const all = await DescargarModels.getAll(Number(id));
            res.json({status: 'OK', data:all });
        } catch (error) {
            res.json({status: 'ERROR', data:'Error al obtener la información de la carga' });
        }
    }   
    static async finalizarCarga(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const finalizarCarga = await DescargarModels.finalizarCarga(Number(id));
            res.json({status: 'OK', data:finalizarCarga });
        } catch (error) {
            res.json({status: 'ERROR', data:'Error al finalizar la carga' });
        }
    }   
}
export default DescarTransporController;
