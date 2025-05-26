import React from 'react';
import { useNotification } from '../../../context/NotificationContext';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { showNotification } = useNotification();

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      showNotification('error', 'Error al eliminar el almacén');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirmar Eliminación</h2>
        <p>¿Está seguro que desea eliminar este almacén?</p>
        <p>Esta acción no se puede deshacer.</p>
        <div className="modal-buttons">
          <button type="button" className="btn-danger" onClick={handleConfirm}>
            Eliminar
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;