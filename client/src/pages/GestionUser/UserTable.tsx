import React, { useState, useEffect } from 'react';
import Navbar from '../../pages/navbar/Navbar';
import { UserTableInfo, } from '../../types/types';
import { getUser, postUserRoleInfo } from './services/UserTable.service';
import { FaEdit, FaSearch } from 'react-icons/fa';
import EditAlmacenModal from './Modal/EditRoleUser';
import './styles/UserTable.css';

const ROLE_COLORS: Record<string, string> = {
    admin: '#e38b29',
    user: '#43bfa3',
    driver: '#a3542f',
    default: '#bdbdbd'
};

const RoleChip: React.FC<{ role: string }> = ({ role }) => (
    <span
        className="role-chip"
        style={{
            backgroundColor: ROLE_COLORS[role.toLowerCase()] || ROLE_COLORS.default,
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.95em',
            textTransform: 'capitalize',
            letterSpacing: '0.5px',
            display: 'inline-block',
            minWidth: '70px',
            textAlign: 'center',
        }}
    >
        {role}
    </span>
);

const UserTable: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [allUsers, setAllUsers] = useState<UserTableInfo[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserTableInfo[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [editingUser, setEditingUser] = useState<UserTableInfo | null>(null);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const toggleNavbar = () => {
        setIsOpen(true);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // Efecto para filtrar usuarios cuando cambia el término de búsqueda
    useEffect(() => {
        filterUsers(searchTerm);
    }, [searchTerm, allUsers]);

    const filterUsers = (term: string) => {
        if (!term.trim()) {
            setFilteredUsers(allUsers);
            return;
        }

        const searchTermLower = term.toLowerCase();
        const filtered = allUsers.filter(user => 
            user.name.toLowerCase().includes(searchTermLower) ||
            user.username.toLowerCase().includes(searchTermLower)
        );
        setFilteredUsers(filtered);
    };

    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await getUser('');
            if (response.status === "OK") {
                setAllUsers(response.data);
                setFilteredUsers(response.data);
                setErrorMessage('');
            } else {
                setErrorMessage(response.data);
            }
        } catch (error) {
            setErrorMessage('Error al obtener los usuarios. Por favor, inténtelo de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    }

    const handleEditClick = (user: UserTableInfo) => {
        setEditingUser({...user});
        setShowEditModal(true);
    };

    const handleUpdate = async (User: UserTableInfo) => {
        try {
            const response = await postUserRoleInfo(User.id, User);
            setShowEditModal(false);
            await fetchUser();
            return response.success;
        } catch (error) {
            setErrorMessage(`Error al actualizar el usuario: ${User.username}`);
            return false;
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const renderContent = () => {
        if (loading) {
            return <div className="loading-state"><span className="loader"></span> Cargando usuarios...</div>;
        }

        if (errorMessage) {
            return <div className="error-state">{errorMessage}</div>;
        }

        if (!allUsers.length) {
            return <div className="empty-state">No se encontraron usuarios</div>;
        }

        return (
            <div className="user-table-container">
                <div className="search-container">
                    <div className="user-table-searchbox">
                        <FaSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre o usuario..." 
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="user-search" 
                        />
                    </div>
                    {filteredUsers.length === 0 && searchTerm && (
                        <div className="no-results">No se encontraron resultados para "{searchTerm}"</div>
                    )}
                </div>
                
                <div className="table-responsive">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Nombre de usuario</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Años</th>
                                <th>Número</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.age}</td>
                                    <td>{user.phone}</td>
                                    <td><RoleChip role={user.role} /></td>
                                    <td> 
                                        <button 
                                            className="action-button edit-btn" 
                                            onClick={() => handleEditClick(user)}
                                            title="Editar usuario"
                                            tabIndex={0}
                                        >
                                            <FaEdit size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div >
            <Navbar isOpen={isOpen} onClose={toggleNavbar} />
            <div className={`content ${isOpen ? 'shift' : ''}`}>       
                <div className="container">
                    <div className="user-table-container">
                        <h1 className="user-table-title">Gestión de Usuarios</h1>
                        {renderContent()}
                    </div>
                </div>
            </div>

            {editingUser && (
                <EditAlmacenModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={handleUpdate}
                    User={editingUser}
                />
            )}
        </div>
    );
}

export default UserTable;