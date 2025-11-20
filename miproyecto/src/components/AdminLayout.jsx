import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  FaChartBar, 
  FaBed, 
  FaBullseye, 
  FaUsers, 
  FaChartLine,
  FaFileAlt,
  FaHotel,
  FaCog,
  FaHome,
  FaSignOutAlt,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaUser
} from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { id: 'dashboard', icon: <FaChartBar />, label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'habitaciones', icon: <FaBed />, label: 'Habitaciones', path: '/admin/habitaciones' },
    { id: 'actividades', icon: <FaBullseye />, label: 'Actividades', path: '/admin/actividades' },
    { id: 'usuarios', icon: <FaUsers />, label: 'Usuarios', path: '/admin/usuarios' },
    { id: 'consultas', icon: <FaChartLine />, label: 'Consultas', path: '/admin/consultas' },
    { id: 'reportes', icon: <FaFileAlt />, label: 'Reportes', path: '/admin/reportes' },
    { id: 'perfil-hotel', icon: <FaHotel />, label: 'Perfil Hotel', path: '/admin/perfil-hotel' },
  ];

  const getActiveSection = () => {
    const currentPath = location.pathname;
    const menuItem = menuItems.find(item => currentPath.includes(item.id));
    return menuItem ? menuItem.id : 'dashboard';
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Botón móvil de toggle */}
      <button 
        className="mobile-toggle-btn" 
        onClick={toggleSidebar}
        title={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        <FaBars />
      </button>

      {/* Sidebar - AHORA FIJADO */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="hotel-brand">
            <h2><FaHotel /> <span>La Cosecha</span></h2>
            <p>Panel Admin</p>
          </div>
          <button className="toggle-btn" onClick={toggleSidebar} title={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}>
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>
        
        {/* Menú de navegación */}
        <nav className="sidebar-nav">
          <ul>
            {menuItems.map(item => (
              <li key={item.id}>
                <button 
                  className={`nav-link ${getActiveSection() === item.id ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                  title={item.label}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Botones de acción - AHORA FIJOS EN LA PARTE INFERIOR */}
        <div className="sidebar-actions">
          <Link to="/" className="btn-volver-inicio" title="Volver al sitio principal">
            <FaHome /> <span>Volver al Inicio</span>
          </Link>
          <button className="btn-logout" onClick={handleLogout} title="Cerrar sesión">
            <FaSignOutAlt /> <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="admin-header">
          <div className="header-left">
            <div className="breadcrumb">
              <span className="section-title">
                {menuItems.find(item => getActiveSection() === item.id)?.label || 'Dashboard'}
              </span>
            </div>
          </div>
          
          <div className="header-right">
            <div className="quick-actions">
              <Link to="/" className="btn-mobile-home" title="Ir al sitio principal">
                <FaHome /> <span>Inicio</span>
              </Link>
            </div>
            
            <div className="user-info">
              <div className="user-details">
                <span className="user-name">Administrador</span>
                <span className="user-role">Super Admin</span>
              </div>
              <div className="user-avatar">
                <FaUser />
              </div>
            </div>
          </div>
        </header>
        
        <main className="admin-main">
          <div className="mobile-home-btn">
            <Link to="/" className="btn-floating-home" title="Volver al sitio principal">
              <FaHome />
            </Link>
          </div>
          
          <Outlet />
        </main>

        <footer className="admin-footer">
          <p>© 2024 Hotel La Cosecha Dorada - Sistema de Administración</p>
          <div className="footer-links">
            <span>v1.0.0</span>
            <Link to="/">Sitio Web</Link>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;