import React, { useState, useEffect } from 'react';
import { Almacen } from '../../../types/types';
import { useNotification } from '../../../context/NotificationContext';
import '../style/ModalsAlmacen.css';

interface CreateAlmacenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (almacenData: Omit<Almacen, 'id'>) => Promise<boolean>;
  getNextCode: () => Promise<string>;
}

// JSON local de departamentos y ciudades de Colombia
const departamentosCiudades = [
  { nombre: 'Antioquia', ciudades: ['Medellín', 'Envigado', 'Bello', 'Itagüí', 'Rionegro'] },
  { nombre: 'Cundinamarca', ciudades: ['Bogotá', 'Soacha', 'Chía', 'Zipaquirá', 'Facatativá'] },
  { nombre: 'Valle del Cauca', ciudades: ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Buga'] },
  { nombre: 'Atlántico', ciudades: ['Barranquilla', 'Soledad', 'Malambo', 'Puerto Colombia'] },
  { nombre: 'Santander', ciudades: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'] },
  { nombre: 'Bolívar', ciudades: ['Cartagena', 'Magangué', 'Turbaco', 'Arjona'] },
  { nombre: 'Nariño', ciudades: ['Pasto', 'Tumaco', 'Ipiales', 'Túquerres'] },
  { nombre: 'Córdoba', ciudades: ['Montería', 'Lorica', 'Sahagún', 'Cereté'] },
  { nombre: 'Meta', ciudades: ['Villavicencio', 'Acacías', 'Granada', 'Puerto López'] },
  { nombre: 'Tolima', ciudades: ['Ibagué', 'Espinal', 'Melgar', 'Honda'] },
  // ... puedes agregar más departamentos y ciudades principales
];

const CreateAlmacenModal: React.FC<CreateAlmacenModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  getNextCode,
}) => {
  const [formData, setFormData] = useState<Omit<Almacen, 'id'>>({
    codigo: '',
    nombre: '',
    departamento: '',
    ciudad: '',
    direccion: '',
  });
  const [departamento, setDepartamento] = useState('');
  const [ciudades, setCiudades] = useState<string[]>([]);
  const { showNotification } = useNotification();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadNextCode();
      setError('');
      setDepartamento('');
      setCiudades([]);
      setFormData(prev => ({ ...prev, ciudad: '' }));
    }
  }, [isOpen]);

  const loadNextCode = async () => {
    try {
      const nextCode = await getNextCode();
      setFormData(prev => ({ ...prev, codigo: nextCode }));
    } catch (error) {
      showNotification('error', 'No se pudo cargar el código automático');
    }
  };

  const handleDepartamentoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dep = e.target.value;
    setDepartamento(dep);
    const depObj = departamentosCiudades.find(d => d.nombre === dep);
    setCiudades(depObj ? depObj.ciudades : []);
    setFormData(prev => ({ ...prev, ciudad: '' }));
    setError('');
  };

  const handleCiudadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, ciudad: e.target.value }));
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !departamento || !formData.ciudad.trim() || !formData.direccion.trim()) {
      setError('Todos los campos son obligatorios.');
      showNotification('error', 'Todos los campos son obligatorios.');
      return;
    }
    const success = await onCreate(formData);
    if (success) {
      setFormData({
        codigo: '',
        nombre: '',
        departamento: '',
        ciudad: '',
        direccion: '',
      });
      setDepartamento('');
      setCiudades([]);
      setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Crear Nuevo Almacén</h2>
          <button className="close-button" onClick={onClose} aria-label="Cerrar">×</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="form-group">
              <label htmlFor="codigo">Código:</label>
              <input
                type="text"
                id="codigo"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                required
                readOnly
                className="read-only"
              />
            </div>
            <div className="form-group">
              <label htmlFor="nombre">Nombre:</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="departamento">Departamento:</label>
              <select
                id="departamento"
                value={departamento}
                onChange={handleDepartamentoChange}
                required
                className="modal-select"
              >
                <option value="">Seleccione un departamento</option>
                {departamentosCiudades.map(dep => (
                  <option key={dep.nombre} value={dep.nombre}>{dep.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="ciudad">Ciudad:</label>
              <select
                id="ciudad"
                value={formData.ciudad}
                onChange={handleCiudadChange}
                required
                className="modal-select"
                disabled={!departamento}
              >
                <option value="">Seleccione una ciudad</option>
                {ciudades.map(ciudad => (
                  <option key={ciudad} value={ciudad}>{ciudad}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="direccion">Dirección:</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                required
              />
            </div>
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="modal-btn-cancel">
                Cancelar
              </button>
              <button type="submit" className="modal-btn-submit">
                Crear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAlmacenModal;