import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaDownload, FaHome, FaEnvelope, FaCalendarAlt, FaUser } from "react-icons/fa";

function ConfirmacionReserva() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reserva } = location.state || {};

  if (!reserva) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <h2>No se encontraron datos de reserva</h2>
          <button onClick={() => navigate("/")} style={styles.homeButton}>
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  const descargarComprobante = () => {
    const comprobante = `
      COMPROBANTE DE RESERVA - HOTEL LA COSECHA DORADA
      ================================================
      
      Número de Reserva: ${reserva.numero_reserva}
      Fecha de Emisión: ${new Date().toLocaleDateString()}
      
      DATOS DEL CLIENTE:
      ------------------
      Nombre: ${reserva.cliente_nombre} ${reserva.cliente_apellido}
      Email: ${reserva.cliente_email}
      Teléfono: ${reserva.cliente_telefono || 'No proporcionado'}
      
      DATOS DE LA RESERVA:
      --------------------
      Habitación: ${reserva.habitacion_nombre} (${reserva.habitacion_numero})
      Check-in: ${reserva.fecha_entrada}
      Check-out: ${reserva.fecha_salida}
      Huéspedes: ${reserva.adultos} adultos, ${reserva.ninos} niños
      Noches: ${reserva.noches}
      
      DETALLES DE PAGO:
      -----------------
      Total: $${reserva.total}
      Estado: Confirmada
      ID de Pago: ${reserva.pago_id}
      
      INFORMACIÓN IMPORTANTE:
      -----------------------
      • Check-in: 3:00 PM
      • Check-out: 12:00 PM
      • Política de cancelación: Reembolso completo hasta 48 horas antes
      
      Gracias por elegir Hotel La Cosecha Dorada
      📞 Contacto: +1 234-567-8900
      📍 Dirección: Viñedos La Cosecha, Valle del Vino
    `;

    const blob = new Blob([comprobante], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprobante-${reserva.numero_reserva}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container}>
      <div style={styles.confirmationCard}>
        {/* Icono de éxito */}
        <div style={styles.successIcon}>
          <FaCheckCircle />
        </div>

        {/* Título */}
        <h1 style={styles.title}>¡Reserva Confirmada!</h1>
        <p style={styles.subtitle}>
          Tu reserva ha sido procesada exitosamente. Hemos enviado un email de confirmación a{" "}
          <strong>{reserva.cliente_email}</strong>
        </p>

        {/* Número de reserva */}
        <div style={styles.reservaNumber}>
          Número de Reserva: <strong>{reserva.numero_reserva}</strong>
        </div>

        {/* Detalles de la reserva */}
        <div style={styles.detailsGrid}>
          <div style={styles.detailItem}>
            <FaUser style={styles.detailIcon} />
            <div>
              <strong>Cliente</strong>
              <p>{reserva.cliente_nombre} {reserva.cliente_apellido}</p>
            </div>
          </div>

          <div style={styles.detailItem}>
            <FaEnvelope style={styles.detailIcon} />
            <div>
              <strong>Email</strong>
              <p>{reserva.cliente_email}</p>
            </div>
          </div>

          <div style={styles.detailItem}>
            <FaCalendarAlt style={styles.detailIcon} />
            <div>
              <strong>Check-in</strong>
              <p>{reserva.fecha_entrada}</p>
            </div>
          </div>

          <div style={styles.detailItem}>
            <FaCalendarAlt style={styles.detailIcon} />
            <div>
              <strong>Check-out</strong>
              <p>{reserva.fecha_salida}</p>
            </div>
          </div>

          <div style={styles.detailItem}>
            <div>
              <strong>Habitación</strong>
              <p>{reserva.habitacion_nombre} ({reserva.habitacion_numero})</p>
            </div>
          </div>

          <div style={styles.detailItem}>
            <div>
              <strong>Huéspedes</strong>
              <p>{reserva.adultos} adultos, {reserva.ninos} niños</p>
            </div>
          </div>

          <div style={styles.detailItem}>
            <div>
              <strong>Noches</strong>
              <p>{reserva.noches}</p>
            </div>
          </div>

          <div style={styles.detailItem}>
            <div>
              <strong>Total</strong>
              <p style={styles.total}>${reserva.total}</p>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div style={styles.additionalInfo}>
          <h3 style={styles.infoTitle}>Información Importante</h3>
          <ul style={styles.infoList}>
            <li>🕒 Check-in: 3:00 PM</li>
            <li>🕛 Check-out: 12:00 PM</li>
            <li>💰 Política de cancelación: Reembolso completo hasta 48 horas antes</li>
            <li>📧 Se ha enviado un email de confirmación con todos los detalles</li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div style={styles.actions}>
          <button 
            onClick={descargarComprobante}
            style={styles.downloadButton}
          >
            <FaDownload style={{ marginRight: "8px" }} />
            Descargar Comprobante
          </button>
          
          <button 
            onClick={() => navigate("/")}
            style={styles.homeButton}
          >
            <FaHome style={{ marginRight: "8px" }} />
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #7B2C3F 0%, #5A1C2B 100%)',
    padding: '40px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    background: 'white',
    padding: '40px',
    borderRadius: '15px',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  },
  confirmationCard: {
    background: 'white',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
    maxWidth: '700px',
    width: '100%',
    textAlign: 'center',
  },
  successIcon: {
    fontSize: '4rem',
    color: '#4CAF50',
    marginBottom: '20px',
  },
  title: {
    color: '#5c2a3d',
    fontSize: '2.2rem',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#666',
    fontSize: '1.1rem',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  reservaNumber: {
    background: '#f8f4e9',
    padding: '15px',
    borderRadius: '10px',
    fontSize: '1.2rem',
    color: '#5c2a3d',
    marginBottom: '30px',
    border: '2px solid #e8d0d9',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    background: '#f9f9f9',
    borderRadius: '10px',
    textAlign: 'left',
  },
  detailIcon: {
    color: '#5c2a3d',
    fontSize: '1.2rem',
  },
  total: {
    color: '#5c2a3d',
    fontSize: '1.3rem',
    fontWeight: 'bold',
  },
  additionalInfo: {
    background: '#e8f5e8',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '30px',
    textAlign: 'left',
  },
  infoTitle: {
    color: '#2e7d32',
    marginBottom: '15px',
  },
  infoList: {
    color: '#555',
    lineHeight: '1.8',
    paddingLeft: '20px',
  },
  actions: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  downloadButton: {
    background: '#5c2a3d',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '25px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  homeButton: {
    background: 'transparent',
    color: '#5c2a3d',
    border: '2px solid #5c2a3d',
    padding: '12px 25px',
    borderRadius: '25px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
};

// Efectos hover
styles.downloadButton[':hover'] = {
  background: '#472031',
  transform: 'translateY(-2px)',
};

styles.homeButton[':hover'] = {
  background: '#5c2a3d',
  color: 'white',
  transform: 'translateY(-2px)',
};

export default ConfirmacionReserva;