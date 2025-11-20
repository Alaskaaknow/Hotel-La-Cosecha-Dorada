import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaGlobe, FaCreditCard } from "react-icons/fa";

function ModalReserva({
  isOpen,
  onClose,
  habitacion,
  datosBusqueda,
  onReservaConfirmada
}) {
  const [paso, setPaso] = useState(1);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    nacionalidad: "",
    tarjeta: "",
    vencimiento: "",
    cvv: ""
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const verificarEmailExistente = async (email) => {
    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/verificar-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("⚠️ El servidor no devolvió JSON en verificar-email");
        return { existe: false };
      }

      return await response.json();
    } catch (error) {
      console.error("❌ Error verificando email:", error);
      return { existe: false };
    }
  };

  const handleSubmitDatos = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Verificar campos requeridos
    if (!formData.nombre || !formData.apellido || !formData.email || !formData.telefono) {
      alert("Por favor completa todos los campos requeridos");
      setLoading(false);
      return;
    }

    try {
      const resultado = await verificarEmailExistente(formData.email);

      if (resultado.existe) {
        if (!window.confirm("Este email ya está registrado. ¿Desea continuar con la reserva?")) {
          setLoading(false);
          return;
        }
      }

      setPaso(2);
    } catch (error) {
      console.error("Error en verificación de email:", error);
      // Continuar de todos modos al paso 2
      setPaso(2);
    } finally {
      setLoading(false);
    }
  };

  const procesarPago = async () => {
    console.log("🔄 Iniciando procesamiento de pago...");
    setLoading(true);

    try {
      // Validar datos de tarjeta primero
      if (!formData.tarjeta || !formData.vencimiento || !formData.cvv) {
        alert("Por favor completa todos los datos de pago");
        setLoading(false);
        return;
      }

      // 1. Procesar pago
      console.log("💳 Enviando pago al servidor...");
      const pagoResponse = await fetch('http://localhost:5000/api/pagos/procesar', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tarjeta: formData.tarjeta.replace(/\s/g, ''), // Limpiar espacios
          vencimiento: formData.vencimiento,
          cvv: formData.cvv,
          monto: calcularTotal(),
          email: formData.email
        })
      });

      // Verificar si la respuesta es JSON
      const contentType = pagoResponse.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await pagoResponse.text();
        console.error("❌ El servidor no devolvió JSON:", textResponse.substring(0, 200));
        throw new Error(`Error del servidor: ${pagoResponse.status} ${pagoResponse.statusText}`);
      }

      const resultadoPago = await pagoResponse.json();
      console.log("✅ Resultado pago:", resultadoPago);

      if (!resultadoPago.success) {
        throw new Error(resultadoPago.error || "Error en el procesamiento del pago");
      }

      // 2. Crear reserva
      console.log("📋 Creando reserva...");
      const reservaResponse = await fetch('http://localhost:5000/api/reservas/crear', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitacion_id: habitacion.id,
          datos_personales: {
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.email,
            telefono: formData.telefono,
            nacionalidad: formData.nacionalidad
          },
          datos_busqueda: datosBusqueda,
          pago_id: resultadoPago.pagoId,
          total: calcularTotal()
        })
      });

      // Verificar si la respuesta de reserva es JSON
      const reservaContentType = reservaResponse.headers.get("content-type");
      if (!reservaContentType || !reservaContentType.includes("application/json")) {
        const textResponse = await reservaResponse.text();
        console.error("❌ El servidor no devolvió JSON en crear reserva:", textResponse.substring(0, 200));
        throw new Error(`Error del servidor al crear reserva: ${reservaResponse.status}`);
      }

      const resultadoReserva = await reservaResponse.json();
      console.log("✅ Resultado reserva:", resultadoReserva);

      if (resultadoReserva.success) {
        setPaso(3);
        if (onReservaConfirmada) {
          onReservaConfirmada(resultadoReserva.reserva);
        }
      } else {
        alert("Error al crear reserva: " + resultadoReserva.error);
      }

    } catch (error) {
      console.error("❌ Error completo:", error);
      alert("Error al procesar el pago: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calcularTotal = () => {
    const entrada = new Date(datosBusqueda.entrada);
    const salida = new Date(datosBusqueda.salida);
    const noches = Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24));
    return (habitacion.precio * noches).toFixed(2);
  };

  const calcularNoches = () => {
    const entrada = new Date(datosBusqueda.entrada);
    const salida = new Date(datosBusqueda.salida);
    return Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24));
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h2>Completar Reserva</h2>
          <button onClick={onClose} style={styles.botonCerrar}>×</button>
        </div>

        {/* Progreso */}
        <div style={styles.progreso}>
          <div style={{ ...styles.paso, ...(paso >= 1 ? styles.pasoActivo : {}) }}>
            1. Datos
          </div>
          <div style={{ ...styles.paso, ...(paso >= 2 ? styles.pasoActivo : {}) }}>
            2. Pago
          </div>
          <div style={{ ...styles.paso, ...(paso >= 3 ? styles.pasoActivo : {}) }}>
            3. Confirmación
          </div>
        </div>

        {/* Paso 1: Datos Personales */}
        {paso === 1 && (
          <form onSubmit={handleSubmitDatos} style={styles.form}>
            <h3 style={styles.subtitulo}>Información Personal</h3>

            <div style={styles.grid}>
              <div style={styles.inputGroup}>
                <label><FaUser /> Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="Tu nombre"
                />
              </div>

              <div style={styles.inputGroup}>
                <label>Apellido *</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label><FaEnvelope /> Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={styles.input}
                placeholder="tu@email.com"
              />
            </div>

            <div style={styles.grid}>
              <div style={styles.inputGroup}>
                <label><FaPhone /> Teléfono *</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  placeholder="123456789"
                />
              </div>

              <div style={styles.inputGroup}>
                <label><FaGlobe /> Nacionalidad</label>
                <input
                  type="text"
                  name="nacionalidad"
                  value={formData.nacionalidad}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Ej: Argentina"
                />
              </div>
            </div>

            {/* Resumen */}
            <div style={styles.resumen}>
              <h4>Resumen de Reserva</h4>
              <p><strong>Habitación:</strong> {habitacion.nombre}</p>
              <p><strong>Check-in:</strong> {new Date(datosBusqueda.entrada).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> {new Date(datosBusqueda.salida).toLocaleDateString()}</p>
              <p><strong>Noches:</strong> {calcularNoches()}</p>
              <p><strong>Huéspedes:</strong> {datosBusqueda.adultos} adultos, {datosBusqueda.ninos || 0} niños</p>
              <p><strong>Precio por noche:</strong> ${habitacion.precio}</p>
              <p><strong>Total:</strong> ${calcularTotal()}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={styles.botonContinuar}
            >
              {loading ? "Verificando..." : "Continuar al Pago"}
            </button>
          </form>
        )}

        {/* Paso 2: Pago */}
        {paso === 2 && (
          <div style={styles.form}>
            <h3 style={styles.subtitulo}>Información de Pago</h3>

            <div style={styles.inputGroup}>
              <label><FaCreditCard /> Tarjeta *</label>
              <input
                type="text"
                name="tarjeta"
                placeholder="1234 5678 9012 3456"
                value={formData.tarjeta}
                onChange={handleInputChange}
                required
                style={styles.input}
                maxLength="19"
              />
            </div>

            <div style={styles.grid}>
              <div style={styles.inputGroup}>
                <label>Vencimiento *</label>
                <input
                  type="text"
                  name="vencimiento"
                  placeholder="MM/AA"
                  value={formData.vencimiento}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  maxLength="5"
                />
              </div>

              <div style={styles.inputGroup}>
                <label>CVV *</label>
                <input
                  type="text"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                  maxLength="4"
                />
              </div>
            </div>

            <div style={styles.resumen}>
              <h4>Resumen de Pago</h4>
              <p><strong>Habitación:</strong> {habitacion.nombre}</p>
              <p><strong>Noches:</strong> {calcularNoches()}</p>
              <p><strong>Total a pagar:</strong> ${calcularTotal()}</p>
            </div>

            <div style={styles.botones}>
              <button
                onClick={() => setPaso(1)}
                style={styles.botonVolver}
                disabled={loading}
              >
                Volver
              </button>
              <button
                onClick={procesarPago}
                disabled={loading}
                style={styles.botonPagar}
              >
                {loading ? "Procesando..." : `Pagar $${calcularTotal()}`}
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Confirmación */}
        {paso === 3 && (
          <div style={styles.confirmacion}>
            <div style={styles.exito}>✅</div>
            <h3 style={styles.subtitulo}>¡Reserva Confirmada!</h3>
            <p>Tu reserva ha sido procesada exitosamente.</p>
            <p>Se ha enviado un email de confirmación a <strong>{formData.email}</strong></p>

            <div style={styles.resumen}>
              <h4>Detalles de tu Reserva</h4>
              <p><strong>Habitación:</strong> {habitacion.nombre}</p>
              <p><strong>Check-in:</strong> {new Date(datosBusqueda.entrada).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> {new Date(datosBusqueda.salida).toLocaleDateString()}</p>
              <p><strong>Total pagado:</strong> ${calcularTotal()}</p>
            </div>

            <div style={styles.botones}>
              <button onClick={onClose} style={styles.botonPrincipal}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '15px',
  },
  botonCerrar: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
  },
  progreso: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '30px',
  },
  paso: {
    flex: 1,
    textAlign: 'center',
    padding: '10px',
    color: '#ccc',
    fontWeight: 'bold',
    borderBottom: '3px solid #ccc',
  },
  pasoActivo: {
    color: '#5c2a3d',
    borderBottom: '3px solid #5c2a3d',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  subtitulo: {
    color: '#5c2a3d',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '12px',
    border: '2px solid #e8d0d9',
    borderRadius: '8px',
    fontSize: '14px',
  },
  resumen: {
    background: '#f8f4e9',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e8d0d9',
    marginTop: '10px',
  },
  botonContinuar: {
    background: '#5c2a3d',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  botones: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  botonVolver: {
    background: 'transparent',
    color: '#5c2a3d',
    border: '2px solid #5c2a3d',
    padding: '12px 25px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  botonPagar: {
    background: '#5c2a3d',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  confirmacion: {
    textAlign: 'center',
    padding: '20px',
  },
  exito: {
    fontSize: '4rem',
    marginBottom: '20px',
  },
  botonPrincipal: {
    background: '#5c2a3d',
    color: 'white',
    border: 'none',
    padding: '12px 25px',
    borderRadius: '8px',
    cursor: 'pointer',
    margin: '5px',
  },
};

export default ModalReserva;