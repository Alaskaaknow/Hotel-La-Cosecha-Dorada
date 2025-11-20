import React, { useState, useEffect } from 'react';
import { 
  FaBed, 
  FaCalendarCheck, 
  FaDollarSign, 
  FaEnvelope,
  FaMap,
  FaUsers
} from 'react-icons/fa';
import './DashboardOperator.css';

// Importamos los componentes que vamos a crear
import MapaHabitaciones from './MapaHabitaciones';
import GestionReservas from './GestionReservas';
import GestionPagos from './GestionPagos';
import MensajesContacto from './MensajesContacto';

const DashboardOperator = () => {
  const [seccionActiva, setSeccionActiva] = useState('mapa');
  const [estadisticas, setEstadisticas] = useState({
    totalHabitaciones: 0,
    disponibles: 0,
    ocupadas: 0,
    mantenimiento: 0,
    reservasHoy: 0,
    ingresosHoy: 0
  });

  // Cargar estadísticas
  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/habitaciones');
      if (response.ok) {
        const habitaciones = await response.json();
        const total = habitaciones.data.length;
        const disponibles = habitaciones.data.filter(h => h.estado === 'disponible').length;
        const ocupadas = habitaciones.data.filter(h => h.estado === 'ocupada').length;
        const mantenimiento = habitaciones.data.filter(h => h.estado === 'mantenimiento').length;

        setEstadisticas({
          totalHabitaciones: total,
          disponibles,
          ocupadas,
          mantenimiento,
          reservasHoy: 3, // Simulado - puedes conectar con tu API
          ingresosHoy: 1548 // Simulado
        });
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      // Datos de ejemplo si falla la API
      setEstadisticas({
        totalHabitaciones: 5,
        disponibles: 4,
        ocupadas: 1,
        mantenimiento: 0,
        reservasHoy: 1,
        ingresosHoy: 516
      });
    }
  };

  const renderSeccion = () => {
    switch (seccionActiva) {
      case 'mapa':
        return <MapaHabitaciones />;
      case 'reservas':
        return <GestionReservas />;
      case 'pagos':
        return <GestionPagos />;
      case 'mensajes':
        return <MensajesContacto />;
      default:
        return <MapaHabitaciones />;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <div className="dashboard-operator">
      {/* Header */}
      <header className="operator-header">
        <div className="header-content">
          <h1 className="hotel-title">
            La Cosecha Dorada - Recepción
          </h1>
          <div className="operator-info">
            <span className="operator-name">Operador: Recepción</span>
            <button className="logout-btn" onClick={handleLogout}>
              <FaUsers className="btn-icon" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Panel de Navegación */}
      <nav className="operator-nav">
        <div className="nav-container">
          <button 
            className={`nav-btn ${seccionActiva === 'mapa' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('mapa')}
          >
            <FaMap className="nav-icon" />
            Mapa Habitaciones
          </button>
          
          <button 
            className={`nav-btn ${seccionActiva === 'reservas' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('reservas')}
          >
            <FaCalendarCheck className="nav-icon" />
            Reservas Activas
          </button>
          
          <button 
            className={`nav-btn ${seccionActiva === 'pagos' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('pagos')}
          >
            <FaDollarSign className="nav-icon" />
            Gestión de Pagos
          </button>
          
          <button 
            className={`nav-btn ${seccionActiva === 'mensajes' ? 'active' : ''}`}
            onClick={() => setSeccionActiva('mensajes')}
          >
            <FaEnvelope className="nav-icon" />
            Consultas de Clientes
          </button>
        </div>
      </nav>

      {/* Estadísticas Rápidas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaBed />
          </div>
          <div className="stat-info">
            <h3>{estadisticas.totalHabitaciones}</h3>
            <p>Total</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon disponible">
            <FaBed />
          </div>
          <div className="stat-info">
            <h3>{estadisticas.disponibles}</h3>
            <p>Disponibles</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon ocupada">
            <FaBed />
          </div>
          <div className="stat-info">
            <h3>{estadisticas.ocupadas}</h3>
            <p>Ocupadas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon mantenimiento">
            <FaBed />
          </div>
          <div className="stat-info">
            <h3>{estadisticas.mantenimiento}</h3>
            <p>Mantenimiento</p>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <main className="operator-main">
        {renderSeccion()}
      </main>
    </div>
  );
};

export default DashboardOperator;