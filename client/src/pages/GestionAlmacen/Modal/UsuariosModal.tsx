import React, { useState, useEffect } from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { FaTimes, FaExchangeAlt, FaUserPlus, FaArrowLeft, FaPlus } from 'react-icons/fa';
import '../style/Modal.css';
import AdmUsuariosService from '../services/AdmUsuarios.service';
import ConfirmationModal from '../Modal/ConfirmationModal';

    interface Usuario {
    id: number;
    username: string;
    email: string;
    name: string;
    phone: string;
    }
    interface AlmacenUsuario {
        id: number;
        almacen_id: number;
        user_id: number;
        phone: string;
        name: string;
        email: string;
    }
    

    interface UsuariosModalProps {
    isOpen: boolean;
    onClose: () => void;
    almacenId: number;
    almacenNombre: string;
    }

const UsuariosModal: React.FC<UsuariosModalProps> = ({
    isOpen,
    onClose,
    almacenId,
    almacenNombre,
}) => {
    const [usuarios, setUsuarios] = useState<AlmacenUsuario[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [availableUsers, setAvailableUsers] = useState<Usuario[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [userToRemove, setUserToRemove] = useState<number | null>(null);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (isOpen) {
            fetchUsuarios();
        }
    }, [isOpen, almacenId]);

    const fetchUsuarios = async () => {
        try {

            const response = await AdmUsuariosService.getAlmacenUsuarios(almacenId);
            if (response.status) {
                console.log(response.data);
                setUsuarios(response.data);
            
            }
            else {
                showNotification('warning', response.message);
                setUsuarios([]);
            }
        } catch (error) {
            showNotification('error', 'Error al cargar los usuarios del almacén');
            
        }
    };

    const fetchAvailableUsers = async () => {
        try {
        const response = await AdmUsuariosService.getAvailableUsers();
        if (response.status) {
            console.log(response.data);
            // Filtrar usuarios únicos basados en el ID

                const uniqueUsers = response.data.filter((user: Usuario) => 
                    !usuarios.some(existingUser => existingUser.user_id === user.id)
                );
            console.log(uniqueUsers);
            response.data = uniqueUsers;
            setAvailableUsers(response.data);
        }
        else {
            showNotification('warning', response.message);
            setAvailableUsers([]);
        }
        } catch (error) {
        showNotification('error', 'Error al cargar los usuarios disponibles');
        }
    };

    const handleRemoveUser = async (userId: number) => {
        setUserToRemove(userId);
        setShowConfirmationModal(true);
    };

    const handleConfirmRemove = async () => {
        if (userToRemove) {
            try {
                const response = await AdmUsuariosService.removeUsuarioAlmacen(userToRemove);
                if (response.status) {
                    showNotification('success', 'Usuario removido exitosamente');
                    fetchUsuarios();
                } else {
                    showNotification('error', response.message || 'Error al remover el usuario');
                }
            } catch (error) {
                showNotification('error', 'Error al remover el usuario');
            }
        }
        setShowConfirmationModal(false);
        setUserToRemove(null);
    };

    const handleCancelRemove = () => {
        setShowConfirmationModal(false);
        setUserToRemove(null);
    };

    const handleTransferUser = async (userId: number) => {
        // TODO: Implement transfer modal to select destination warehouse
        try {
        // await transferUsuarioAlmacen(almacenId, newAlmacenId, userId);
        showNotification('success', 'Usuario transferido exitosamente');
        fetchUsuarios();
        } catch (error) {
        showNotification('error', 'Error al transferir el usuario');
        }
    };

    const handleAddUser = async (userId: number) => {
        try {
            const response = await AdmUsuariosService.addUsuarioAlmacen(almacenId, userId);
            if (response.status) {
                showNotification('success', 'Usuario agregado exitosamente');
                setShowAddUserModal(false);
                fetchUsuarios();
            }
            else {
                showNotification('error', 'Error al agregar el usuario');
            }
        } catch (error) {
            showNotification('error', 'Error al agregar el usuario');
        }
    };

    const handleOpenAddUserModal = () => {
        fetchAvailableUsers();
        setShowAddUserModal(true);
        setShowCreateModal(true);
    };

    const handleCloseAddUserModal = () => {
        setShowAddUserModal(false);
        setSearchTerm('');
    };

    const filteredAvailableUsers = availableUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = async (usuarioData: Omit<Usuario, 'id' | 'almacen_id'>) => {
        try {
            showNotification('success', 'Usuario creado exitosamente');
            setShowCreateModal(false);
            fetchUsuarios();
        } catch (error) {
            showNotification('error', 'Error al crear el usuario');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="ubicaciones-page">
            <div className="ubicaciones-header">
                <button className="back-button" onClick={onClose}>
                    <FaArrowLeft /> Volver
                </button>
                <h1>Usuarios - {almacenNombre}</h1>
            </div>
            <div className="ubicaciones-content">
                <div className="action-bar">
                    <button 
                        className="add-button"
                        onClick={handleOpenAddUserModal}
                    >
                        <FaPlus /> Nuevo Usuario
                    </button>
                </div>
                <div className="ubicaciones-list">
                    <table className="table-container">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Teléfono</th>
                                <th>Email</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.name}</td>
                                    <td>{usuario.phone}</td>
                                    <td>{usuario.email}</td>
                                    <td>
                                        <div className="button-group">
                                            
                                            <button
                                                className="btn-remove"
                                                onClick={() => handleRemoveUser(usuario.id)}
                                                title="Remover usuario"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modal para crear nueva ubicación */}
            {showAddUserModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Agregar Usuario al Almacén</h3>
                            <button
                                className="close-button"
                                onClick={handleCloseAddUserModal}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="search-container">
                                <input
                                type="text"
                                placeholder="Buscar usuarios..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="table-container">
                                <table className="usuarios-table">
                                    <thead>
                                        <tr>
                                        <th>Usuario</th>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAvailableUsers.map((usuario) => (
                                        <tr key={usuario.id}>
                                            <td>{usuario.username}</td>
                                            <td>{usuario.name}</td>
                                            <td>{usuario.email}</td>
                                            <td>{usuario.phone}</td>
                                            <td>
                                            <button
                                                className="btn-add"
                                                onClick={() => handleAddUser(usuario.id)}
                                            >
                                                Agregar
                                            </button>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Confirmation Modal */}
            <ConfirmationModal
            isOpen={showConfirmationModal}
            onClose={handleCancelRemove}
            onConfirm={handleConfirmRemove}
            message="¿Estás seguro de que deseas eliminar el usuario?"
        />
        </div>
    );
};

export default UsuariosModal; 