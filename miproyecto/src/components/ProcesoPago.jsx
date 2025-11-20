import React, { useState } from "react";
import { FaCreditCard, FaLock, FaCheck, FaShield } from "react-icons/fa";

function ProcesoPago({ monto, onPagoExitoso, onCancelar }) {
  const [datosPago, setDatosPago] = useState({
    numeroTarjeta: "",
    nombreTitular: "",
    fechaVencimiento: "",
    cvv: "",
  });
  const [paso, setPaso] = useState(1); // 1: Formulario, 2: Procesando, 3: Éxito
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Formatear número de tarjeta
    if (name === "numeroTarjeta") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .substring(0, 19);
      setDatosPago(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    // Formatear fecha de vencimiento
    if (name === "fechaVencimiento") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .substring(0, 5);
      setDatosPago(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    // Limitar CVV a 3 dígitos
    if (name === "cvv") {
      const formattedValue = value.replace(/\D/g, "").substring(0, 3);
      setDatosPago(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    setDatosPago(prev => ({ ...prev, [name]: value }));
  };

  const validarDatos = () => {
    const numeroTarjetaLimpio = datosPago.numeroTarjeta.replace(/\s/g, "");
    
    if (numeroTarjetaLimpio.length !== 16) {
      setError("El número de tarjeta debe tener 16 dígitos");
      return false;
    }
    
    if (!datosPago.nombreTitular.trim()) {
      setError("Ingresa el nombre del titular");
      return false;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(datosPago.fechaVencimiento)) {
      setError("Formato de fecha inválido (MM/AA)");
      return false;
    }
    
    // Validar que la fecha no esté vencida
    const [mes, ano] = datosPago.fechaVencimiento.split('/');
    const fechaVencimiento = new Date(2000 + parseInt(ano), parseInt(mes) - 1);
    const hoy = new Date();
    
    if (fechaVencimiento < hoy) {
      setError("La tarjeta está vencida");
      return false;
    }
    
    if (datosPago.cvv.length !== 3) {
      setError("El CVV debe tener 3 dígitos");
      return false;
    }
    
    setError("");
    return true;
  };

  const procesarPago = async () => {
    if (!validarDatos()) return;
    
    setPaso(2);
    setError("");

    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // En una aplicación real, aquí llamarías a tu API de pago
      const pagoId = 'PAY_' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      setPaso(3);
      
      // Esperar un momento y luego llamar al callback de éxito
      setTimeout(() => {
        onPagoExitoso({
          pagoId,
          monto,
          fecha: new Date().toISOString(),
          referencia: pagoId,
          ultimosDigitos: datosPago.numeroTarjeta.slice(-4)
        });
      }, 1500);
      
    } catch (err) {
      setError("Error al procesar el pago. Intenta nuevamente.");
      setPaso(1);
    }
  };

  // Paso 2: Procesando
  if (paso === 2) {
    return (
      <div style={styles.container}>
        <div style={styles.procesando}>
          <div style={styles.spinner}></div>
          <h3 style={styles.procesandoTitulo}>Procesando Pago</h3>
          <p style={styles.procesandoTexto}>
            Estamos procesando tu pago de <strong>${monto}</strong>
          </p>
          <p style={styles.procesandoInfo}>
            Por favor no cierres esta ventana...
          </p>
          <div style={styles.seguridadInfo}>
            <FaShield style={{ marginRight: "8px", color: "#4CAF50" }} />
            <span>Transacción segura en proceso</span>
          </div>
        </div>
      </div>
    );
  }

  // Paso 3: Éxito
  if (paso === 3) {
    return (
      <div style={styles.container}>
        <div style={styles.exito}>
          <div style={styles.iconoExitoContenedor}>
            <FaCheck style={styles.iconoExito} />
          </div>
          <h3 style={styles.exitoTitulo}>¡Pago Exitoso!</h3>
          <p style={styles.exitoTexto}>
            Tu pago de <strong>${monto}</strong> ha sido procesado correctamente.
          </p>
          <p style={styles.exitoDetalles}>
            Referencia: {datosPago.numeroTarjeta.replace(/\d{12}/, '************')}
          </p>
          <div style={styles.exitoSeguridad}>
            <FaLock style={{ marginRight: "8px", color: "#4CAF50" }} />
            <span>Transacción completada de forma segura</span>
          </div>
        </div>
      </div>
    );
  }

  // Paso 1: Formulario
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <FaCreditCard style={styles.iconoHeader} />
        <h3 style={styles.titulo}>Información de Pago</h3>
        <p style={styles.subtitulo}>Total a pagar: <strong>${monto}</strong></p>
      </div>

      <form style={styles.formulario} onSubmit={(e) => e.preventDefault()}>
        <div style={styles.grupoInput}>
          <label style={styles.label}>Número de Tarjeta</label>
          <input
            type="text"
            name="numeroTarjeta"
            value={datosPago.numeroTarjeta}
            onChange={handleInputChange}
            placeholder="1234 5678 9012 3456"
            maxLength="19"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.grupoInput}>
          <label style={styles.label}>Nombre del Titular</label>
          <input
            type="text"
            name="nombreTitular"
            value={datosPago.nombreTitular}
            onChange={handleInputChange}
            placeholder="JUAN PEREZ"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.grid}>
          <div style={styles.grupoInput}>
            <label style={styles.label}>Fecha Vencimiento</label>
            <input
              type="text"
              name="fechaVencimiento"
              value={datosPago.fechaVencimiento}
              onChange={handleInputChange}
              placeholder="MM/AA"
              maxLength="5"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.grupoInput}>
            <label style={styles.label}>CVV</label>
            <div style={styles.cvvContainer}>
              <input
                type="text"
                name="cvv"
                value={datosPago.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength="3"
                style={styles.input}
                required
              />
              <div style={styles.cvvInfo}>
                <span>3 dígitos</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <div style={styles.seguridad}>
          <FaLock style={{ marginRight: "8px", color: "#4CAF50" }} />
          <span style={styles.textoSeguridad}>
            Tus datos están protegidos con encriptación SSL de 256-bit
          </span>
        </div>

        <div style={styles.acceptance}>
          <div style={styles.banderas}>
            <span style={styles.bandera}>VISA</span>
            <span style={styles.bandera}>MC</span>
            <span style={styles.bandera}>AMEX</span>
          </div>
        </div>

        <div style={styles.botones}>
          <button
            type="button"
            onClick={onCancelar}
            style={styles.botonCancelar}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={procesarPago}
            style={styles.botonPagar}
          >
            Pagar ${monto}
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    maxWidth: '500px',
    margin: '0 auto',
    border: '1px solid #e8d0d9',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '20px',
  },
  iconoHeader: {
    fontSize: '2.5rem',
    color: '#5c2a3d',
    marginBottom: '15px',
  },
  titulo: {
    color: '#5c2a3d',
    fontSize: '1.5rem',
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  subtitulo: {
    color: '#666',
    fontSize: '1.1rem',
  },
  formulario: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  grupoInput: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    color: '#5c2a3d',
    fontWeight: 'bold',
    marginBottom: '8px',
    fontSize: '0.9rem',
  },
  input: {
    padding: '12px 15px',
    border: '2px solid #e8d0d9',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  },
  inputFocus: {
    borderColor: '#5c2a3d',
    boxShadow: '0 0 0 3px rgba(92, 42, 61, 0.1)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  cvvContainer: {
    position: 'relative',
  },
  cvvInfo: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999',
    fontSize: '0.8rem',
  },
  error: {
    background: '#ffebee',
    color: '#d32f2f',
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #ffcdd2',
    fontSize: '0.9rem',
  },
  seguridad: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f4e9',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #e8d0d9',
  },
  textoSeguridad: {
    color: '#666',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  acceptance: {
    textAlign: 'center',
    padding: '15px 0',
  },
  banderas: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  bandera: {
    background: '#f0f0f0',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    color: '#666',
  },
  botones: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
  },
  botonCancelar: {
    flex: 1,
    background: 'transparent',
    color: '#5c2a3d',
    border: '2px solid #5c2a3d',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  botonPagar: {
    flex: 2,
    background: '#5c2a3d',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  // Estilos para el estado de procesamiento
  procesando: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  spinner: {
    width: '60px',
    height: '60px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #5c2a3d',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px',
  },
  procesandoTitulo: {
    color: '#5c2a3d',
    fontSize: '1.5rem',
    marginBottom: '10px',
  },
  procesandoTexto: {
    color: '#666',
    marginBottom: '5px',
  },
  procesandoInfo: {
    color: '#999',
    fontSize: '0.9rem',
    marginBottom: '20px',
  },
  seguridadInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4CAF50',
    fontSize: '0.9rem',
  },
  // Estilos para el estado de éxito
  exito: {
    textAlign: 'center',
    padding: '30px 20px',
  },
  iconoExitoContenedor: {
    width: '80px',
    height: '80px',
    background: '#4CAF50',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  iconoExito: {
    fontSize: '2.5rem',
    color: 'white',
  },
  exitoTitulo: {
    color: '#4CAF50',
    fontSize: '1.8rem',
    marginBottom: '15px',
  },
  exitoTexto: {
    color: '#666',
    fontSize: '1.1rem',
    marginBottom: '10px',
  },
  exitoDetalles: {
    color: '#999',
    fontSize: '0.9rem',
    marginBottom: '20px',
  },
  exitoSeguridad: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4CAF50',
    fontSize: '0.9rem',
  },
};

// Animación para el spinner
const spin = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Agregar los estilos de animación al documento
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = spin;
  document.head.appendChild(styleSheet);
}

// Efectos hover
styles.botonCancelar[':hover'] = {
  background: '#5c2a3d',
  color: 'white',
};

styles.botonPagar[':hover'] = {
  background: '#472031',
  transform: 'translateY(-2px)',
  boxShadow: '0 4px 12px rgba(92, 42, 61, 0.3)',
};

styles.input[':focus'] = {
  borderColor: '#5c2a3d',
  boxShadow: '0 0 0 3px rgba(92, 42, 61, 0.1)',
  outline: 'none',
};

export default ProcesoPago;