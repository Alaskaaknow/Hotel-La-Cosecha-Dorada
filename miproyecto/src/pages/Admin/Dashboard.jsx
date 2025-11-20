import React, { useState, useEffect } from 'react';
import { 
  FaChartBar, 
  FaBed, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaStar,
  FaClock,
  FaChartLine,
  FaBullseye,
  FaUsers,
  FaHotel
} from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const result = await response.json();
      
      if (result.success) {
        setDatos(result.data);
      }
    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return <div className="cargando-dashboard">Cargando dashboard...</div>;
  }

  if (!datos) {
    return <div className="error-dashboard">Error al cargar los datos</div>;
  }

  const { estadisticas, reservasRecientes, ocupacion, actividades } = datos;

  return (
    <div className="dashboard-admin">
      <header className="dashboard-header">
        <div className="header-title">
          <FaChartBar className="header-icon" />
          <div>
            <h1>Dashboard Administrativo</h1>
            <p>Resumen general del hotel</p>
          </div>
        </div>
      </header>

      {/* Tarjetas de Estadísticas */}
      <div className="estadisticas-grid">
        <div className="estadistica-card">
          <div className="estadistica-icon reservas">
            <FaCalendarAlt />
          </div>
          <div className="estadistica-info">
            <h3>{estadisticas.reservasHoy || 0}</h3>
            <p>Reservas Hoy</p>
          </div>
        </div>
        
        <div className="estadistica-card">
          <div className="estadistica-icon ocupadas">
            <FaBed />
          </div>
          <div className="estadistica-info">
            <h3>{estadisticas.habitacionesOcupadas || 0}</h3>
            <p>Habitaciones Ocupadas</p>
          </div>
        </div>
        
        <div className="estadistica-card">
          <div className="estadistica-icon disponibles">
            <FaHotel />
          </div>
          <div className="estadistica-info">
            <h3>{estadisticas.habitacionesDisponibles || 0}</h3>
            <p>Habitaciones Disponibles</p>
          </div>
        </div>
        
        <div className="estadistica-card">
          <div className="estadistica-icon ingresos">
            <FaDollarSign />
          </div>
          <div className="estadistica-info">
            <h3>S/. {estadisticas.ingresosHoy || 0}</h3>
            <p>Ingresos Hoy</p>
          </div>
        </div>

        <div className="estadistica-card">
          <div className="estadistica-icon actividades">
            <FaStar />
          </div>
          <div className="estadistica-info">
            <h3>{estadisticas.totalActividades || 0}</h3>
            <p>Actividades Activas</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Reservas Recientes */}
        <div className="dashboard-section">
          <div className="section-header">
            <FaClock className="section-icon" />
            <h3>Reservas Recientes</h3>
          </div>
          <div className="reservas-table">
            <table>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Habitación</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservasRecientes.map(reserva => (
                  <tr key={reserva.id}>
                    <td>{reserva.cliente}</td>
                    <td>{reserva.habitacion}</td>
                    <td>{new Date(reserva.fecha_entrada).toLocaleDateString()}</td>
                    <td>{new Date(reserva.fecha_salida).toLocaleDateString()}</td>
                    <td>S/. {reserva.total}</td>
                    <td>
                      <span className={`estado-badge estado-${reserva.estado}`}>
                        {reserva.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ocupación por Tipo */}
        <div className="dashboard-section">
          <div className="section-header">
            <FaChartLine className="section-icon" />
            <h3>Ocupación por Tipo de Habitación</h3>
          </div>
          <div className="ocupacion-grid">
            {ocupacion.map(tipo => (
              <div key={tipo.tipo} className="ocupacion-card">
                <h4>{tipo.tipo.toUpperCase()}</h4>
                <div className="ocupacion-stats">
                  <div>Total: {tipo.total}</div>
                  <div>Ocupadas: {tipo.ocupadas}</div>
                  <div>Disponibles: {tipo.disponibles}</div>
                </div>
                <div className="ocupacion-bar">
                  <div 
                    className="ocupacion-fill"
                    style={{ width: `${(tipo.ocupadas / tipo.total) * 100}%` }}
                  >
                    <span>{Math.round((tipo.ocupadas / tipo.total) * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividades Activas */}
        <div className="dashboard-section">
          <div className="section-header">
            <FaBullseye className="section-icon" />
            <h3>Actividades Activas</h3>
          </div>
          <div className="actividades-grid-mini">
            {actividades && actividades.map((actividad, index) => (
              <div key={actividad.id} className="actividad-mini-card">
                <div className="actividad-mini-imagen">
                  <img 
                    src={actividad.imagen} 
                    alt={actividad.titulo}
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/100x80/491E2E/F5F0E6?text=Actividad+${index + 1}`;
                    }}
                  />
                </div>
                <div className="actividad-mini-info">
                  <h4>{actividad.titulo}</h4>
                  <p>{actividad.descripcion.substring(0, 60)}...</p>
                </div>
                <span className={`actividad-estado ${actividad.activa ? 'activa' : 'inactiva'}`}>
                  {actividad.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;