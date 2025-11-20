import React, { useState } from "react";
import Modal from "react-modal";
import "./LoginModal.css";

Modal.setAppElement("#root");

function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modo, setModo] = useState("login"); // "login" o "registro"
  
  // Estado para el formulario de registro
  const [registroData, setRegistroData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const API_BASE_URL = "http://localhost:5000/api";

  // Función para validar email
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

// ===============================
// 🔐 FUNCIÓN DE LOGIN - ACTUALIZADA
// ===============================
const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setLoginError("");
  setIsLoading(true);

  try {
    console.log("🔐 Intentando login...");
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || "Error al iniciar sesión");
    }

    // ✅ Login exitoso
    setIsLoading(false);
    
    // Guardar en localStorage
    localStorage.setItem("user", JSON.stringify(data.user));
    
    // Avisar al componente padre
    if (onLoginSuccess) onLoginSuccess(data.user);
    
    // Cerrar modal
    onClose();
    
    console.log("✅ Login exitoso, redirigiendo...");
    
    // Limpiar formulario
    setUsername("");
    setPassword("");
    
    // NUEVO: Redirigir según rol - ACTUALIZADO
    if (data.user.role === "administrador") {
      window.location.href = "/admin/dashboard";
    } else if (data.user.role === "recepcionista") {
      window.location.href = "/operator/dashboard";
    } else if (data.user.role === "cliente") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/";
    }

  } catch (err) {
    setIsLoading(false);
    setLoginError(err.message || "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.");
    console.error("Error en login:", err);
  }
};

  // ===============================
  // 📝 FUNCIÓN DE REGISTRO
  // ===============================
  const handleRegistroSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);

    try {
      // Validaciones
      if (registroData.password !== registroData.confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      if (registroData.password.length < 4) {
        throw new Error("La contraseña debe tener al menos 4 caracteres");
      }

      if (!validarEmail(registroData.email)) {
        throw new Error("Por favor ingresa un email válido");
      }

      console.log("📝 Intentando registro...");
      
      const response = await fetch(`http://localhost:5000/api/usuarios/registrar`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: registroData.username,
          password: registroData.password,
          nombre: registroData.nombre,
          apellido: registroData.apellido,
          email: registroData.email,
          telefono: registroData.telefono,
          fecha_nacimiento: registroData.fecha_nacimiento
        }),
      });

      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error al crear la cuenta");
      }

      // ✅ Registro exitoso
      setIsLoading(false);
      
      // Cambiar a modo login
      setModo("login");
      setLoginError("");
      
      // Limpiar formulario de registro
      setRegistroData({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        fecha_nacimiento: "",
        username: "",
        password: "",
        confirmPassword: ""
      });

      console.log("✅ Registro exitoso");
      alert("¡Cuenta creada exitosamente! Ya puedes iniciar sesión.");

    } catch (err) {
      setIsLoading(false);
      setLoginError(err.message || "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.");
      console.error("Error en registro:", err);
    }
  };

  // ===============================
  // 🎨 RENDERIZADO DEL FORMULARIO DE LOGIN
  // ===============================
  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit}>
      <label>Usuario:</label>
      <input
        type="text"
        placeholder="Tu nombre de usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        disabled={isLoading}
      />

      <label>Contraseña:</label>
      <input
        type="password"
        placeholder="Tu contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
      />

      {loginError && (
        <div className="error-message">
          {loginError}
        </div>
      )}

      <button 
        type="submit" 
        className="btn-acceder" 
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? "#ccc" : "#5c2a3d",
          cursor: isLoading ? "not-allowed" : "pointer"
        }}
      >
        {isLoading ? "Ingresando..." : "INICIAR SESIÓN"}
      </button>

      <div className="login-links">
        <button
          type="button"
          className="link-button"
          onClick={() => {
            setModo("registro");
            setLoginError("");
          }}
          disabled={isLoading}
        >
          ¿No tienes cuenta? Regístrate aquí
        </button>
      </div>
    </form>
  );

  // ===============================
  // 🎨 RENDERIZADO DEL FORMULARIO DE REGISTRO
  // ===============================
  const renderRegistroForm = () => (
    <form onSubmit={handleRegistroSubmit}>
      {/* Nombre y Apellido */}
      <div style={styles.grid}>
        <div style={styles.inputGroup}>
          <label>Nombre *</label>
          <input
            type="text"
            value={registroData.nombre}
            onChange={(e) => setRegistroData({...registroData, nombre: e.target.value})}
            required
            placeholder="Tu nombre"
            disabled={isLoading}
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label>Apellido *</label>
          <input
            type="text"
            value={registroData.apellido}
            onChange={(e) => setRegistroData({...registroData, apellido: e.target.value})}
            required
            placeholder="Tu apellido"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Email y Teléfono */}
      <div style={styles.grid}>
        <div style={styles.inputGroup}>
          <label>Email *</label>
          <input
            type="email"
            value={registroData.email}
            onChange={(e) => setRegistroData({...registroData, email: e.target.value})}
            required
            placeholder="tu@email.com"
            disabled={isLoading}
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label>Teléfono</label>
          <input
            type="tel"
            value={registroData.telefono}
            onChange={(e) => setRegistroData({...registroData, telefono: e.target.value})}
            placeholder="123456789"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Fecha de Nacimiento - CORREGIDA */}
      <div style={styles.inputGroup}>
        <label>Fecha de Nacimiento</label>
        <input
          type="date"
          value={registroData.fecha_nacimiento}
          onChange={(e) => setRegistroData({...registroData, fecha_nacimiento: e.target.value})}
          disabled={isLoading}
          min="1900-01-01"
          max="2024-12-31"
        />
      </div>

      {/* Usuario */}
      <div style={styles.inputGroup}>
        <label>Usuario *</label>
        <input
          type="text"
          value={registroData.username}
          onChange={(e) => setRegistroData({...registroData, username: e.target.value})}
          required
          placeholder="Nombre de usuario"
          disabled={isLoading}
        />
      </div>

      {/* Contraseñas */}
      <div style={styles.grid}>
        <div style={styles.inputGroup}>
          <label>Contraseña *</label>
          <input
            type="password"
            value={registroData.password}
            onChange={(e) => setRegistroData({...registroData, password: e.target.value})}
            required
            placeholder="Mínimo 4 caracteres"
            disabled={isLoading}
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label>Confirmar Contraseña *</label>
          <input
            type="password"
            value={registroData.confirmPassword}
            onChange={(e) => setRegistroData({...registroData, confirmPassword: e.target.value})}
            required
            placeholder="Repite tu contraseña"
            disabled={isLoading}
          />
        </div>
      </div>

      {loginError && (
        <div className="error-message">
          {loginError}
        </div>
      )}

      <button 
        type="submit" 
        className="btn-acceder" 
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? "#ccc" : "#5c2a3d",
          cursor: isLoading ? "not-allowed" : "pointer"
        }}
      >
        {isLoading ? "Creando cuenta..." : "CREAR CUENTA"}
      </button>

      <div className="login-links">
        <button
          type="button"
          className="link-button"
          onClick={() => {
            setModo("login");
            setLoginError("");
          }}
          disabled={isLoading}
        >
          ¿Ya tienes cuenta? Inicia sesión aquí
        </button>
      </div>
    </form>
  );

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Formulario de Login"
      className="login-modal"
      overlayClassName="login-overlay"
    >
      <h2 className="login-title">
        {modo === "login" ? "INICIAR SESIÓN" : "CREAR CUENTA NUEVA"}
      </h2>

      {/* Selector de Modo */}
      <div style={styles.selectorModo}>
        <button
          style={{
            ...styles.botonModo,
            ...(modo === "login" ? styles.botonModoActivo : {})
          }}
          onClick={() => {
            setModo("login");
            setLoginError("");
          }}
          disabled={isLoading}
        >
          Iniciar Sesión
        </button>
        <button
          style={{
            ...styles.botonModo,
            ...(modo === "registro" ? styles.botonModoActivo : {})
          }}
          onClick={() => {
            setModo("registro");
            setLoginError("");
          }}
          disabled={isLoading}
        >
          Crear Cuenta
        </button>
      </div>

      {/* Formulario según el modo */}
      {modo === "login" ? renderLoginForm() : renderRegistroForm()}
      
      <button
        type="button"
        className="btn-cerrar"
        onClick={onClose}
        disabled={isLoading}
      >
        Cerrar
      </button>
    </Modal>
  );
}

// Estilos inline para los nuevos elementos
const styles = {
  selectorModo: {
    display: 'flex',
    marginBottom: '20px',
    background: '#f8f4e9',
    borderRadius: '10px',
    padding: '5px',
  },
  botonModo: {
    flex: 1,
    background: 'none',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    fontSize: '14px',
  },
  botonModoActivo: {
    background: '#5c2a3d',
    color: 'white',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '15px',
  },
};

export default LoginModal;