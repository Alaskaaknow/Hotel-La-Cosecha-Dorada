import React, { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEye, FaMoneyBillWave } from 'react-icons/fa';

const GestionPagos = () => {
  const [reservas, setReservas] = useState([]);

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
          habitacion_numero: '101',
          total: 516.00,
          estado_pago: 'completado',
          pago_id: 'TEST_001'
        }
      ]);
    }
  };

  const reservasPendientes = reservas.filter(r => r.estado_pago === 'pendiente');
  const historialPagos = reservas.filter(r => r.estado_pago !== 'pendiente');

  return (
    <div className="gestion-pagos">
      <div className="pagos-header">
        <h2>Gestión de Pagos</h2>
      </div>

      <section className="pendientes-section">
        <h3>Reservas Pendientes de Pago ({reservasPendientes.length})</h3>
        
        {reservasPendientes.length > 0 ? (
          <div className="pendientes-list">
            {reservasPendientes.map(reserva => (
              <div key={reserva.id} className="pago-card pendiente">
                <div className="pago-info">
                  <h4>Reserva #{reserva.id}</h4>
                  <p><strong>Cliente:</strong> {reserva.cliente_nombre} {reserva.cliente_apellido}</p>
                  <p><strong>Habitación:</strong> {reserva.habitacion_numero}</p>
                  <p><strong>Monto:</strong> ${reserva.total}</p>
                </div>
                <div className="pago-actions">
                  <button className="btn-confirmar-pago">
                    <FaCheck /> Confirmar Pago
                  </button>
                  <button className="btn-rechazar-pago">
                    <FaTimes /> Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="sin-pendientes">
            <FaMoneyBillWave size={48} color="#4caf50" />
            <p>No hay reservas pendientes de pago</p>
          </div>
        )}
      </section>

      <section className="historial-section">
        <h3>Historial de Pagos</h3>
        
        {historialPagos.length > 0 ? (
          <div className="historial-table">
            <table>
              <thead>
                <tr>
                  <th>ID Pago</th>
                  <th>Reserva</th>
                  <th>Método</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {historialPagos.map(reserva => (
                  <tr key={reserva.id}>
                    <td>{reserva.pago_id || 'N/A'}</td>
                    <td>#{reserva.id}</td>
                    <td>Tarjeta</td>
                    <td>${reserva.total}</td>
                    <td>{reserva.fecha_reserva?.split('T')[0] || 'N/A'}</td>
                    <td>
                      <span className={`estado-pago ${reserva.estado_pago}`}>
                        {reserva.estado_pago.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <button className="btn-ver-detalles">
                        <FaEye /> Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="sin-historial">
            <p>No hay pagos registrados en el sistema</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default GestionPagos;