import React, { useState, useEffect } from 'react';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';

const GestionReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState('todas');

  useEffect(() => {
    cargarReservas();
  }, []);

  const cargarReservas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/reservas');
      if (response.ok) {
        const data = await response.json();
        setReservas(data.data || []);
      }
    } catch (error) {
      console.error('Error cargando reservas:', error);
      // Datos de ejemplo
      setReservas([
        {
          id: 1,
          cliente_nombre: 'Cliente Prueba',
          cliente_apellido: 'Apellido',
          cliente_email: 'cliente@prueba.com',
          habitacion_numero: '101',
          fecha_entrada: '2024-01-20',
          fecha_salida: '2024-01-22',
          total: 516.00,
          estado: 'confirmada',
          estado_pago: 'completado'
        }
      ]);
    }
  };

  const reservasFiltradas = reservas.filter(reserva => {
    if (filtro === 'todas') return true;
    return reserva.estado === filtro;
  });

  return (
    <div className="gestion-reservas">
      <div className="reservas-header">
        <h2>Gestión de Reservas</h2>
        <div className="filtros">
          <button 
            className={`filtro-btn ${filtro === 'todas' ? 'active' : ''}`}
            onClick={() => setFiltro('todas')}
          >
            Todas
          </button>
          <button 
            className={`filtro-btn ${filtro === 'confirmada' ? 'active' : ''}`}
            onClick={() => setFiltro('confirmada')}
          >
            Confirmadas
          </button>
          <button 
            className={`filtro-btn ${filtro === 'pendiente' ? 'active' : ''}`}
            onClick={() => setFiltro('pendiente')}
          >
            Pendientes
          </button>
        </div>
      </div>

      <div className="reservas-stats">
        <div className="stat">
          <span className="stat-number">{reservas.length}</span>
          <span className="stat-label">Total Reservas</span>
        </div>
        <div className="stat">
          <span className="stat-number">{reservas.filter(r => r.estado === 'pendiente').length}</span>
          <span className="stat-label">Pendientes</span>
        </div>
        <div className="stat">
          <span className="stat-number">{reservas.filter(r => r.estado === 'confirmada').length}</span>
          <span className="stat-label">Confirmadas</span>
        </div>
        <div className="stat">
          <span className="stat-number">{reservas.filter(r => r.estado_pago === 'completado').length}</span>
          <span className="stat-label">Pagadas</span>
        </div>
      </div>

      <div className="reservas-list">
        {reservasFiltradas.map(reserva => (
          <div key={reserva.id} className="reserva-card">
            <div className="reserva-header">
              <h3>Reserva #{reserva.id}</h3>
              <div className="estados">
                <span className={`estado-reserva ${reserva.estado}`}>
                  {reserva.estado.toUpperCase()}
                </span>
                <span className={`estado-pago ${reserva.estado_pago}`}>
                  {reserva.estado_pago.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="reserva-info">
              <div className="info-group">
                <strong>Cliente:</strong>
                <span>{reserva.cliente_nombre} {reserva.cliente_apellido}</span>
              </div>
              <div className="info-group">
                <strong>Email:</strong>
                <span>{reserva.cliente_email}</span>
              </div>
              <div className="info-group">
                <strong>Habitación:</strong>
                <span>{reserva.habitacion_numero}</span>
              </div>
              <div className="info-group">
                <strong>Fechas:</strong>
                <span>{reserva.fecha_entrada} - {reserva.fecha_salida}</span>
              </div>
              <div className="info-group">
                <strong>Total:</strong>
                <span>${reserva.total}</span>
              </div>
            </div>

            <div className="reserva-actions">
              <button className="btn-ver">
                <FaEye /> Ver Detalles
              </button>
              {reserva.estado === 'pendiente' && (
                <>
                  <button className="btn-confirmar">
                    <FaCheck /> Confirmar
                  </button>
                  <button className="btn-cancelar">
                    <FaTimes /> Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {reservasFiltradas.length === 0 && (
        <div className="sin-reservas">
          <p>No hay reservas {filtro !== 'todas' ? 'con este filtro' : ''}</p>
        </div>
      )}
    </div>
  );
};

export default GestionReservas;