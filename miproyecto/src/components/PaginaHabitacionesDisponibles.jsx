import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUsers, FaBed, FaCalendarAlt } from "react-icons/fa";

function PaginaHabitacionesDisponibles() {
  const location = useLocation();
  const navigate = useNavigate();
  const { habitaciones, datosBusqueda } = location.state || { habitaciones: [], datosBusqueda: {} };

  if (!habitaciones || habitaciones.length === 0) {
    return (
      <div style={styles.pagina}>
        <div style={styles.contenedor}>
          <button style={styles.botonVolver} onClick={() => navigate("/")}>
            <FaArrowLeft style={{ marginRight: "8px" }} />
            Volver a Búsqueda
          </button>
          <div style={styles.sinHabitaciones}>
            <h2>No hay habitaciones disponibles</h2>
            <p>No encontramos habitaciones disponibles para las fechas seleccionadas.</p>
            <button style={styles.botonBuscarOtra} onClick={() => navigate("/")}>
              Intentar con otras fechas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pagina}>
      <div style={styles.contenedor}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.botonVolver} onClick={() => navigate("/")}>
            <FaArrowLeft style={{ marginRight: "8px" }} />
            Volver
          </button>
          <h1 style={styles.titulo}>Habitaciones Disponibles</h1>
          <div style={styles.infoBusqueda}>
            <div style={styles.fechaItem}>
              <FaCalendarAlt style={{ marginRight: "8px", color: "#5c2a3d" }} />
              <span><strong>Entrada:</strong> {datosBusqueda.entrada}</span>
            </div>
            <div style={styles.fechaItem}>
              <FaCalendarAlt style={{ marginRight: "8px", color: "#5c2a3d" }} />
              <span><strong>Salida:</strong> {datosBusqueda.salida}</span>
            </div>
            <div style={styles.huespedes}>
              <FaUsers style={{ marginRight: "8px", color: "#5c2a3d" }} />
              <span>{datosBusqueda.adultos} adulto{datosBusqueda.adultos > 1 ? 's' : ''}</span>
              {datosBusqueda.ninos > 0 && (
                <span style={{ marginLeft: "10px" }}>
                  {datosBusqueda.ninos} niño{datosBusqueda.ninos > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Grid de Habitaciones */}
        <div style={styles.gridHabitaciones}>
          {habitaciones.map((habitacion) => (
            <div key={habitacion.id} style={styles.tarjetaHabitacion}>
              {/* Imagen */}
              <div style={styles.contenedorImagen}>
                <img
                  src={habitacion.imagen ? `/images/${habitacion.imagen}` : '/images/habitacion-default.jpg'}
                  alt={habitacion.nombre}
                  style={styles.imagen}
                  onError={(e) => {
                    e.target.src = '/images/habitacion-default.jpg';
                  }}
                />
                <div style={styles.badgeTipo}>{habitacion.tipo}</div>
              </div>

              {/* Información */}
              <div style={styles.infoHabitacion}>
                <h3 style={styles.nombreHabitacion}>Habitación {habitacion.numero}</h3>
                <h4 style={styles.tituloHabitacion}>{habitacion.nombre}</h4>
                <p style={styles.descripcion}>{habitacion.descripcion}</p>
                
                <div style={styles.detalles}>
                  <div style={styles.detalle}>
                    <FaUsers style={styles.icono} />
                    <span>Capacidad: {habitacion.capacidad} personas</span>
                  </div>
                  <div style={styles.detalle}>
                    <FaBed style={styles.icono} />
                    <span>Tipo: {habitacion.tipo}</span>
                  </div>
                  <div style={styles.detalle}>
                    <span style={styles.estado}>{habitacion.estado}</span>
                  </div>
                </div>

                {/* Precio y Botón */}
                <div style={styles.pieTarjeta}>
                  <div style={styles.precio}>
                    <span style={styles.precioNumero}>${habitacion.precio}</span>
                    <span style={styles.precioNoche}>/noche</span>
                  </div>
                  <button 
                    style={styles.botonReservar}
                    onClick={() => {
                      // Aquí irá la lógica de reserva
                      alert(`Procesando reserva para habitación ${habitacion.numero}`);
                    }}
                  >
                    Reservar Ahora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Estilos elegantes con fondo vino
const styles = {
  pagina: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #7B2C3F 0%, #5A1C2B 100%)',
    padding: '40px 20px',
    fontFamily: '"Georgia", "Times New Roman", serif',
  },
  contenedor: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '30px',
    borderRadius: '15px',
    marginBottom: '40px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  },
  botonVolver: {
    background: 'transparent',
    color: '#5c2a3d',
    border: '2px solid #5c2a3d',
    padding: '10px 20px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
  },
  titulo: {
    color: '#5c2a3d',
    fontSize: '2.5rem',
    marginBottom: '20px',
    textAlign: 'center',
  },
  infoBusqueda: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
  },
  fechaItem: {
    display: 'flex',
    alignItems: 'center',
    color: '#666',
    fontSize: '16px',
  },
  huespedes: {
    display: 'flex',
    alignItems: 'center',
    color: '#666',
    fontSize: '16px',
  },
  gridHabitaciones: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '30px',
  },
  tarjetaHabitacion: {
    background: '#F8F4E9',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  contenedorImagen: {
    position: 'relative',
    height: '250px',
    overflow: 'hidden',
  },
  imagen: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  badgeTipo: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'rgba(92, 42, 61, 0.9)',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  infoHabitacion: {
    padding: '25px',
  },
  nombreHabitacion: {
    color: '#5c2a3d',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
    textTransform: 'uppercase',
  },
  tituloHabitacion: {
    color: '#2C1A1D',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
  },
  descripcion: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  detalles: {
    marginBottom: '20px',
  },
  detalle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    color: '#555',
  },
  icono: {
    marginRight: '10px',
    color: '#5c2a3d',
  },
  estado: {
    background: '#e8f5e8',
    color: '#2e7d32',
    padding: '4px 12px',
    borderRadius: '15px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  pieTarjeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #E8DECD',
    paddingTop: '20px',
  },
  precio: {
    textAlign: 'left',
  },
  precioNumero: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#5c2a3d',
  },
  precioNoche: {
    fontSize: '0.9rem',
    color: '#666',
    marginLeft: '5px',
  },
  botonReservar: {
    background: 'linear-gradient(135deg, #5c2a3d 0%, #7B2C3F 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '25px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(92, 42, 61, 0.3)',
  },
  sinHabitaciones: {
    background: '#F8F4E9',
    padding: '60px 40px',
    borderRadius: '15px',
    textAlign: 'center',
    color: '#666',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
  },
  botonBuscarOtra: {
    background: '#5c2a3d',
    color: 'white',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '20px',
  },
};

// Efectos hover
styles.botonVolver[':hover'] = {
  background: '#5c2a3d',
  color: 'white',
};

styles.tarjetaHabitacion[':hover'] = {
  transform: 'translateY(-5px)',
  boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
};

styles.botonReservar[':hover'] = {
  transform: 'translateY(-2px)',
  boxShadow: '0 6px 20px rgba(92, 42, 61, 0.4)',
};

export default PaginaHabitacionesDisponibles;