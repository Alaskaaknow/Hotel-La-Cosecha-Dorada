import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaUser } from "react-icons/fa";
import "./Header.css";
import LoginModal from "./LoginModal";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("user");

    // Si el valor es la cadena "undefined" o vacío, lo limpiamos
    if (raw === "undefined" || raw === "") {
      localStorage.removeItem("user");
    }

    try {
      const userData = raw && raw !== "undefined" ? JSON.parse(raw) : null;
      if (token && userData) {
        setUser(userData);
      }
    } catch (err) {
      console.error("❌ Error al leer usuario de localStorage:", err);
      // si está corrupto, lo borramos para evitar futuros errores
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    closeModal();
    
    // Si es cliente, redirigir al dashboard
    if (userData.role === 'cliente') {
      window.location.href = '/dashboard';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const irADashboard = () => {
    if (user?.role === 'cliente') {
      window.location.href = '/dashboard';
    } else if (user?.role === 'administrador') {
      window.location.href = '/admin/dashboard';
    }
  };

  return (
    <header className="header">
      <div className="logo">La Cosecha Dorada</div>

      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <Link to="principal" smooth duration={500}>Principal</Link>
        <Link to="historia" smooth duration={500}>Acerca de nosotros</Link>
        <Link to="act" smooth duration={500}>Actividades</Link>
        <Link to="habitaciones" smooth duration={500}>Habitaciones</Link>
        <Link to="servicios" smooth duration={500}>Servicios</Link>
        <Link to="extras" smooth duration={500}>Extras</Link>
        <Link to="ubicacion" smooth duration={500}>Ubicación</Link>

        {user ? (
          <div className="user-menu">
            <span className="user-welcome">Hola, {user.nombre || user.username}</span>
            
            {/* Botón para ir al Dashboard */}
            {user.role === 'cliente' && (
              <button className="dashboard-btn" onClick={irADashboard}>
                <FaUser className="login-icon" /> Mi Cuenta
              </button>
            )}
            
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt className="login-icon" /> Cerrar sesión
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={openModal}>
            <FaUserCircle className="login-icon" /> Iniciar sesión
          </button>
        )}
      </nav>

      <div className="menu-toggle" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Modal de login */}
      <LoginModal
        isOpen={modalIsOpen}
        onClose={closeModal}
        onLoginSuccess={handleLoginSuccess}
      />
    </header>
  );
}

export default Header;