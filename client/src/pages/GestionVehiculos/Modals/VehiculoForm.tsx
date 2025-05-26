
import React, { useState, useEffect } from "react";
import { Vehiculo } from "../../../types/types";
import '../styles/VehiculoForm.css';

interface VehiculoFormProps {
  vehiculo: Vehiculo | null;
  onClose: () => void;
  onSave: (vehiculo: Vehiculo) => Promise<void>;
}

const VehiculoForm: React.FC<VehiculoFormProps> = ({ vehiculo, onClose, onSave }) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    año: '',
    color: '',
    placa: ''
  });

  // Estado para los errores
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos del vehículo al iniciar
  useEffect(() => {
    if (vehiculo) {
      setFormData({
        marca: vehiculo.marca || '',
        modelo: vehiculo.modelo || '',
        año: vehiculo.año?.toString() || '',
        color: vehiculo.color || '',
        placa: vehiculo.placa || ''
      });
    }
  }, [vehiculo]);

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validación especial para el campo año (solo números)
    if (name === 'año') {
      if (value === '' || /^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpiar error si existe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validar el formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.marca.trim()) newErrors.marca = 'La marca es requerida';
    if (!formData.modelo.trim()) newErrors.modelo = 'El modelo es requerido';
    
    // Validación del año
    if (!formData.año) {
      newErrors.año = 'El año es requerido';
    } else if (!/^\d+$/.test(formData.año)) {
      newErrors.año = 'El año debe ser un número válido';
    } else {
      const añoNum = parseInt(formData.año);
      if (añoNum < 1900) {
        newErrors.año = 'El año debe ser mayor a 1900';
      } else if (añoNum > new Date().getFullYear() + 1) {
        newErrors.año = `El año no puede ser mayor a ${new Date().getFullYear() + 1}`;
      }
    }
    
    if (!formData.color.trim()) newErrors.color = 'El color es requerido';
    
    // Solo validar placa si es un nuevo vehículo
    if (!vehiculo && !formData.placa.trim()) {
      newErrors.placa = 'La placa es requerida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const añoNum = parseInt(formData.año);
    if (isNaN(añoNum)) {
      setErrors(prev => ({ ...prev, año: 'El año debe ser un número válido' }));
      return;
    }

    const vehiculoToSave: Vehiculo = {
      id: vehiculo?.id,
      marca: formData.marca,
      modelo: formData.modelo,
      año: añoNum,
      color: formData.color,
      placa: formData.placa
    };

    try {


      await onSave(vehiculoToSave);
      onClose();
      
    } catch (err) {
      console.error("Error al guardar el vehículo:", err);
      //setErrors(prev => ({ ...prev, form: err.message || "Ocurrió un error al guardar el vehículo" }));
      setErrors(prev => ({ ...prev, año: "Ocurrió un error al guardar el vehículo" }));
    }
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal-container">
        <div className="modal-header">
        <h2>{vehiculo ? "Editar Vehículo" : "Agregar Vehículo"}</h2>
        </div>
        {errors.form && (
          <div className="form-error-message">
            {errors.form}
          </div>
        )}
        <div className="modal-body">
        <form onSubmit={handleSubmit} className="vehiculo-form">
          
          {/* Campo Marca */}
          <div className={`form-group ${errors.marca ? 'has-error' : ''}`}>
            <label>Marca</label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              placeholder="Ej: Toyota"
            />
            {errors.marca && <span className="error-message">{errors.marca}</span>}
          </div>
          
          {/* Campo Modelo */}
          <div className={`form-group ${errors.modelo ? 'has-error' : ''}`}>
            <label>Modelo</label>
            <input
              type="text"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              placeholder="Ej: Corolla"
            />
            {errors.modelo && <span className="error-message">{errors.modelo}</span>}
          </div>
          
          {/* Campo Año */}
          <div className={`form-group ${errors.año ? 'has-error' : ''}`}>
            <label>Año</label>
            <input
              type="text"
              name="año"
              value={formData.año}
              onChange={handleChange}
              placeholder="Ej: 2020"
              maxLength={4}
            />
            {errors.año && <span className="error-message">{errors.año}</span>}
          </div>
          
          {/* Campo Color */}
          <div className={`form-group ${errors.color ? 'has-error' : ''}`}>
            <label>Color</label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Ej: Rojo"
            />
            {errors.color && <span className="error-message">{errors.color}</span>}
          </div>
          
          {/* Campo Placa */}
          <div className={`form-group ${errors.placa ? 'has-error' : ''}`}>
            <label>Placa</label>
            {vehiculo ? (
              // Mostrar la placa como texto si estamos editando
              <div className="placa-display">
                {formData.placa}
                <input
                  type="hidden"
                  name="placa"
                  value={formData.placa}
                />
              </div>
            ) : (
              // Mostrar input solo si es un nuevo vehículo
              <input
                type="text"
                name="placa"
                value={formData.placa}
                onChange={handleChange}
                placeholder="Ej: ABC123"
              />
            )}
            {errors.placa && <span className="error-message">{errors.placa}</span>}
          </div>
          
          {/* Botones de acción */}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              {vehiculo ? "Guardar Cambios" : "Agregar Vehículo"}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default VehiculoForm;