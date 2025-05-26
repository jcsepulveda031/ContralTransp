import React, { useRef } from 'react';
import '../styles/SearchModal.css';

type ModalBusquedaProps = {
  tipo: string | null;
  datos: any[];
  onClose: () => void;
  onSelect: (item: any) => void;
  isLoading: boolean;
};

const ModalBusqueda: React.FC<ModalBusquedaProps> = ({ 
  tipo, 
  datos, 
  onClose, 
  onSelect,
  isLoading 
}) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Siempre ocultar columnas sensibles
    const excludeCols = ['id', 'usuario', 'contraseña', 'email', 'username', 'userid'];
    const columns = Object.keys(datos[0] || {}).filter(col => !excludeCols.includes(col.toLowerCase()));

    // Filtrar filas solo activos si existe status o estado
    let filteredDatos = datos;
    if (datos.length > 0 && (columns.includes('status') || columns.includes('estado'))) {
      filteredDatos = datos.filter(item => {
        const status = (item.status || item.estado || '').toLowerCase();
        return status === 'activo';
      });
    }

    return (
        <div className="busq-modal-overlay">
            <div className="busq-modal-container" ref={modalRef}>
                <div className="busq-modal-header">
                    <h2 className="busq-modal-title">Seleccionar {tipo && tipo.replace('_', ' ')}</h2>

                    <div className="busq-modal-actions">
                    <button type="button" onClick={onClose} className="busq-cancel-btn">
                        Cancelar
                    </button>
                    </div>
                    
                </div>
                
                {isLoading ? (
                    <div className="busq-modal-loading">
                        <div className="busq-modal-spinner"></div>
                        <p>Buscando datos...</p>
                    </div>
                ) : datos.length === 0 ? (
                    <p className="busq-modal-no-results">No hay resultados disponibles.</p>
                ) : (
                    <div className="busq-modal-table-responsive">
                        <table className="busq-modal-table">
                            <thead>
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th key={idx}>{col}</th>
                                    ))}
                                    <th className="busq-modal-table-actions">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDatos.map((item, index) => (
                                    <tr key={index}>
                                        {columns.map((col, i) => (
                                            <td key={i}>{item[col] === null || item[col] === undefined ? '' : String(item[col])}</td>
                                        ))}
                                        <td className="busq-modal-table-actions">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelect(item);
                                                }} 
                                                className="busq-select-btn"
                                                title="Seleccionar"
                                            >
                                                <span className="busq-select-icon">✔️</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModalBusqueda;