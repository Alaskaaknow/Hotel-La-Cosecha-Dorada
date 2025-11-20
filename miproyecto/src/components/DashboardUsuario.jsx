import React, { useState, useEffect } from "react";
import {
  FaBed,
  FaCalendarAlt,
  FaFilePdf,
  FaSignOutAlt,
  FaUser,
  FaChartLine,
  FaHome,
  FaMoneyBillWave,
  FaUsers,
  FaClock,
  FaCrown,
  FaSun,
  FaUmbrellaBeach
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function DashboardUsuario() {
  const [user, setUser] = useState(null);
  const [seccionActiva, setSeccionActiva] = useState("reservaciones");
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(userData);
    cargarReservas();
  }, [navigate]);

  const cargarReservas = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      console.log("🔍 Cargando reservas para:", userData.email);

      const response = await fetch(`http://localhost:5000/api/usuarios/${userData.email}/reservas`);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log("📊 Respuesta del servidor:", result);

      if (result.success) {
        setReservas(result.data);
        console.log("✅ Reservas cargadas:", result.data.length);
      } else {
        console.error("Error al cargar reservas:", result.error);
      }
    } catch (error) {
      console.error("Error cargando reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelarReserva = async (reservaId) => {
    try {
      console.log("🔄 Cancelando reserva:", reservaId);

      if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?\n\nEsta acción no se puede deshacer.')) {
        return;
      }

      const response = await fetch(`http://localhost:5000/api/reservas/${reservaId}/cancelar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motivo: "Cancelación solicitada por el cliente" })
      });

      const data = await response.json();
      console.log("📊 Respuesta cancelación:", data);

      if (data.success) {
        alert(`✅ Reserva cancelada exitosamente${data.reembolso ? '\n💰 Se procesará el reembolso correspondiente' : ''}`);
        cargarReservas();
      } else {
        alert("❌ Error al cancelar: " + data.error);
      }
    } catch (error) {
      console.error("❌ Error en cancelación:", error);
      alert("❌ Error de conexión al cancelar la reserva");
    }
  };

  const generarPDF = (reserva) => {
    const contenido = `
      <html>
        <head>
          <title>Comprobante de Reserva - ${reserva.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; color: #491E2E; border-bottom: 2px solid #491E2E; padding-bottom: 10px; }
            .info { margin: 20px 0; }
            .section { background: #F5F0E6; padding: 15px; margin: 10px 0; border-radius: 8px; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
            .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Hotel La Cosecha Dorada</h1>
            <h2>Comprobante de Reserva</h2>
          </div>
          
          <div class="info">
            <div class="section">
              <h3>Información de la Reserva</h3>
              <p><strong>Número de Reserva:</strong> ${reserva.id}</p>
              <p><strong>Fecha de Reserva:</strong> ${new Date(reserva.fecha_reserva).toLocaleDateString()}</p>
              <p><strong>Estado:</strong> ${reserva.estado}</p>
            </div>
            
            <div class="detail-grid">
              <div class="section">
                <h3>Detalles de la Habitación</h3>
                <p><strong>Habitación:</strong> ${reserva.habitacion_nombre}</p>
                <p><strong>Número:</strong> ${reserva.habitacion_numero}</p>
                <p><strong>Tipo:</strong> ${reserva.habitacion_tipo}</p>
              </div>
              
              <div class="section">
                <h3>Fechas de Estadia</h3>
                <p><strong>Check-in:</strong> ${new Date(reserva.fecha_entrada).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> ${new Date(reserva.fecha_salida).toLocaleDateString()}</p>
                <p><strong>Noches:</strong> ${calcularNoches(reserva.fecha_entrada, reserva.fecha_salida)}</p>
              </div>
            </div>
            
            <div class="section">
              <h3>Información del Huésped</h3>
              <p><strong>Nombre:</strong> ${reserva.cliente_nombre} ${reserva.cliente_apellido}</p>
              <p><strong>Email:</strong> ${reserva.cliente_email}</p>
              <p><strong>Teléfono:</strong> ${reserva.cliente_telefono || 'No proporcionado'}</p>
            </div>
            
            <div class="section">
              <h3>Información de Pago</h3>
              <p><strong>Total:</strong> $${reserva.total}</p>
              <p><strong>Estado del Pago:</strong> ${reserva.estado_pago}</p>
              <p><strong>Referencia de Pago:</strong> ${reserva.pago_id}</p>
            </div>
          </div>
          
          <div class="footer">
            <p>¡Gracias por elegir Hotel La Cosecha Dorada!</p>
            <p>Para cualquier consulta, contacte a: info@hotellacosechadorada.com</p>
          </div>
        </body>
      </html>
    `;

    const ventana = window.open('', '_blank');
    ventana.document.write(contenido);
    ventana.document.close();
    ventana.print();
  };

  const calcularNoches = (entrada, salida) => {
    const fechaEntrada = new Date(entrada);
    const fechaSalida = new Date(salida);
    const diferencia = fechaSalida - fechaEntrada;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleIrInicio = () => {
    navigate('/');
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      'confirmada': { color: '#2e7d32', bgColor: '#e8f5e8', texto: 'CONFIRMADA' },
      'pendiente': { color: '#ff9800', bgColor: '#fff3cd', texto: 'PENDIENTE' },
      'cancelada': { color: '#d32f2f', bgColor: '#f8d7da', texto: 'CANCELADA' },
      'completada': { color: '#1976d2', bgColor: '#e3f2fd', texto: 'COMPLETADA' }
    };

    const estadoInfo = estados[estado] || { color: '#666', bgColor: '#f5f5f5', texto: estado };

    return (
      <span style={{
        padding: '6px 12px',
        borderRadius: '15px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        backgroundColor: estadoInfo.bgColor,
        color: estadoInfo.color,
        border: `1px solid ${estadoInfo.color}`
      }}>
        {estadoInfo.texto}
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

  if (!user) {
    return (
      <div style={styles.cargandoContainer}>
        <div style={styles.spinner}></div>
        <p>Cargando información del usuario...</p>
      </div>
    );
  }

  return (
    <div style={styles.contenedor}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.headerSidebar}>
          <div style={styles.avatar}>
            <FaUser size={40} color="#F5F0E6" />
          </div>
          <h3 style={styles.nombreUsuario}>{user.nombre} {user.apellido}</h3>
          <p style={styles.emailUsuario}>{user.email}</p>
          <p style={styles.rolUsuario}>
            {user.role === 'cliente' ? <><FaUser style={{ marginRight: '5px' }} /> Cliente</> :
              user.role === 'administrador' ? <><FaCrown style={{ marginRight: '5px' }} /> Administrador</> :
                user.role === 'recepcionista' ? <><FaUser style={{ marginRight: '5px' }} /> Recepcionista</> : 'Usuario'}
          </p>
        </div>

        <nav style={styles.menu}>
          <button
            style={{
              ...styles.botonMenu,
              ...(seccionActiva === "reservaciones" ? styles.botonMenuActivo : {})
            }}
            onClick={() => setSeccionActiva("reservaciones")}
          >
            <FaBed /> Mis Reservaciones
          </button>

          <button
            style={{
              ...styles.botonMenu,
              ...(seccionActiva === "temporada" ? styles.botonMenuActivo : {})
            }}
            onClick={() => setSeccionActiva("temporada")}
          >
            <FaChartLine /> Temporadas
          </button>

          <button
            style={styles.botonMenu}
            onClick={handleIrInicio}
          >
            <FaHome /> Volver al Inicio
          </button>

          <button
            style={styles.botonCerrarSesion}
            onClick={handleCerrarSesion}
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </nav>
      </div>

      {/* Contenido Principal */}
      <div style={styles.contenidoPrincipal}>
        <header style={styles.headerPrincipal}>
          <h1 style={styles.tituloPrincipal}>
            {seccionActiva === "reservaciones" && <><FaBed style={styles.iconoTitulo} /> Mis Reservaciones</>}
            {seccionActiva === "temporada" && <><FaChartLine style={styles.iconoTitulo} /> Temporadas y Tarifas</>}
          </h1>
          <p style={styles.bienvenida}>
            Bienvenido/a, {user.nombre} {user.apellido}
          </p>
        </header>

        <main style={styles.main}>
          {seccionActiva === "reservaciones" && (
            <div>
              {loading ? (
                <div style={styles.cargando}>
                  <div style={styles.spinner}></div>
                  <p>Cargando reservaciones...</p>
                </div>
              ) : reservas.length === 0 ? (
                <div style={styles.sinReservas}>
                  <FaBed style={{ fontSize: "4rem", color: "#722F37", marginBottom: "1rem" }} />
                  <h3>No tienes reservaciones activas</h3>
                  <p>Cuando hagas una reserva, aparecerá aquí.</p>
                  <button
                    style={styles.botonReservar}
                    onClick={handleIrInicio}
                  >
                    Hacer una Reserva
                  </button>
                </div>
              ) : (
                <div style={styles.listaReservas}>
                  <div style={styles.contadorReservas}>
                    <FaBed style={{ marginRight: "10px" }} />
                    Tienes {reservas.length} reserva{reservas.length > 1 ? 's' : ''} activa{reservas.length > 1 ? 's' : ''}
                  </div>

                  {reservas.map((reserva) => (
                    <div key={reserva.id} style={styles.tarjetaReserva}>
                      <div style={styles.headerReserva}>
                        <div>
                          <h3 style={styles.nombreHabitacion}>{reserva.habitacion_nombre}</h3>
                          <p style={styles.numeroHabitacion}>
                            <FaBed style={{ marginRight: "5px" }} />
                            Habitación #{reserva.habitacion_numero} • {reserva.habitacion_tipo}
                          </p>
                        </div>
                        {getEstadoBadge(reserva.estado)}
                      </div>

                      <div style={styles.detallesReserva}>
                        <div style={styles.columnaDetalles}>
                          <div style={styles.detalleItem}>
                            <FaCalendarAlt style={styles.iconoDetalle} />
                            <div>
                              <strong>Check-in:</strong>
                              <div>{formatearFecha(reserva.fecha_entrada)}</div>
                            </div>
                          </div>

                          <div style={styles.detalleItem}>
                            <FaCalendarAlt style={styles.iconoDetalle} />
                            <div>
                              <strong>Check-out:</strong>
                              <div>{formatearFecha(reserva.fecha_salida)}</div>
                            </div>
                          </div>

                          <div style={styles.detalleItem}>
                            <FaClock style={styles.iconoDetalle} />
                            <div>
                              <strong>Noches:</strong>
                              <div>{calcularNoches(reserva.fecha_entrada, reserva.fecha_salida)}</div>
                            </div>
                          </div>
                        </div>

                        <div style={styles.columnaDetalles}>
                          <div style={styles.detalleItem}>
                            <FaUsers style={styles.iconoDetalle} />
                            <div>
                              <strong>Huéspedes:</strong>
                              <div>{reserva.adultos} adultos, {reserva.ninos} niños</div>
                            </div>
                          </div>

                          <div style={styles.detalleItem}>
                            <FaMoneyBillWave style={styles.iconoDetalle} />
                            <div>
                              <strong>Total:</strong>
                              <div>$${reserva.total}</div>
                            </div>
                          </div>

                          <div style={styles.detalleItem}>
                            <div>
                              <strong>Estado Pago:</strong>
                              <div style={{
                                color: reserva.estado_pago === 'completado' ? '#2e7d32' :
                                  reserva.estado_pago === 'reembolsado' ? '#d32f2f' :
                                    reserva.estado_pago === 'pendiente' ? '#ff9800' : '#666',
                                fontWeight: 'bold'
                              }}>
                                {reserva.estado_pago}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div style={styles.accionesReserva}>
                        <button
                          onClick={() => generarPDF(reserva)}
                          style={styles.botonPDF}
                          title="Descargar comprobante"
                        >
                          <FaFilePdf /> Descargar PDF
                        </button>

                        {puedeCancelar(reserva) && (
                          <button
                            style={styles.botonCancelar}
                            onClick={() => cancelarReserva(reserva.id)}
                            title="Cancelar reserva"
                          >
                            <FaSignOutAlt /> Cancelar Reserva
                          </button>
                        )}

                        {reserva.estado === 'cancelada' && reserva.estado_pago === 'reembolsado' && (
                          <span style={styles.reembolsoInfo}>
                            ✅ Reembolso procesado
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {seccionActiva === "temporada" && (
            <div style={styles.seccionContenido}>
              <h2 style={styles.tituloSeccion}>Temporadas y Tarifas</h2>
              <p style={styles.descripcionTemporada}>
                Consulta las temporadas del año y sus tarifas correspondientes para planificar tu estadía.
              </p>

              <div style={styles.infoTemporada}>
                <div style={styles.tarjetaTemporada}>
                  <h3 style={styles.tituloTemporada}><FaUmbrellaBeach style={styles.iconoTemporada} /> Temporada Alta</h3>
                  <div style={styles.detallesTemporada}>
                    <p><strong>Fechas:</strong> Diciembre - Febrero</p>
                    <p><strong>Incremento:</strong> +20% en tarifas</p>
                    <p><strong>Características:</strong> Periodo de mayor demanda, recomendamos reservar con anticipación.</p>
                  </div>
                </div>

                <div style={styles.tarjetaTemporada}>
                  <h3 style={styles.tituloTemporada}><FaSun style={styles.iconoTemporada} /> Temporada Media</h3>
                  <div style={styles.detallesTemporada}>
                    <p><strong>Fechas:</strong> Marzo - Mayo, Septiembre - Noviembre</p>
                    <p><strong>Incremento:</strong> +10% en tarifas</p>
                    <p><strong>Características:</strong> Clima agradable, perfecto para disfrutar del viñedo.</p>
                  </div>
                </div>

                <div style={styles.tarjetaTemporada}>
                  <h3 style={styles.tituloTemporada}><FaSun style={styles.iconoTemporada} /> Temporada Baja</h3>
                  <div style={styles.detallesTemporada}>
                    <p><strong>Fechas:</strong> Junio - Agosto</p>
                    <p><strong>Descuento:</strong> -15% en tarifas</p>
                    <p><strong>Características:</strong> Ofertas especiales, menor afluencia de visitantes.</p>
                  </div>
                </div>
              </div>

              <div style={styles.notaTemporada}>
                <p>
                  <FaChartLine style={{ marginRight: '10px' }} />
                  <strong>Nota:</strong> Los precios mostrados en las habitaciones ya incluyen
                  los ajustes según la temporada. Las tarifas pueden variar en festivos y fines de semana especiales.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Estilos actualizados con nueva paleta de colores
const styles = {
  contenedor: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#F5F0E6',
  },
  cargandoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #491E2E',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  sidebar: {
    width: '300px',
    backgroundColor: '#491E2E',
    color: '#F5F0E6',
    padding: '20px 0',
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
  },
  headerSidebar: {
    textAlign: 'center',
    padding: '20px',
    borderBottom: '1px solid #722F37',
  },
  avatar: {
    width: '80px',
    height: '80px',
    backgroundColor: '#722F37',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 15px',
  },
  nombreUsuario: {
    margin: '10px 0 5px 0',
    fontSize: '1.2rem',
    color: '#F5F0E6',
  },
  emailUsuario: {
    color: '#F5F0E6',
    opacity: 0.8,
    fontSize: '0.9rem',
    margin: '0 0 5px 0',
  },
  rolUsuario: {
    color: '#F5F0E6',
    fontSize: '0.8rem',
    backgroundColor: '#722F37',
    padding: '4px 12px',
    borderRadius: '12px',
    display: 'inline-flex',
    alignItems: 'center',
    margin: 0,
  },
  menu: {
    padding: '20px 0',
  },
  botonMenu: {
    width: '100%',
    background: 'none',
    border: 'none',
    color: '#ffffffff',
    padding: '15px 30px',
    textAlign: 'left',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.3s ease',
  },
  botonMenuActivo: {
    backgroundColor: '#5a1828',  // Un tono más oscuro del color principal
    color: '#F5F0E6',
    borderRight: '3px solid #F5F0E6',
  },
  botonCerrarSesion: {
    width: '100%',
    background: 'none',
    border: 'none',
    color: '#F5F0E6',
    padding: '15px 30px',
    textAlign: 'left',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.3s ease',
    marginTop: '20px',
    borderTop: '1px solid #722F37',
  },
  contenidoPrincipal: {
    flex: 1,
    padding: '30px',
    marginLeft: '300px',
  },
  headerPrincipal: {
    marginBottom: '30px',
  },
  tituloPrincipal: {
    color: '#491E2E',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
  },
  iconoTitulo: {
    marginRight: '10px',
    color: '#722F37',
  },
  bienvenida: {
    color: '#722F37',
    fontSize: '1.1rem',
    marginTop: '10px',
  },
  main: {
    backgroundColor: '#FFFFFF',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 5px 15px rgba(73, 30, 46, 0.1)',
    minHeight: '500px',
  },
  cargando: {
    textAlign: 'center',
    padding: '60px',
    color: '#722F37',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  sinReservas: {
    textAlign: 'center',
    padding: '60px',
    color: '#722F37',
  },
  botonReservar: {
    backgroundColor: '#491E2E',
    color: '#FFFFFF',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '20px',
    transition: 'all 0.3s ease',
  },
  contadorReservas: {
    backgroundColor: '#F5F0E6',
    padding: '15px 20px',
    borderRadius: '10px',
    marginBottom: '25px',
    color: '#491E2E',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    fontSize: '1.1rem',
  },
  listaReservas: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
  },
  tarjetaReserva: {
    border: '1px solid #722F37',
    borderRadius: '12px',
    padding: '25px',
    backgroundColor: '#FFFFFF',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(114, 47, 55, 0.1)',
  },
  headerReserva: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #F5F0E6',
  },
  nombreHabitacion: {
    color: '#491E2E',
    margin: '0 0 5px 0',
    fontSize: '1.3rem',
  },
  numeroHabitacion: {
    color: '#722F37',
    fontSize: '0.9rem',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  },
  detallesReserva: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '25px',
    marginBottom: '20px',
  },
  columnaDetalles: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  detalleItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#F5F0E6',
    borderRadius: '8px',
  },
  iconoDetalle: {
    color: '#491E2E',
    marginTop: '2px',
    flexShrink: 0,
  },
  accionesReserva: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTop: '1px solid #F5F0E6',
    paddingTop: '20px',
  },
  botonPDF: {
    backgroundColor: '#491E2E',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
  },
  botonCancelar: {
    backgroundColor: '#722F37',
    color: '#FFFFFF',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
  },
  reembolsoInfo: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: '0.9rem',
  },
  seccionContenido: {
    maxWidth: '900px',
  },
  tituloSeccion: {
    color: '#491E2E',
    marginBottom: '20px',
  },
  descripcionTemporada: {
    color: '#722F37',
    fontSize: '1.1rem',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  infoTemporada: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '25px',
    marginBottom: '30px',
  },
  tarjetaTemporada: {
    backgroundColor: '#F5F0E6',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #722F37',
    transition: 'transform 0.3s ease',
  },
  tituloTemporada: {
    color: '#491E2E',
    display: 'flex',
    alignItems: 'center',
    margin: '0 0 15px 0',
  },
  iconoTemporada: {
    marginRight: '10px',
    color: '#722F37',
  },
  detallesTemporada: {
    color: '#491E2E',
    lineHeight: '1.5',
  },
  detallesTemporada: {
    margin: '8px 0',
    color: '#491E2E',
    lineHeight: '1.5',
  },
  notaTemporada: {
    backgroundColor: '#F5F0E6',
    padding: '20px',
    borderRadius: '8px',
    borderLeft: '4px solid #491E2E',
    color: '#491E2E',
    display: 'flex',
    alignItems: 'center',
  },
};

export default DashboardUsuario;