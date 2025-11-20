import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes, FaDownload, FaCalendarAlt, FaUser, FaPhone, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaBed } from "react-icons/fa";

function MisReservas() {
  const [email, setEmail] = useState("");
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Si el usuario está logueado, cargar automáticamente sus reservas
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      setEmail(user.email);
      // Pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        buscarReservas();
      }, 100);
    }
  }, []);

  const buscarReservas = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      setError("Por favor ingresa tu email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("🔍 Buscando reservas para:", email);
      const response = await fetch(`http://localhost:5000/api/usuarios/${email}/reservas`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("📊 Respuesta del servidor:", data);

      if (data.success) {
        setReservas(data.data);
        console.log(`✅ ${data.data.length} reservas encontradas`);
      } else {
        setError(data.error || "Error al buscar reservas");
      }
    } catch (err) {
      console.error("❌ Error buscando reservas:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const cancelarReserva = async (reservaId) => {
    console.log("🔄 INICIANDO CANCELACIÓN - ID:", reservaId);
    
    if (!window.confirm(`¿Estás seguro de que deseas cancelar esta reserva?`)) {
      console.log("❌ Cancelación cancelada por el usuario");
      return;
    }

    try {
      console.log("📤 Enviando petición de cancelación...");
      const response = await fetch(`http://localhost:5000/api/reservas/${reservaId}/cancelar`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ motivo: "Cancelación por cliente" })
      });

      console.log("📥 Respuesta recibida, status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("📊 Datos de respuesta:", data);

      if (data.success) {
        console.log("✅ Cancelación exitosa");
        alert(`✅ Reserva cancelada exitosamente${data.reembolso ? ' con reembolso' : ''}`);
        
        // Actualizar la lista de reservas
        setReservas(prev => prev.map(reserva => 
          reserva.id === reservaId 
            ? { ...reserva, estado: 'cancelada', estado_pago: data.reembolso ? 'reembolsado' : reserva.estado_pago }
            : reserva
        ));
        console.log("🔄 Lista de reservas actualizada");
        
      } else {
        console.error("❌ Error en respuesta:", data.error);
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error("❌ Error en cancelación:", err);
      alert("❌ Error: " + err.message);
    }
  };

  const descargarComprobante = (reserva) => {
    const comprobante = `
COMPROBANTE DE RESERVA - HOTEL LA COSECHA DORADA
=================================================

INFORMACIÓN DE LA RESERVA:
-------------------------
Número de Reserva: ${reserva.id}
Habitación: ${reserva.habitacion_nombre} (${reserva.habitacion_numero})
Tipo: ${reserva.habitacion_tipo}

FECHAS:
-------
Check-in: ${formatearFecha(reserva.fecha_entrada)}
Check-out: ${formatearFecha(reserva.fecha_salida)}
Noches: ${calcularNoches(reserva.fecha_entrada, reserva.fecha_salida)}

INFORMACIÓN DEL HUÉSPED:
-----------------------
Nombre: ${reserva.cliente_nombre} ${reserva.cliente_apellido}
Email: ${reserva.cliente_email}
Teléfono: ${reserva.cliente_telefono || 'No proporcionado'}

DETALLES:
---------
Huéspedes: ${reserva.adultos} adultos, ${reserva.ninos} niños
Total: $${reserva.total}
Estado: ${reserva.estado}
Estado de pago: ${reserva.estado_pago}

FECHA DE RESERVA: ${formatearFecha(reserva.fecha_reserva)}

=================================================
¡Gracias por elegir Hotel La Cosecha Dorada!
    `;

    const blob = new Blob([comprobante], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprobante-reserva-${reserva.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calcularNoches = (entrada, salida) => {
    const fechaEntrada = new Date(entrada);
    const fechaSalida = new Date(salida);
    const diferencia = fechaSalida - fechaEntrada;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      'confirmada': { color: '#2e7d32', bgColor: '#e8f5e8', icon: FaCheckCircle },
      'pendiente': { color: '#ff9800', bgColor: '#fff3e0', icon: FaCalendarAlt },
      'cancelada': { color: '#d32f2f', bgColor: '#ffebee', icon: FaTimesCircle },
      'completada': { color: '#1976d2', bgColor: '#e3f2fd', icon: FaCheckCircle }
    };

    const estadoInfo = estados[estado] || { color: '#666', bgColor: '#f5f5f5', icon: FaCalendarAlt };
    const IconComponent = estadoInfo.icon;

    return (
      <span style={{
        ...styles.estadoBadge,
        backgroundColor: estadoInfo.bgColor,
        color: estadoInfo.color,
        border: `1px solid ${estadoInfo.color}`
      }}>
        <IconComponent style={{ marginRight: "5px" }} />
        {estado.toUpperCase()}
      </span>
    );
  };

  const puedeCancelar = (reserva) => {
    if (reserva.estado !== 'confirmada') return false;
    
    const fechaEntrada = new Date(reserva.fecha_entrada);
    const hoy = new Date();
    const diferenciaDias = Math.ceil((fechaEntrada - hoy) / (1000 * 60 * 60 * 24));
    
    return diferenciaDias > 0;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Mis Reservas</h1>
        <p style={styles.subtitle}>Consulta y gestiona tus reservas</p>
      </div>

      {/* Formulario de búsqueda */}
      <div style={styles.searchSection}>
        <form onSubmit={buscarReservas} style={styles.searchForm}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <FaSearch style={{ marginRight: "8px" }} />
              Ingresa tu email para buscar reservas
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              style={styles.input}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{
              ...styles.searchButton,
              backgroundColor: loading ? "#ccc" : "#5c2a3d"
            }}
          >
            {loading ? "Buscando..." : "Buscar Reservas"}
          </button>
        </form>
      </div>

      {error && (
        <div style={styles.errorMessage}>
          <FaTimesCircle style={{ marginRight: "8px" }} />
          {error}
        </div>
      )}

      {/* Lista de reservas */}
      {reservas.length > 0 && (
        <div style={styles.reservasSection}>
          <h2 style={styles.reservasTitle}>
            {reservas.length} Reserva{reservas.length !== 1 ? 's' : ''} Encontrada{reservas.length !== 1 ? 's' : ''}
          </h2>
          
          <div style={styles.reservasGrid}>
            {reservas.map((reserva) => (
              <div key={reserva.id} style={styles.reservaCard}>
                
                {/* Header */}
                <div style={styles.cardHeader}>
                  <div style={styles.reservaInfo}>
                    <div style={styles.reservaHeaderLeft}>
                      <FaBed style={{ marginRight: "8px", color: "#5c2a3d" }} />
                      <h3 style={styles.reservaNumber}>Reserva #{reserva.id}</h3>
                    </div>
                    {getEstadoBadge(reserva.estado)}
                  </div>
                </div>

                {/* Detalles */}
                <div style={styles.reservaDetails}>
                  <div style={styles.detailRow}>
                    <strong>Habitación:</strong> 
                    <span style={styles.habitacionInfo}>
                      {reserva.habitacion_nombre} (Habitación {reserva.habitacion_numero}) - {reserva.habitacion_tipo}
                    </span>
                  </div>
                  
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}>
                      <FaCalendarAlt style={{ marginRight: "8px", color: "#5c2a3d" }} />
                      <div>
                        <strong>Check-in:</strong>
                        <div>{formatearFecha(reserva.fecha_entrada)}</div>
                      </div>
                    </div>
                    
                    <div style={styles.detailItem}>
                      <FaCalendarAlt style={{ marginRight: "8px", color: "#5c2a3d" }} />
                      <div>
                        <strong>Check-out:</strong>
                        <div>{formatearFecha(reserva.fecha_salida)}</div>
                      </div>
                    </div>
                    
                    <div style={styles.detailItem}>
                      <FaUser style={{ marginRight: "8px", color: "#5c2a3d" }} />
                      <div>
                        <strong>Huéspedes:</strong>
                        <div>{reserva.adultos} adultos, {reserva.ninos} niños</div>
                      </div>
                    </div>
                    
                    <div style={styles.detailItem}>
                      <FaMoneyBillWave style={{ marginRight: "8px", color: "#5c2a3d" }} />
                      <div>
                        <strong>Total:</strong>
                        <div>${reserva.total}</div>
                      </div>
                    </div>
                  </div>

                  <div style={styles.metadata}>
                    <div style={styles.metaItem}>
                      <strong>Estado de pago:</strong> {reserva.estado_pago}
                    </div>
                    <div style={styles.metaItem}>
                      <strong>Fecha de reserva:</strong> {formatearFecha(reserva.fecha_reserva)}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div style={styles.cardActions}>
                  <button 
                    style={styles.downloadButton}
                    onClick={() => descargarComprobante(reserva)}
                    title="Descargar comprobante"
                  >
                    <FaDownload style={{ marginRight: "5px" }} />
                    Descargar
                  </button>
                  
                  {puedeCancelar(reserva) && (
                    <button 
                      style={styles.cancelButton}
                      onClick={() => cancelarReserva(reserva.id)}
                      title="Cancelar reserva"
                    >
                      <FaTimes style={{ marginRight: "5px" }} />
                      Cancelar
                    </button>
                  )}

                  {reserva.estado === 'cancelada' && reserva.estado_pago === 'reembolsado' && (
                    <span style={styles.reembolsoInfo}>
                      ✅ Reembolsado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reservas.length === 0 && !loading && email && (
        <div style={styles.noResults}>
          <FaBed style={{ fontSize: "3rem", color: "#ccc", marginBottom: "1rem" }} />
          <h3>No se encontraron reservas</h3>
          <p>No hay reservas asociadas al email {email}</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f4e9 0%, #f1e8d8 100%)',
    padding: '40px 20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    color: '#5c2a3d',
    fontSize: '2.5rem',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1rem',
  },
  searchSection: {
    background: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '0 auto 30px',
  },
  searchForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    color: '#5c2a3d',
    fontWeight: 'bold',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    padding: '12px 15px',
    border: '2px solid #e8d0d9',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
  },
  searchButton: {
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  errorMessage: {
    background: '#ffebee',
    color: '#d32f2f',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '600px',
    margin: '0 auto 20px',
  },
  reservasSection: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  reservasTitle: {
    color: '#5c2a3d',
    marginBottom: '20px',
    textAlign: 'center',
  },
  reservasGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  reservaCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    border: '1px solid #e8d0d9',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  cardHeader: {
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f0f0',
  },
  reservaInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reservaHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  reservaNumber: {
    color: '#5c2a3d',
    margin: 0,
    fontSize: '1.3rem',
  },
  estadoBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
  reservaDetails: {
    marginBottom: '20px',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    color: '#555',
    fontSize: '1.1rem',
  },
  habitacionInfo: {
    marginLeft: '10px',
    fontWeight: 'bold',
    color: '#5c2a3d',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '15px',
    background: '#f8f4e9',
    borderRadius: '8px',
  },
  metadata: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    padding: '15px',
    background: '#f9f9f9',
    borderRadius: '8px',
    fontSize: '0.9rem',
  },
  metaItem: {
    color: '#666',
  },
  cardActions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTop: '1px solid #f0f0f0',
    paddingTop: '20px',
  },
  downloadButton: {
    background: 'transparent',
    color: '#5c2a3d',
    border: '2px solid #5c2a3d',
    padding: '10px 20px',
    borderRadius: '25px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },
  cancelButton: {
    background: '#d32f2f',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '25px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s ease',
  },
  reembolsoInfo: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  noResults: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
    background: 'white',
    borderRadius: '15px',
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  },
};

export default MisReservas;