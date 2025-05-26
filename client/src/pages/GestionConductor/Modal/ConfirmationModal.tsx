import React from 'react';
import '../styles/ConfirmationModal.css'

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal-container delete-modal">
        
      <div className="modal-header">
        <h3>Confirmación</h3>
      </div>
      <div className="modal-body">
        <p>{message}</p>
      </div>
        

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="cancel-button">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} className="delete-button">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;