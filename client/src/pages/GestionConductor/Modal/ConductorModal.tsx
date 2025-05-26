import React from 'react';
import { Conductor } from '../../../types/types';
import '../styles/ConductorModal.css';

interface ConductorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: Conductor;
  setFormData: React.Dispatch<React.SetStateAction<Conductor>>;
  isEditing: boolean;
  error: string | null;
}

const ConductorModal: React.FC<ConductorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEditing,
  error,
}) => {
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-container">
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Conductor' : 'Agregar Conductor'}</h2>
        </div>
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Cédula:</label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                required
                disabled={isEditing}
              />
            </div>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Teléfono:</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Dirección:</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Licencia:</label>
              <input
                type="text"
                name="licencia"
                value={formData.licencia}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConductorModal;