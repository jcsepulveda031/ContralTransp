
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NavItemProps {
  icon: string;
  label: string;
  to?: string;
  onClick?: () => void;
  isSidebarOpen: boolean;
  hasDropdown?: boolean;
  isDropdownOpen?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  to, 
  onClick, 
  isSidebarOpen, 
  hasDropdown = false, 
  isDropdownOpen = false 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    if (onClick) onClick();
  };

  return (
    <li 
      className={`sidebar-item ${hasDropdown ? 'has-dropdown' : ''}`} 
      onClick={handleClick}
    >
      <span className="sidebar-icon">{icon}</span>
      
      {/* Only show label and dropdown arrow when sidebar is open */}
      {isSidebarOpen && (
        <>
          <span className="sidebar-label">{label}</span>
          {hasDropdown && (
            <span className="sidebar-dropdown-icon">
              {isDropdownOpen ? '▲' : '▼'}
            </span>
          )}
        </>
      )}

      {/* Tooltip for closed state */}
      {!isSidebarOpen && (
        <div className="nav-tooltip">
          <span className="tooltip-text">{label}</span>
          {hasDropdown && (
            <span className="tooltip-dropdown-arrow">▼</span>
          )}
        </div>
      )}
    </li>
  );
};

export default NavItem;