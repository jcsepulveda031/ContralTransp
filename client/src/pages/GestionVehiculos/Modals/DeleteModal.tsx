import React from "react";
import { Vehiculo } from "../../../types/types";
//import '../styles/DeleteModal.css'


interface DeleteModalProps {
  vehiculo: Vehiculo;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ vehiculo, onClose, onDelete }) => {
  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal-container delete-modal">
        <div className="modal-header">
        <h2>¿Eliminar Vehículo?</h2>
        </div>
        <div className="modal-body">
        <p>¿Estás seguro de que deseas eliminar el vehículo con placa {vehiculo?.placa}?</p>
          <p>Esta acción no se puede deshacer.</p>
        </div>
        <div className="modal-footer">
          <button type="button" onClick={onClose}>Cancelar</button>
          <button type="button" className="delete-button" onClick={onDelete}>Eliminar</button>
        </div>
      </div>
    </div>
  
  );
};


export default DeleteModal;