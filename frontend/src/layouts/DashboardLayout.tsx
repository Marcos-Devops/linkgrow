import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <div className="sidebar-logo">
          <h2>LinkGrow</h2>
        </div>
        <ul className="sidebar-menu">
          <li className={`sidebar-menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className={`sidebar-menu-item ${location.pathname.startsWith('/dashboard/posts') ? 'active' : ''}`}>
            <Link to="/dashboard/posts">Posts</Link>
          </li>
          <li className={`sidebar-menu-item ${location.pathname.startsWith('/dashboard/posts/new') ? 'active' : ''}`}>
            <Link to="/dashboard/posts/new">Novo Post</Link>
          </li>
          <li className={`sidebar-menu-item ${location.pathname.startsWith('/dashboard/linkedin') ? 'active' : ''}`}>
            <Link to="/dashboard/linkedin/connect">LinkedIn</Link>
          </li>
          <li className={`sidebar-menu-item ${location.pathname === '/dashboard/profile' ? 'active' : ''}`}>
            <Link to="/dashboard/profile">Perfil</Link>
          </li>
          <li className={`sidebar-menu-item ${location.pathname === '/dashboard/settings' ? 'active' : ''}`}>
            <Link to="/dashboard/settings">Configurações</Link>
          </li>
        </ul>
      </div>
      <div className="main-content">
        <div className="header">
          <h2>
            {location.pathname === '/dashboard' && 'Dashboard'}
            {location.pathname.startsWith('/dashboard/posts') && !location.pathname.includes('/new') && 'Gerenciar Posts'}
            {location.pathname.includes('/posts/new') && 'Criar Novo Post'}
            {location.pathname.includes('/posts/edit') && 'Editar Post'}
            {location.pathname.startsWith('/dashboard/linkedin') && 'LinkedIn'}
            {location.pathname === '/dashboard/profile' && 'Perfil'}
            {location.pathname === '/dashboard/settings' && 'Configurações'}
          </h2>
          <div className="user-menu">
            <div onClick={toggleUserMenu} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px' }}>{user?.name}</span>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                backgroundColor: '#0066cc', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white'
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            {userMenuOpen && (
              <div className="user-menu-dropdown">
                <div className="user-menu-item" onClick={() => navigate('/dashboard/profile')}>
                  Perfil
                </div>
                <div className="user-menu-item" onClick={() => navigate('/dashboard/settings')}>
                  Configurações
                </div>
                <div className="user-menu-item" onClick={handleLogout}>
                  Sair
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{ padding: '24px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
