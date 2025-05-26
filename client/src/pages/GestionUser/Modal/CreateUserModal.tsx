import React, { useState } from 'react';
import { User } from '../../../types/types';
import { useNotification } from '../../../context/NotificationContext';
import '../styles/UserTable.css';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (userData: Omit<User, 'id'>) => Promise<boolean>;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    nombre_usuario: '',
    email: '',
    password: '',
    rol: '',
    estado: true,
  });
  const { showNotification } = useNotification();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onCreate(formData);
    if (success) {
      setFormData({
        nombre_usuario: '',
        email: '',
        password: '',
        rol: '',
        estado: true,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Crear Nuevo Usuario</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre_usuario">Nombre de Usuario:</label>
              <input
                type="text"
                id="nombre_usuario"
                name="nombre_usuario"
                value={formData.nombre_usuario}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="rol">Rol:</label>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un rol</option>
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
              </select>
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="estado"
                  checked={formData.estado}
                  onChange={handleChange}
                />
                Activo
              </label>
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit">
                Crear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal; 