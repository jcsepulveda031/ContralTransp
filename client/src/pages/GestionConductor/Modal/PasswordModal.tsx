import React from 'react';
import '../styles/PasswordModal.css'; // Puedes crear o reutilizar estilos

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: string;
  contrasena: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, usuario, contrasena }) => {
  if (!isOpen) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-container">
            <div className="modal-header">
                <h2>Usuario creado exitosamente</h2>
            </div>
            <div className="modal-body">

                <p><strong>Usuario:</strong> {usuario}</p>
                <p><strong>Contraseña:</strong> {contrasena}</p>

            </div>
        <div className="modal-actions">
            <button  type="button" className="delete-button" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;