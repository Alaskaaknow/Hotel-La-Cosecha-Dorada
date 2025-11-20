// components/BotonAyudaFlotante.jsx
import React, { useState } from 'react';
import { FaComment, FaTimes, FaQuestionCircle, FaCheckCircle } from 'react-icons/fa';
import './BotonAyudaFlotante.css';

const BotonAyudaFlotante = () => {
  const [abierto, setAbierto] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [envioExitoso, setEnvioExitoso] = useState(false);

  const preguntasFrecuentes = [
    {
      pregunta: "¿Cuál es su política de cancelación?",
      respuesta: "Cancelación gratuita hasta 48 horas antes del check-in. Cancelaciones tardías o no-shows: cargo de la primera noche. Condiciones especiales para reservas no reembolsables."
    },
    {
      pregunta: "¿Qué métodos de pago aceptan??",
      respuesta: "Tarjetas de crédito/débito (Visa, MasterCard, American Express), transferencias bancarias y efectivo al check-in."
    },
    {
      pregunta: "¿Necesito una tarjeta de crédito para garantizar la reserva?",
      respuesta: "Tarjeta de crédito válida requerida para garantizar la reserva. No se carga automáticamente (excepto tarifas no reembolsables)."
    },
    {
      pregunta: "¿Puedo modificar las fechas de mi reserva?",
      respuesta: "Modificaciones disponibles contactándonos directamente. Sujeto a disponibilidad y tarifas vigentes para las nuevas fechas."
    }
  ];

  const manejarEnvioExitoso = () => {
    setEnvioExitoso(true);
    setTimeout(() => {
      setEnvioExitoso(false);
      setMostrarFormulario(false);
      setAbierto(false);
    }, 3000);
  };

  return (
    <>
      <button 
        className={`boton-ayuda-flotante ${abierto ? 'abierto' : ''}`}
        onClick={() => setAbierto(!abierto)}
      >
        {abierto ? <FaTimes /> : <FaComment />}
      </button>

      {abierto && (
        <div className="panel-ayuda">
          <div className="panel-header">
            <h3>¿En qué podemos ayudarte?</h3>
            <button 
              className="btn-cerrar-panel"
              onClick={() => setAbierto(false)}
            >
              <FaTimes />
            </button>
          </div>

          {!mostrarFormulario ? (
            <div className="preguntas-frecuentes">
              <div className="faq-list">
                {preguntasFrecuentes.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <div className="faq-pregunta">
                      <FaQuestionCircle className="faq-icon" />
                      <span>{faq.pregunta}</span>
                    </div>
                    <div className="faq-respuesta">
                      {faq.respuesta}
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="btn-consulta-personalizada"
                onClick={() => setMostrarFormulario(true)}
              >
                ¿No encontraste tu respuesta? Consulta personalizada
              </button>
            </div>
          ) : (
            <FormularioConsulta 
              onCancelar={() => setMostrarFormulario(false)}
              onEnviar={manejarEnvioExitoso}
              envioExitoso={envioExitoso}
            />
          )}
        </div>
      )}
    </>
  );
};

const FormularioConsulta = ({ onCancelar, onEnviar, envioExitoso }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tipo: 'consulta_cliente',
          fecha: new Date().toISOString(),
          estado: 'pendiente'
        })
      });

      if (response.ok) {
        onEnviar();
        setFormData({
          nombre: user?.nombre || '',
          email: user?.email || '',
          telefono: '',
          asunto: '',
          mensaje: ''
        });
      } else {
        alert('Error al enviar la consulta. Intenta nuevamente.');
      }
    } catch (error) {
      alert('Error de conexión. Intenta nuevamente.');
    }
  };

  if (envioExitoso) {
    return (
      <div className="formulario-consulta">
        <div className="aviso-exito">
          <FaCheckCircle style={{ fontSize: '2rem', marginBottom: '10px' }} />
          <h4>¡Consulta enviada con éxito!</h4>
          <p>Te contactaremos pronto. Gracias por tu paciencia.</p>
        </div>
      </div>
    );
  }

  return (
    <form className="formulario-consulta" onSubmit={handleSubmit}>
      <h4>Consulta Personalizada</h4>
      
      <div className="form-group">
        <label>Nombre completo *</label>
        <input 
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          required
          placeholder="Ingresa tu nombre completo"
        />
      </div>

      <div className="form-group">
        <label>Email *</label>
        <input 
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          placeholder="tu@email.com"
        />
      </div>

      <div className="form-group">
        <label>Teléfono</label>
        <input 
          value={formData.telefono}
          onChange={(e) => setFormData({...formData, telefono: e.target.value})}
          placeholder="Opcional - Ej: +1234567890"
        />
      </div>

      <div className="form-group">
        <label>Asunto *</label>
        <input 
          value={formData.asunto}
          onChange={(e) => setFormData({...formData, asunto: e.target.value})}
          required
          placeholder="Ej: Consulta sobre disponibilidad"
        />
      </div>

      <div className="form-group">
        <label>Mensaje *</label>
        <textarea 
          value={formData.mensaje}
          onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
          rows="4"
          required
          placeholder="Describe tu consulta en detalle..."
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancelar" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="btn-enviar">
          Enviar Consulta
        </button>
      </div>
    </form>
  );
};

export default BotonAyudaFlotante;