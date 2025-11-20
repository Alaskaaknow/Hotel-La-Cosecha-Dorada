import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUsers, FaBed, FaCalendarAlt, FaStar, FaSync, FaCheck } from "react-icons/fa";
import ModalReserva from "./ModalReserva";

function HabitacionesDisponibles() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { habitaciones: habitacionesIniciales, datosBusqueda } = location.state || { 
    habitaciones: [], 
    datosBusqueda: {} 
  };

  const [habitaciones, setHabitaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);

  useEffect(() => {
    if (habitacionesIniciales && Array.isArray(habitacionesIniciales)) {
      setHabitaciones(habitacionesIniciales);
    }
    
    if (datosBusqueda.entrada && datosBusqueda.salida) {
      verificarDisponibilidadReal();
    }
  }, [datosBusqueda, habitacionesIniciales]);

  const verificarDisponibilidadReal = async () => {
    setCargando(true);
    try {
      const response = await fetch('http://localhost:5000/api/habitaciones/disponibles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosBusqueda)
      });

      if (!response.ok) {
        throw new Error('Error al verificar disponibilidad');
      }

      const resultado = await response.json();
      
      let habitacionesDisponibles = [];
      
      if (resultado.success && Array.isArray(resultado.data)) {
        habitacionesDisponibles = resultado.data;
      } else if (Array.isArray(resultado)) {
        habitacionesDisponibles = resultado;
      } else if (resultado.data && Array.isArray(resultado.data)) {
        habitacionesDisponibles = resultado.data;
      } else {
        habitacionesDisponibles = Array.isArray(habitacionesIniciales) ? habitacionesIniciales : [];
      }
      
      setHabitaciones(habitacionesDisponibles);
      
    } catch (error) {
      console.error('Error verificando disponibilidad:', error);
      if (Array.isArray(habitacionesIniciales)) {
        setHabitaciones(habitacionesIniciales);
      }
    } finally {
      setCargando(false);
    }
  };

  const habitacionesSeguras = Array.isArray(habitaciones) ? habitaciones : [];

  if (!habitacionesSeguras || habitacionesSeguras.length === 0) {
    return (
      <div style={styles.pagina}>
        <div style={styles.contenedor}>
          <button style={styles.botonVolver} onClick={() => navigate("/")}>
            <FaArrowLeft style={{ marginRight: "8px" }} />
            Volver a Búsqueda
          </button>
          <div style={styles.sinHabitaciones}>
            <div style={styles.iconoError}>🏨</div>
            <h2 style={styles.tituloError}>No hay habitaciones disponibles</h2>
            <p style={styles.textoError}>
              No encontramos habitaciones disponibles para las fechas seleccionadas.
            </p>
            <button 
              style={styles.botonBuscarOtra}
              onClick={() => navigate("/")}
            >
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
            <FaArrowLeft style={{ marginRight: "10px" }} />
            Volver
          </button>
          
          <div style={styles.tituloContainer}>
            <h1 style={styles.titulo}>Habitaciones Disponibles</h1>
            <div style={styles.subtitulo}>
              Encuentra el espacio perfecto para tu estadía
            </div>
          </div>
          
          <div style={styles.infoBusqueda}>
            <div style={styles.infoItem}>
              <FaCalendarAlt style={styles.iconoInfo} />
              <div>
                <div style={styles.infoLabel}>Check-in</div>
                <div style={styles.infoValue}>{datosBusqueda.entrada}</div>
              </div>
            </div>
            
            <div style={styles.infoItem}>
              <FaCalendarAlt style={styles.iconoInfo} />
              <div>
                <div style={styles.infoLabel}>Check-out</div>
                <div style={styles.infoValue}>{datosBusqueda.salida}</div>
              </div>
            </div>
            
            <div style={styles.infoItem}>
              <FaUsers style={styles.iconoInfo} />
              <div>
                <div style={styles.infoLabel}>Huéspedes</div>
                <div style={styles.infoValue}>
                  {datosBusqueda.adultos} adulto{datosBusqueda.adultos > 1 ? 's' : ''}
                  {datosBusqueda.ninos > 0 && `, ${datosBusqueda.ninos} niño${datosBusqueda.ninos > 1 ? 's' : ''}`}
                </div>
              </div>
            </div>
            
            <button 
              style={{
                ...styles.botonActualizar,
                ...(cargando ? styles.botonDeshabilitado : {})
              }}
              onClick={verificarDisponibilidadReal}
              disabled={cargando}
            >
              <FaSync style={{ marginRight: "8px" }} />
              {cargando ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </div>

        {/* Contador */}
        <div style={styles.contador}>
          <div style={styles.contadorContent}>
            <FaCheck style={styles.iconoContador} />
            <span style={styles.contadorTexto}>
              <strong>{habitacionesSeguras.length}</strong> habitación{habitacionesSeguras.length > 1 ? 'es' : ''} disponible{habitacionesSeguras.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Grid de Habitaciones */}
        <div style={styles.gridHabitaciones}>
          {habitacionesSeguras.map((habitacion) => (
            <div key={habitacion.id} style={styles.tarjetaHabitacion}>
              <div style={styles.contenedorImagen}>
                <img
                  src={habitacion.imagen ? `/images/${habitacion.imagen}` : '/images/habitacion-default.jpg'}
                  alt={habitacion.nombre}
                  style={styles.imagen}
                  onError={(e) => {
                    e.target.src = '/images/habitacion-default.jpg';
                  }}
                />
                <div style={styles.badgeTipo}>
                  {habitacion.tipo.toUpperCase()}
                </div>
                {habitacion.tipo === 'suite' && (
                  <div style={styles.badgePremium}>
                    <FaStar style={{ marginRight: "5px" }} />
                    PREMIUM
                  </div>
                )}
              </div>

              <div style={styles.infoHabitacion}>
                <div style={styles.headerHabitacion}>
                  <h3 style={styles.nombreHabitacion}>Habitación {habitacion.numero}</h3>
                  <div style={styles.precioContainer}>
                    <span style={styles.precioNumero}>${habitacion.precio}</span>
                    <span style={styles.precioNoche}>/noche</span>
                  </div>
                </div>
                
                <h4 style={styles.tituloHabitacion}>{habitacion.nombre}</h4>
                <p style={styles.descripcion}>{habitacion.descripcion}</p>
                
                <div style={styles.detalles}>
                  <div style={styles.detalle}>
                    <FaUsers style={styles.iconoDetalle} />
                    <span>{habitacion.capacidad} persona{habitacion.capacidad > 1 ? 's' : ''}</span>
                  </div>
                  <div style={styles.detalle}>
                    <FaBed style={styles.iconoDetalle} />
                    <span>{habitacion.tipo.charAt(0).toUpperCase() + habitacion.tipo.slice(1)}</span>
                  </div>
                  <div style={styles.estadoContainer}>
                    <div style={styles.estado}>
                      <FaCheck style={{ marginRight: "5px", fontSize: "12px" }} />
                      Disponible
                    </div>
                  </div>
                </div>

                <div style={styles.pieTarjeta}>
                  <button 
                    style={styles.botonReservar}
                    onClick={() => {
                      setHabitacionSeleccionada(habitacion);
                      setModalAbierto(true);
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

      <ModalReserva
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        habitacion={habitacionSeleccionada}
        datosBusqueda={datosBusqueda}
        onReservaConfirmada={(reserva) => {
          console.log("✅ Reserva confirmada:", reserva);
          setModalAbierto(false);
          verificarDisponibilidadReal();
          alert(`🎉 ¡Reserva confirmada!\n\nHabitación: ${reserva.habitacion}\nTotal: $${reserva.total}\nSe envió confirmación a: ${reserva.email}`);
        }}
      />
    </div>
  );
}

// ESTILOS ACTUALIZADOS CON NUEVA PALETA
const styles = {
  pagina: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #491E2E 0%, #722F37 100%)',
    padding: '30px 20px',
    fontFamily: '"Georgia", "Times New Roman", serif',
  },
  contenedor: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    background: '#F5F0E6',
    padding: '30px',
    borderRadius: '15px',
    marginBottom: '25px',
    boxShadow: '0 8px 30px rgba(73, 30, 46, 0.15)',
    border: '2px solid #FFFFFF',
  },
  botonVolver: {
    background: 'transparent',
    color: '#491E2E',
    border: '2px solid #491E2E',
    padding: '12px 24px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    transition: 'all 0.3s ease',
  },
  tituloContainer: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  titulo: {
    color: '#491E2E',
    fontSize: '2.5rem',
    margin: '0 0 10px 0',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  subtitulo: {
    color: '#722F37',
    fontSize: '1.1rem',
    fontStyle: 'italic',
  },
  infoBusqueda: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    alignItems: 'center',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: '#FFFFFF',
    borderRadius: '10px',
    border: '1px solid #F5F0E6',
    boxShadow: '0 2px 10px rgba(73, 30, 46, 0.08)',
  },
  iconoInfo: {
    color: '#491E2E',
    fontSize: '20px',
  },
  infoLabel: {
    color: '#722F37',
    fontSize: '0.9rem',
    fontWeight: '500',
    marginBottom: '4px',
  },
  infoValue: {
    color: '#491E2E',
    fontSize: '1rem',
    fontWeight: '600',
  },
  botonActualizar: {
    background: 'transparent',
    color: '#491E2E',
    border: '2px solid #491E2E',
    padding: '12px 20px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    height: 'fit-content',
  },
  botonDeshabilitado: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  contador: {
    background: 'linear-gradient(135deg, #491E2E 0%, #722F37 100%)',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '30px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(73, 30, 46, 0.3)',
  },
  contadorContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  iconoContador: {
    color: '#F5F0E6',
    fontSize: '18px',
  },
  contadorTexto: {
    color: '#F5F0E6',
    fontSize: '1.2rem',
    fontWeight: '500',
  },
  gridHabitaciones: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '30px',
  },
  tarjetaHabitacion: {
    background: '#FFFFFF',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 8px 25px rgba(73, 30, 46, 0.15)',
    border: '1px solid #F5F0E6',
    transition: 'all 0.3s ease',
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
    transition: 'transform 0.3s ease',
  },
  badgeTipo: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'rgba(73, 30, 46, 0.95)',
    color: '#F5F0E6',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  badgePremium: {
    position: 'absolute',
    top: '15px',
    left: '15px',
    background: 'rgba(245, 240, 230, 0.95)',
    color: '#491E2E',
    padding: '6px 12px',
    borderRadius: '15px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
  infoHabitacion: {
    padding: '25px',
  },
  headerHabitacion: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
  },
  nombreHabitacion: {
    color: '#722F37',
    fontSize: '0.9rem',
    fontWeight: '600',
    margin: '0',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  precioContainer: {
    textAlign: 'right',
  },
  precioNumero: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#491E2E',
    lineHeight: '1',
  },
  precioNoche: {
    fontSize: '0.9rem',
    color: '#722F37',
    display: 'block',
    marginTop: '2px',
  },
  tituloHabitacion: {
    color: '#491E2E',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    margin: '0 0 15px 0',
    lineHeight: '1.3',
  },
  descripcion: {
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '20px',
    fontSize: '0.95rem',
  },
  detalles: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '25px',
  },
  detalle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#555',
    fontSize: '0.95rem',
  },
  iconoDetalle: {
    color: '#491E2E',
    fontSize: '16px',
    width: '20px',
  },
  estadoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  estado: {
    background: '#e8f5e8',
    color: '#2e7d32',
    padding: '8px 15px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
  },
  pieTarjeta: {
    borderTop: '1px solid #F5F0E6',
    paddingTop: '20px',
  },
  botonReservar: {
    background: 'linear-gradient(135deg, #491E2E 0%, #722F37 100%)',
    color: '#FFFFFF',
    border: 'none',
    padding: '15px 30px',
    borderRadius: '25px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
    width: '100%',
    transition: 'all 0.3s ease',
    letterSpacing: '0.5px',
  },
  sinHabitaciones: {
    background: '#FFFFFF',
    padding: '80px 40px',
    borderRadius: '15px',
    textAlign: 'center',
    boxShadow: '0 8px 25px rgba(73, 30, 46, 0.1)',
    border: '1px solid #F5F0E6',
  },
  iconoError: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  tituloError: {
    color: '#491E2E',
    fontSize: '2rem',
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  textoError: {
    color: '#722F37',
    fontSize: '1.1rem',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  botonBuscarOtra: {
    background: 'linear-gradient(135deg, #491E2E 0%, #722F37 100%)',
    color: '#FFFFFF',
    border: 'none',
    padding: '15px 40px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
};

// Efectos hover
const aplicarHover = (elemento) => ({
  ...elemento,
  ':hover': {
    transform: elemento === styles.tarjetaHabitacion ? 'translateY(-5px)' : 
               elemento === styles.botonReservar ? 'translateY(-2px)' : 
               elemento === styles.botonVolver ? 'translateY(-2px)' : 'translateY(-2px)',
    boxShadow: elemento === styles.tarjetaHabitacion ? '0 15px 40px rgba(73, 30, 46, 0.2)' :
               elemento === styles.botonReservar ? '0 6px 20px rgba(73, 30, 46, 0.4)' :
               elemento === styles.botonVolver ? '0 6px 20px rgba(73, 30, 46, 0.3)' :
               '0 6px 20px rgba(73, 30, 46, 0.3)',
    ...(elemento === styles.botonVolver || elemento === styles.botonActualizar ? {
      background: '#491E2E',
      color: '#F5F0E6'
    } : {}),
    ...(elemento === styles.contenedorImagen ? {
      '& img': {
        transform: 'scale(1.05)'
      }
    } : {})
  }
});

// Aplicar efectos hover a los elementos principales
styles.botonVolver = aplicarHover(styles.botonVolver);
styles.botonActualizar = aplicarHover(styles.botonActualizar);
styles.botonReservar = aplicarHover(styles.botonReservar);
styles.botonBuscarOtra = aplicarHover(styles.botonBuscarOtra);
styles.tarjetaHabitacion = aplicarHover(styles.tarjetaHabitacion);
styles.contenedorImagen = aplicarHover(styles.contenedorImagen);

export default HabitacionesDisponibles;