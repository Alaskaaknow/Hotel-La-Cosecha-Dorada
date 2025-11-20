import React, { useState, useEffect } from 'react';
import { FaEye, FaKey, FaWrench } from 'react-icons/fa';

const MapaHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  const cargarHabitaciones = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/habitaciones');
      if (response.ok) {
        const data = await response.json();
        setHabitaciones(data.data);
      }
    } catch (error) {
      console.error('Error cargando habitaciones:', error);
      // Datos de ejemplo si falla la API
      setHabitaciones([
        {
          id: 1,
          numero: '101',
          nombre: 'Suite Deluxe',
          tipo: 'suite',
          descripcion: 'Habitación amplia con jacuzzi y vista al viñedo.',
          capacidad: 2,
          precio: 258.00,
          estado: 'disponible'
        },
        {
          id: 2,
          numero: '102',
          nombre: 'Habitación Doble',
          tipo: 'doble',
          descripcion: 'Con dos camas individuales y balcón privado.',
          capacidad: 2,
          precio: 180.00,
          estado: 'disponible'
        },
        {
          id: 3,
          numero: '103',
          nombre: 'Habitación Familiar',
          tipo: 'familiar',
          descripcion: 'Perfecta para familias con niños.',
          capacidad: 4,
          precio: 300.00,
          estado: 'disponible'
        }
      ]);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'disponible': return '#4caf50';
      case 'ocupada': return '#f44336';
      case 'mantenimiento': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'disponible': return 'Disponible';
      case 'ocupada': return 'Ocupada';
      case 'mantenimiento': return 'Mantenimiento';
      default: return estado;
    }
  };

  return (
    <div className="mapa-habitaciones">
      <div className="mapa-header">
        <h2>Mapa de Habitaciones</h2>
        <div className="leyenda">
          <div className="leyenda-item">
            <div className="color disponible"></div>
            <span>Disponible</span>
          </div>
          <div className="leyenda-item">
            <div className="color ocupada"></div>
            <span>Ocupada</span>
          </div>
          <div className="leyenda-item">
            <div className="color mantenimiento"></div>
            <span>Mantenimiento</span>
          </div>
        </div>
      </div>

      <div className="habitaciones-grid">
        {habitaciones.map(habitacion => (
          <div 
            key={habitacion.id}
            className={`habitacion-card ${habitacion.estado}`}
            onClick={() => setHabitacionSeleccionada(habitacion)}
          >
            <div className="habitacion-header">
              <h3 className="habitacion-numero">{habitacion.numero}</h3>
              <span 
                className="estado-badge"
                style={{ backgroundColor: getEstadoColor(habitacion.estado) }}
              >
                {getEstadoTexto(habitacion.estado)}
              </span>
            </div>
            
            <div className="habitacion-info">
              <h4 className="habitacion-nombre">{habitacion.nombre}</h4>
              <p className="habitacion-tipo">{habitacion.tipo}</p>
              <p className="habitacion-precio">${habitacion.precio}/noche</p>
              <p className="habitacion-capacidad">Capacidad: {habitacion.capacidad} personas</p>
            </div>

            <div className="habitacion-acciones">
              <button 
                className="btn-ver"
                onClick={(e) => {
                  e.stopPropagation();
                  setHabitacionSeleccionada(habitacion);
                }}
              >
                <FaEye />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Detalles */}
      {habitacionSeleccionada && (
        <div className="modal-overlay" onClick={() => setHabitacionSeleccionada(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Habitación {habitacionSeleccionada.numero}</h3>
              <button 
                className="btn-cerrar"
                onClick={() => setHabitacionSeleccionada(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detalle-info">
                <h4>{habitacionSeleccionada.nombre}</h4>
                <p><strong>Tipo:</strong> {habitacionSeleccionada.tipo}</p>
                <p><strong>Precio:</strong> ${habitacionSeleccionada.precio} por noche</p>
                <p><strong>Capacidad:</strong> {habitacionSeleccionada.capacidad} personas</p>
                <p><strong>Descripción:</strong> {habitacionSeleccionada.descripcion}</p>
                <p><strong>Estado:</strong> 
                  <span 
                    className="estado-texto"
                    style={{ color: getEstadoColor(habitacionSeleccionada.estado) }}
                  >
                    {getEstadoTexto(habitacionSeleccionada.estado)}
                  </span>
                </p>
              </div>

              <div className="acciones-modal">
                <button className="btn-checkin">
                  <FaKey /> Check-In
                </button>
                <button className="btn-checkout">
                  <FaKey /> Check-Out
                </button>
                <button className="btn-mantenimiento">
                  <FaWrench /> Mantenimiento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaHabitaciones;