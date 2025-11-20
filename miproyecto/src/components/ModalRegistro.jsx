import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaLock, FaTimes } from "react-icons/fa";

function ModalRegistro({ isOpen, onClose, onRegistroExitoso }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    fecha_nacimiento: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // Función para validar email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (formData.password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      setLoading(false);
      return;
    }

    if (!validarEmail(formData.email)) {
      setError("Por favor ingresa un email válido");
      setLoading(false);
      return;
    }

    try {
      console.log("📝 Intentando registrar usuario...");
      
      const response = await fetch('http://localhost:5000/api/usuarios/registrar', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          telefono: formData.telefono,
          fecha_nacimiento: formData.fecha_nacimiento
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log("✅ Usuario registrado exitosamente");
        onRegistroExitoso();
        onClose();
        
        // Limpiar formulario
        setFormData({
          username: "",
          password: "",
          confirmPassword: "",
          nombre: "",
          apellido: "",
          email: "",
          telefono: "",
          fecha_nacimiento: ""
        });
        
        alert("¡Cuenta creada exitosamente! Ya puedes iniciar sesión.");
      } else {
        setError(result.error || "Error al registrar usuario");
      }
    } catch (error) {
      console.error("❌ Error en registro:", error);
      setError("No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.titulo}>Crear Cuenta Nueva</h2>
          <button onClick={onClose} style={styles.botonCerrar}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}

          {/* Nombre y Apellido */}
          <div style={styles.grid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <FaUser style={styles.icono} /> 
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                style={styles.input}
                placeholder="Tu nombre"
                disabled={loading}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Apellido *</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
                style={styles.input}
                placeholder="Tu apellido"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <FaEnvelope style={styles.icono} /> 
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={styles.input}
              placeholder="tu@email.com"
              disabled={loading}
            />
          </div>

          {/* Teléfono */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <FaPhone style={styles.icono} /> 
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="123456789"
              disabled={loading}
            />
          </div>

          {/* Fecha de Nacimiento - CORREGIDA */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <FaCalendar style={styles.icono} /> 
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleInputChange}
              style={styles.input}
              min="1900-01-01"
              max="2024-12-31"
              disabled={loading}
            />
          </div>

          {/* Usuario */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <FaUser style={styles.icono} /> 
              Usuario *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              style={styles.input}
              placeholder="Nombre de usuario"
              disabled={loading}
            />
          </div>

          {/* Contraseñas */}
          <div style={styles.grid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <FaLock style={styles.icono} /> 
                Contraseña *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={styles.input}
                placeholder="Mínimo 4 caracteres"
                disabled={loading}
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirmar Contraseña *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                style={styles.input}
                placeholder="Repite tu contraseña"
                disabled={loading}
              />
            </div>
          </div>

          {/* Botón de Registro */}
          <button 
            type="submit" 
            disabled={loading} 
            style={{
              ...styles.botonRegistrar,
              backgroundColor: loading ? '#ccc' : '#5c2a3d',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? "Creando cuenta..." : "CREAR CUENTA"}
          </button>
        </form>
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
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '15px',
  },
  titulo: {
    color: '#5c2a3d',
    margin: 0,
    fontSize: '24px',
  },
  botonCerrar: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#666',
    padding: '5px',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
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
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#333',
  },
  icono: {
    color: '#5c2a3d',
  },
  input: {
    padding: '12px 15px',
    border: '2px solid #e8d0d9',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.3s ease',
  },
  error: {
    background: '#ffebee',
    color: '#d32f2f',
    padding: '12px 15px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #f5c6cb',
  },
  botonRegistrar: {
    background: '#5c2a3d',
    color: 'white',
    border: 'none',
    padding: '15px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
  },
};

export default ModalRegistro;