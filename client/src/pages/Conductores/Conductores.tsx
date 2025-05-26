import React, { useState, useEffect, useCallback, useRef } from "react";
import "./styles/DriverDashboard.css";
import Navbar from '../navbar/Navbar';
import { TransportAssignment } from "../../types/types";
import { 
  GoogleMap, 
  LoadScript, 
  Marker, 
  InfoWindow,
  DirectionsRenderer,
  StandaloneSearchBox
} from '@react-google-maps/api';
import { getDetailDiver, getDiverTransporte, postDetailDiver, postStatusDiver } from "./services/Diver.service";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Space, Card, Modal } from 'antd';
import { 
  EnvironmentOutlined, 
  AimOutlined, 
  CompassOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { NotificationProvider, useNotification } from '../../context/NotificationContext';

const DriverDashboardContent: React.FC = () => {
  const [assignments, setAssignments] = useState<TransportAssignment[]>([{
    id: "",
    originWarehouse: "",
    destinationWarehouse: "",
    vehicle: "",
    status: "",
    detailsHistory: []
  }]);

  const [loading, setLoading] = useState(true);
  const [currentAssignmentId, setCurrentAssignmentId] = useState<string | null>(null);
  const [routeDetail, setRouteDetail] = useState("");
  const [loadingTimeEstimate, setLoadingTimeEstimate] = useState(false);
  const [timeEstimate, setTimeEstimate] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [showNoDataModal, setShowNoDataModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<{
    message: string;
    type: 'error' | 'warning' | 'info';
    show: boolean;
  } | null>(null);

  const { showNotification } = useNotification();

  const toggleNavbar = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    fetchDriver();
  }, []);

  const fetchDriver = async () => {
    try {
      if (!user) {
        showError('Usuario no autenticado', 'error');
        return;
      }
      
      setLoading(true);
      const result = await getDiverTransporte(user.id);
      const resultDetail = await getDetailDiver(result.data[0].id);

      if (result.status === "OK" && result.data && result.data.length > 0) {
        const dataInfo = result.data[0];
        setAssignments([{
          id: dataInfo.id,
          originWarehouse: dataInfo.almacen_origen_nombre,
          destinationWarehouse: dataInfo.almacen_destino_nombre,
          vehicle: dataInfo.vehiculo_placa,
          status: dataInfo.estado,
          detailsHistory: resultDetail.data.map((detail: any) => ({
            date: new Date(detail.fecha).toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'}),
            time: detail.hora,
            content: detail.detalle
          }))
        }]);
      } else {
        console.log('Prueba modal salir ');
        setShowNoDataModal(true);
        setTimeout(() => {
          navigate('/Contaltransp');
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar los datos del conductor';
      showError(errorMessage);
      setShowNoDataModal(true);
      setTimeout(() => {
        navigate('/Contaltransp');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const showError = (message: string, type: 'error' | 'warning' | 'info' = 'error') => {
    setError({ message, type, show: true });
    showNotification(type, message);
  };

  const hideError = () => {
    setError(null);
  };

  const startRoute = async (assignmentId: string) => {
    try {
      setCurrentAssignmentId(assignmentId);
      const response = await postStatusDiver(assignmentId, "EN_PROCESO");
      if (response.status === 'OK') {
        fetchDriver();
        updateAssignmentStatus(assignmentId, "EN_PROCESO");
        showNotification('success', '¡Ruta iniciada exitosamente!');
      } else {
        showError(response.data || 'Error al iniciar la ruta');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar la ruta';
      showError(errorMessage);
    }
  };

  const endRoute = async (assignmentId: string) => {
    try {
      const response = await postStatusDiver(assignmentId, "FINALIZADO");
      if (response.status === 'OK') {
        showNotification('success', '¡Ruta finalizada exitosamente!');
        updateAssignmentStatus(assignmentId, "FINALIZADO");
        fetchDriver();
        setCurrentAssignmentId(null);
        setRouteDetail("");
        
      } else {
        showError(response.data || 'Error al finalizar la ruta');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al finalizar la ruta';
      showError(errorMessage);
    }
  };

  const updateAssignmentStatus = (assignmentId: string, status: string) => {
    setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status, detail: routeDetail } : a));
  };

  const simulateTimeEstimate = async (origin: string, destination: string) => {
    setLoadingTimeEstimate(true);
    
    try {
      const originCoords = await getCoordinates(origin);
      const destinationCoords = await getCoordinates(destination);
      
      if (!originCoords || !destinationCoords) {
        throw new Error("No se pudieron obtener las coordenadas de las ubicaciones");
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${originCoords.lat},${originCoords.lng}&destination=${destinationCoords.lat},${destinationCoords.lng}&key=TU_API_KEY&departure_time=now&traffic_model=best_guess`
      );

      const data = await response.json();

      if (data.status === "OK" && data.routes[0]?.legs[0]?.duration) {
        const durationText = data.routes[0].legs[0].duration.text;
        setTimeEstimate(`~${durationText}`);
      } else {
        setTimeEstimate("No disponible");
      }
    } catch (error) {
      console.error("Error al calcular el tiempo:", error);
      setTimeEstimate("Error en cálculo");
    } finally {
      setLoadingTimeEstimate(false);
    }
  };
  
  const getCoordinates = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=TU_API_KEY`
      );
      
      const data = await response.json();
      
      if (data.status === "OK" && data.results[0]?.geometry?.location) {
        return data.results[0].geometry.location;
      }
      return null;
    } catch (error) {
      console.error("Error en geocoding:", error);
      return null;
    }
  };

  const captureDetail = async (id :string, routeDetail :string) => {
    if (!routeDetail.trim()) return;
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    try {
      const data = { id_Seguimiento : id, fecha : date, hora : time, detalle : routeDetail };
      const response = await postDetailDiver(data);
      if (response.status === 'OK') {
        showNotification('success', '¡Detalle capturado exitosamente!');
        setAssignments(prev => prev.map(a => {
          if (a.id === id) {
            const updatedHistory = [...(a.detailsHistory || []), { date, time, content: routeDetail }];
            return { ...a, detailsHistory: updatedHistory };
          }
          return a;
        }));
      } else {
        showError(response.data || 'Error al capturar el detalle');
      }
      setRouteDetail("");
    } catch (error) {
      showError('Error al capturar el detalle');
    }
  };

  const Map = () => {
    const mapStyles = {
      height: "400px",
      width: "100%"
    };
    
    const defaultCenter = {
      lat: 19.432608, 
      lng: -99.133209
    };

    
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Seguimiento Transportes</h1>
      <Navbar isOpen={isOpen} onClose={toggleNavbar} />
      
      {assignments.map(assignment => (
        <div key={assignment.id} className="assignment-container">
          {loading ? (
            <div className="loading">Cargando...</div>
          ) : (
            <>
              {/* Mapa posicionado al inicio */}
              <div className="map-section">
                <h3>Ruta del Transporte</h3>
                <div className="map-container">
                  
                  <div className="map-overlay-info">
                    <p><strong>Origen:</strong> {assignment.originWarehouse}</p>
                    <p><strong>Destino:</strong> {assignment.destinationWarehouse}</p>
                    {timeEstimate && (
                      <p><strong>Tiempo estimado:</strong> {timeEstimate}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contenido de la asignación */}
              <div className={`assignment-card ${assignment.status}-status`}>
                <div className="assignment-header">
                  <h2>Transporte: {assignment.id}</h2>
                  <div className="header-details">
                    <p className="status-badge">{assignment.status}</p>
                    <p className="vehicle-info">{assignment.vehicle}</p>
                  </div>
                </div>
                
                {assignment.status === "PENDIENTE" && (
                  <button 
                    className="btn primary-btn" 
                    onClick={() => {
                      simulateTimeEstimate(assignment.originWarehouse, assignment.destinationWarehouse);
                      startRoute(assignment.id);
                    }}
                  >
                    Iniciar Recorrido
                  </button>
                )}

                {assignment.status === "EN_PROCESO" && (
                  <div className="route-section">
                    <div className="status-info">
                      <p className="status-text">Recorrido en Progreso</p>
                      {loadingTimeEstimate ? (
                        <p className="loading-text">Calculando tiempo estimado...</p>
                      ) : (
                        timeEstimate && <p className="estimated-time">Tiempo Estimado: {timeEstimate}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Detalles del Recorrido:</label>
                      <textarea 
                        value={routeDetail}
                        onChange={e => setRouteDetail(e.target.value)}
                        placeholder="Describa cualquier detalle relevante..."
                        className="form-textarea"
                      ></textarea>
                      <button className="btn secondary-btn" onClick={() => captureDetail(assignment.id, routeDetail)} >Capturar Detalle</button>
                    </div>

                    {assignment.detailsHistory && assignment.detailsHistory.length > 0 && (
                      <div className="details-history">
                        <h3>Historial de Detalles</h3>
                        <table className="details-table">
                          <thead>
                            <tr>
                              <th>Fecha</th>
                              <th>Hora</th>
                              <th>Detalle</th>
                            </tr>
                          </thead>
                          <tbody>
                            {assignment.detailsHistory.map((d, idx) => (
                              <tr key={idx}>
                                <td>{d.date}</td>
                                <td>{d.time}</td>
                                <td>{d.content}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    <button className="btn danger-btn" onClick={() => endRoute(assignment.id)}>
                      Finalizar Recorrido
                    </button>
                  </div>
                )}

                {assignment.status === "FINALIZADO" && assignment.detail && (
                  <div className="completed-details">
                    <div className="last-detail">
                      <span className="detail-label">Último Detalle Capturado:</span>
                      <p className="detail-content">{assignment.detail}</p>
                    </div>

                    {assignment.detailsHistory && assignment.detailsHistory.length > 0 && (
                      <div className="details-history">
                        <h3>Historial Completo</h3>
                        <table className="details-table">
                          <thead>
                            <tr>
                              <th>Fecha</th>
                              <th>Hora</th>
                              <th>Detalle</th>
                            </tr>
                          </thead>
                          <tbody>
                            {assignment.detailsHistory.map((d, idx) => (
                              <tr key={idx}>
                                <td>{d.date}</td>
                                <td>{d.time}</td>
                                <td>{d.content}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ))}

      {showNoDataModal && (
        <div className="modal-overlay">
          <div className="modal-container delete-modal">
            <div className="modal-header">
              <h2>Información importante</h2>
            </div>
            <div className="modal-body">
              <h2>No hay un recorrido activo asignado</h2>
              <p>Serás redirigido automáticamente...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DriverDashboard: React.FC = () => (
  <NotificationProvider>
    <DriverDashboardContent />
  </NotificationProvider>
);

export default DriverDashboard;