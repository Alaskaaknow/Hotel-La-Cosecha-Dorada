import React, { useState, useEffect } from 'react';
import { 
  FaReply, 
  FaEnvelope, 
  FaSync, 
  FaUser, 
  FaPhone, 
  FaCalendar,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaTrash  // ← NUEVO ICONO PARA ELIMINAR
} from 'react-icons/fa';

const MensajesContacto = () => {
  const [consultas, setConsultas] = useState([]);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  useEffect(() => {
    cargarConsultas();
  }, []);

  const cargarConsultas = async () => {
    try {
      setCargando(true);
      const response = await fetch('http://localhost:5000/api/consultas');
      
      if (response.ok) {
        const data = await response.json();
        setConsultas(data.consultas || []);
      } else {
        console.error('Error cargando consultas');
        setConsultas([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setConsultas([]);
    } finally {
      setCargando(false);
    }
  };

  const actualizarConsultas = async () => {
    try {
      setActualizando(true);
      await cargarConsultas();
    } finally {
      setActualizando(false);
    }
  };

  // 🆕 FUNCIÓN PARA ELIMINAR CONSULTA
  const eliminarConsulta = async (id, e) => {
    // Prevenir que el click se propague al contenedor
    if (e) e.stopPropagation();
    
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta consulta? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/consultas/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Eliminar de la lista local
        setConsultas(prev => prev.filter(consulta => consulta.id !== id));
        
        // Si la consulta eliminada era la seleccionada, limpiar el panel
        if (consultaSeleccionada && consultaSeleccionada.id === id) {
          setConsultaSeleccionada(null);
          setRespuesta('');
        }
        
        alert('Consulta eliminada exitosamente');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error al eliminar la consulta');
      }
    } catch (error) {
      alert('Error de conexión al eliminar la consulta');
    }
  };

  // 🆕 FUNCIÓN PARA ELIMINAR DESDE EL PANEL DE RESPUESTA
  const eliminarConsultaSeleccionada = () => {
    if (!consultaSeleccionada) return;
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar la consulta de ${consultaSeleccionada.nombre}? Esta acción no se puede deshacer.`)) {
      eliminarConsulta(consultaSeleccionada.id);
    }
  };

  const handleResponder = async () => {
    if (!respuesta.trim() || !consultaSeleccionada) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/consultas/${consultaSeleccionada.id}/responder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          respuesta: respuesta,
          operador: 'Recepción'
        })
      });

      if (response.ok) {
        alert('Respuesta enviada exitosamente');
        
        // Recargar consultas y limpiar formulario
        await cargarConsultas();
        setRespuesta('');
        setConsultaSeleccionada(null);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error al enviar la respuesta');
      }
    } catch (error) {
      alert('Error de conexión. Intenta nuevamente.');
    }
  };

  const cambiarEstadoConsulta = async (id, nuevoEstado) => {
    try {
      const response = await fetch(`http://localhost:5000/api/consultas/${id}/estado`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (response.ok) {
        await cargarConsultas();
        
        // Si estamos viendo esta consulta, actualizarla
        if (consultaSeleccionada && consultaSeleccionada.id === id) {
          setConsultaSeleccionada(prev => ({
            ...prev,
            estado: nuevoEstado
          }));
        }
      } else {
        alert('Error al cambiar estado');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  const formatearFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      pendiente: { 
        clase: 'estado-pendiente', 
        texto: 'Pendiente',
        icono: <FaClock className="icono-estado" />
      },
      en_proceso: { 
        clase: 'estado-proceso', 
        texto: 'En Proceso',
        icono: <FaExclamationTriangle className="icono-estado" />
      },
      resuelto: { 
        clase: 'estado-resuelto', 
        texto: 'Resuelto',
        icono: <FaCheckCircle className="icono-estado" />
      }
    };
    
    const estadoInfo = estados[estado] || estados.pendiente;
    return (
      <span className={`badge-estado ${estadoInfo.clase}`}>
        {estadoInfo.icono}
        {estadoInfo.texto}
      </span>
    );
  };

  const getEstadisticas = () => {
    const total = consultas.length;
    const pendientes = consultas.filter(c => c.estado === 'pendiente').length;
    const enProceso = consultas.filter(c => c.estado === 'en_proceso').length;
    const resueltas = consultas.filter(c => c.estado === 'resuelto').length;

    return { total, pendientes, enProceso, resueltas };
  };

  const estadisticas = getEstadisticas();

  return (
    <div className="mensajes-contacto">
      <div className="mensajes-header">
        <div className="header-info">
          <h2>Consultas de Clientes</h2>
          <div className="estadisticas-rapidas">
            <span className="stat total">Total: {estadisticas.total}</span>
            <span className="stat pendientes">Pendientes: {estadisticas.pendientes}</span>
            <span className="stat proceso">En proceso: {estadisticas.enProceso}</span>
            <span className="stat resueltas">Resueltas: {estadisticas.resueltas}</span>
          </div>
        </div>
        <button 
          className="btn-actualizar" 
          onClick={actualizarConsultas}
          disabled={actualizando}
        >
          <FaSync className={actualizando ? 'rotando' : ''} /> 
          {actualizando ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      <div className="mensajes-content">
        <div className="bandeja-entrada">
          <h3>Bandeja de Entrada</h3>
          
          {cargando ? (
            <div className="cargando-mensajes">
              <p>Cargando consultas...</p>
            </div>
          ) : consultas.length > 0 ? (
            <div className="lista-mensajes">
              {consultas.map(consulta => (
                <div 
                  key={consulta.id}
                  className={`mensaje-item ${consultaSeleccionada?.id === consulta.id ? 'seleccionado' : ''} ${consulta.estado}`}
                  onClick={() => setConsultaSeleccionada(consulta)}
                >
                  <div className="mensaje-header">
                    <div className="mensaje-info">
                      <h4 className="mensaje-nombre">
                        <FaUser className="icono-pequeno" />
                        {consulta.nombre}
                      </h4>
                      <p className="mensaje-asunto">{consulta.asunto}</p>
                    </div>
                    <div className="mensaje-acciones-superiores">
                      {getEstadoBadge(consulta.estado)}
                      {/* 🆕 BOTÓN ELIMINAR EN LA LISTA */}
                      <button 
                        className="btn-eliminar-lista"
                        onClick={(e) => eliminarConsulta(consulta.id, e)}
                        title="Eliminar consulta"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mensaje-detalles">
                    <div className="detalle-item">
                      <FaEnvelope className="icono-pequeno" />
                      <span>{consulta.email}</span>
                    </div>
                    {consulta.telefono && (
                      <div className="detalle-item">
                        <FaPhone className="icono-pequeno" />
                        <span>{consulta.telefono}</span>
                      </div>
                    )}
                    <div className="detalle-item">
                      <FaCalendar className="icono-pequeno" />
                      <span>{formatearFecha(consulta.fecha_creacion)}</span>
                    </div>
                  </div>
                  
                  <div className="mensaje-preview">
                    {consulta.mensaje.length > 100 
                      ? `${consulta.mensaje.substring(0, 100)}...` 
                      : consulta.mensaje
                    }
                  </div>

                  {consulta.estado !== 'resuelto' && (
                    <div className="mensaje-acciones">
                      {consulta.estado === 'pendiente' && (
                        <button 
                          className="btn-proceso"
                          onClick={(e) => {
                            e.stopPropagation();
                            cambiarEstadoConsulta(consulta.id, 'en_proceso');
                          }}
                        >
                          En Proceso
                        </button>
                      )}
                      <button 
                        className="btn-resuelto"
                        onClick={(e) => {
                          e.stopPropagation();
                          cambiarEstadoConsulta(consulta.id, 'resuelto');
                        }}
                      >
                        Resuelto
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="sin-mensajes">
              <FaEnvelope size={64} color="#9d2b2b" />
              <p>No hay consultas de clientes</p>
              <small>Las consultas enviadas desde el botón de ayuda aparecerán aquí</small>
            </div>
          )}
        </div>

        <div className="panel-respuesta">
          {consultaSeleccionada ? (
            <div className="respuesta-form">
              <div className="respuesta-header">
                <div>
                  <h4>Responder a: {consultaSeleccionada.nombre}</h4>
                  {getEstadoBadge(consultaSeleccionada.estado)}
                </div>
                <div className="acciones-header">
                  {/* 🆕 BOTÓN ELIMINAR EN EL PANEL */}
                  <button 
                    className="btn-eliminar-panel"
                    onClick={eliminarConsultaSeleccionada}
                    title="Eliminar esta consulta"
                  >
                    <FaTrash /> Eliminar
                  </button>
                  
                  {consultaSeleccionada.estado !== 'resuelto' && (
                    <>
                      {consultaSeleccionada.estado === 'pendiente' && (
                        <button 
                          className="btn-proceso"
                          onClick={() => cambiarEstadoConsulta(consultaSeleccionada.id, 'en_proceso')}
                        >
                          En Proceso
                        </button>
                      )}
                      <button 
                        className="btn-resuelto"
                        onClick={() => cambiarEstadoConsulta(consultaSeleccionada.id, 'resuelto')}
                      >
                        Marcar Resuelto
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="mensaje-original">
                <div className="campo-mensaje">
                  <label>Email:</label>
                  <span>{consultaSeleccionada.email}</span>
                </div>
                {consultaSeleccionada.telefono && (
                  <div className="campo-mensaje">
                    <label>Teléfono:</label>
                    <span>{consultaSeleccionada.telefono}</span>
                  </div>
                )}
                <div className="campo-mensaje">
                  <label>Asunto:</label>
                  <span>{consultaSeleccionada.asunto}</span>
                </div>
                <div className="campo-mensaje">
                  <label>Mensaje:</label>
                  <div className="mensaje-completo">{consultaSeleccionada.mensaje}</div>
                </div>
                <div className="campo-mensaje">
                  <label>Fecha:</label>
                  <span>{formatearFecha(consultaSeleccionada.fecha_creacion)}</span>
                </div>
              </div>
              
              {consultaSeleccionada.estado !== 'resuelto' && (
                <>
                  <div className="respuesta-input">
                    <label>Tu respuesta:</label>
                    <textarea
                      value={respuesta}
                      onChange={(e) => setRespuesta(e.target.value)}
                      placeholder="Escribe tu respuesta al cliente aquí..."
                      rows="6"
                    />
                  </div>
                  
                  <div className="respuesta-actions">
                    <button 
                      className="btn-enviar-respuesta"
                      onClick={handleResponder}
                      disabled={!respuesta.trim()}
                    >
                      <FaReply /> Enviar Respuesta
                    </button>
                    <button 
                      className="btn-cancelar"
                      onClick={() => {
                        setConsultaSeleccionada(null);
                        setRespuesta('');
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              )}

              {consultaSeleccionada.estado === 'resuelto' && consultaSeleccionada.respuesta && (
                <div className="respuesta-previas">
                  <h5>Respuesta enviada:</h5>
                  <div className="respuesta-anterior">
                    {consultaSeleccionada.respuesta}
                  </div>
                  {consultaSeleccionada.fecha_respuesta && (
                    <div className="fecha-respuesta">
                      Respondido el: {formatearFecha(consultaSeleccionada.fecha_respuesta)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="seleccionar-mensaje">
              <FaEnvelope size={48} color="#ccc" />
              <p>Selecciona un mensaje para responder</p>
              <small>Haz clic en cualquier consulta de la lista para ver los detalles y responder</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MensajesContacto;