import React, { useState } from 'react';
import '../styles/UserInfo.css';
import { UserTableInfo, EditUserTableInfoProps } from '../../../types/types';

const EditAlmacenModal: React.FC<EditUserTableInfoProps> = ({ 
  isOpen, 
  onClose, 
  onUpdate,
  User 
}) => {
  const [formData, setFormData] = useState<UserTableInfo>(User);

  // Cambia el tipo del evento a ChangeEvent<HTMLSelectElement>
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, role: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onUpdate(formData);
    if (success) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Editar Rol de Usuario</h2>
          <button className="close-button" onClick={onClose} aria-label="Cerrar">×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="role-select">Rol:</label>
              <select 
                id="role-select"
                value={formData.role}  
                className="modal-select" 
                onChange={handleInputChange}
              >
                <option value="User">user</option>
                <option value="Admin">admin</option>
                <option value="Driver">driver</option>
              </select>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="modal-btn-cancel">
                Cancelar
              </button>
              <button type="submit" className="modal-btn-submit">
                Actualizar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAlmacenModal;