import React, { useState, useEffect } from 'react';
import { 
  FaBed, 
  FaCalendarAlt, 
  FaListAlt, 
  FaEdit, 
  FaTrash, 
  FaSearch,
  FaPlus,
  FaUsers,
  FaMoneyBillWave,
  FaCog,
  FaDoorOpen,
  FaDoorClosed,
  FaTools,
  FaEye
} from 'react-icons/fa';
import './Habitaciones.css';

const Habitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [mostrarReservas, setMostrarReservas] = useState(false);
  const [habitacionEditando, setHabitacionEditando] = useState(null);
  const [habitacionCalendario, setHabitacionCalendario] = useState(null);
  const [habitacionReservas, setHabitacionReservas] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [disponibilidad, setDisponibilidad] = useState(null);
  const [reservas, setReservas] = useState([]);

  // Estado para nueva habitación
  const [nuevaHabitacion, setNuevaHabitacion] = useState({
    numero: '',
    nombre: '',
    tipo: 'doble',
    descripcion: '',
    capacidad: 2,
    precio: 0,
    imagen: 'doble1.jpg',
    estado: 'disponible'
  });

  // Cargar habitaciones - VERSIÓN MEJORADA
  const cargarHabitaciones = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando habitaciones con info de reservas...');
      
      // Usar el nuevo endpoint que incluye info de reservas
      const response = await fetch('/api/habitaciones-con-reservas');
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ ${result.data.length} habitaciones cargadas`);
        setHabitaciones(result.data);
      } else {
        throw new Error(result.error || 'Error al cargar habitaciones');
      }
    } catch (error) {
      console.error('❌ Error cargando habitaciones:', error);
      // Fallback al endpoint original
      try {
        const response = await fetch('/api/habitaciones');
        const result = await response.json();
        if (result.success) {
          setHabitaciones(result.data);
        }
      } catch (fallbackError) {
        alert('Error al cargar habitaciones: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  // Cargar disponibilidad para calendario
  const cargarDisponibilidad = async (habitacionId, mes = null, año = null) => {
    try {
      const fecha = new Date();
      const mesParam = mes || fecha.getMonth() + 1;
      const añoParam = año || fecha.getFullYear();
      
      const response = await fetch(
        `/api/habitaciones/disponibilidad/${habitacionId}?mes=${mesParam}&año=${añoParam}`
      );
      
      const result = await response.json();
      
      if (result.success) {
        setDisponibilidad(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('❌ Error cargando disponibilidad:', error);
      alert('Error al cargar disponibilidad: ' + error.message);
    }
  };

  // Cargar reservas de una habitación - VERSIÓN MEJORADA
  const cargarReservas = async (habitacionId) => {
    try {
      console.log(`📋 Cargando reservas para habitación ${habitacionId}...`);
      
      // Primero intentar con el endpoint nuevo y robusto
      const response = await fetch(`/api/reservas/habitacion/${habitacionId}`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ ${result.data.length} reservas cargadas`);
        setReservas(result.data);
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      console.error('❌ Error cargando reservas:', error);
      
      // Método de respaldo: cargar todas las reservas y filtrar
      try {
        console.log('🔄 Intentando método de respaldo...');
        const response = await fetch('/api/reservas');
        const result = await response.json();
        
        if (result.success) {
          const reservasFiltradas = result.data.filter(
            reserva => reserva.habitacion_id === parseInt(habitacionId)
          );
          console.log(`✅ ${reservasFiltradas.length} reservas encontradas (respaldo)`);
          setReservas(reservasFiltradas);
        } else {
          setReservas([]);
        }
      } catch (fallbackError) {
        console.error('❌ Error en método de respaldo:', fallbackError);
        setReservas([]);
      }
    }
  };

  // Abrir modales
  const abrirModalNueva = () => {
    setHabitacionEditando(null);
    setNuevaHabitacion({
      numero: '',
      nombre: '',
      tipo: 'doble',
      descripcion: '',
      capacidad: 2,
      precio: 0,
      imagen: 'doble1.jpg',
      estado: 'disponible'
    });
    setMostrarModal(true);
  };

  const abrirModalEditar = (habitacion) => {
    setHabitacionEditando(habitacion);
    setNuevaHabitacion({
      numero: habitacion.numero,
      nombre: habitacion.nombre,
      tipo: habitacion.tipo,
      descripcion: habitacion.descripcion,
      capacidad: habitacion.capacidad,
      precio: habitacion.precio,
      imagen: habitacion.imagen || 'doble1.jpg',
      estado: habitacion.estado
    });
    setMostrarModal(true);
  };

  const abrirCalendario = (habitacion) => {
    setHabitacionCalendario(habitacion);
    setMostrarCalendario(true);
    cargarDisponibilidad(habitacion.id);
  };

  const abrirReservas = (habitacion) => {
    setHabitacionReservas(habitacion);
    setMostrarReservas(true);
    cargarReservas(habitacion.id);
  };

  // Cerrar modales
  const cerrarModal = () => {
    setMostrarModal(false);
    setHabitacionEditando(null);
  };

  const cerrarCalendario = () => {
    setMostrarCalendario(false);
    setHabitacionCalendario(null);
    setDisponibilidad(null);
  };

  const cerrarReservas = () => {
    setMostrarReservas(false);
    setHabitacionReservas(null);
    setReservas([]);
  };

  // Manejar cambios en el formulario
  const handleChange = (field, value) => {
    setNuevaHabitacion(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Guardar habitación
  const guardarHabitacion = async () => {
    try {
      if (!nuevaHabitacion.numero || !nuevaHabitacion.nombre || !nuevaHabitacion.descripcion) {
        alert('❌ Por favor completa todos los campos obligatorios');
        return;
      }

      const url = habitacionEditando 
        ? `/api/habitaciones/${habitacionEditando.id}`
        : '/api/habitaciones';
      
      const method = habitacionEditando ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaHabitacion)
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ Habitación ${habitacionEditando ? 'actualizada' : 'creada'} exitosamente`);
        cerrarModal();
        cargarHabitaciones();
      } else {
        throw new Error(result.error || "Error desconocido");
      }
    } catch (error) {
      console.error('Error guardando habitación:', error);
      alert(`❌ Error al guardar la habitación: ${error.message}`);
    }
  };

  // Eliminar habitación
  const eliminarHabitacion = async (id, numero) => {
    if (window.confirm(`¿Estás seguro de eliminar la habitación ${numero}?`)) {
      try {
        const response = await fetch(`/api/habitaciones/${id}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
          alert('✅ Habitación eliminada exitosamente');
          cargarHabitaciones();
        } else {
          alert(`❌ Error: ${result.error}`);
        }
      } catch (error) {
        console.error('Error eliminando habitación:', error);
        alert('❌ Error al eliminar la habitación');
      }
    }
  };

  // CORREGIDO: Cambiar estado de habitación - SOLO para mantenimiento
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      // Validar que no se pueda cambiar a "ocupada" desde el frontend
      if (nuevoEstado === 'ocupada') {
        alert('⚠️ El estado "Ocupada" solo se activa automáticamente durante el check-in. Use "Mantenimiento" para bloquear la habitación.');
        return;
      }

      const response = await fetch(`/api/habitaciones/${id}/estado`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      const result = await response.json();

      if (result.success) {
        cargarHabitaciones();
      } else {
        throw new Error(result.error || "Error desconocido");
      }
    } catch (error) {
      console.error('❌ Error cambiando estado:', error);
      alert(`❌ Error al cambiar estado: ${error.message}`);
    }
  };

  // Cancelar reserva desde admin
  const cancelarReserva = async (reservaId) => {
    if (window.confirm('¿Estás seguro de cancelar esta reserva?')) {
      try {
        const response = await fetch(`/api/reservas/${reservaId}/cancelar-admin`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const result = await response.json();

        if (result.success) {
          alert('✅ Reserva cancelada exitosamente');
          // Recargar datos
          if (habitacionReservas) {
            cargarReservas(habitacionReservas.id);
          }
          if (habitacionCalendario) {
            cargarDisponibilidad(habitacionCalendario.id);
          }
          cargarHabitaciones();
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error('❌ Error cancelando reserva:', error);
        alert(`❌ Error al cancelar reserva: ${error.message}`);
      }
    }
  };

  // Navegar por meses en el calendario
  const cambiarMesCalendario = (incremento) => {
    if (!disponibilidad || !habitacionCalendario) return;
    
    let nuevoMes = disponibilidad.mes + incremento;
    let nuevoAño = disponibilidad.año;
    
    if (nuevoMes > 12) {
      nuevoMes = 1;
      nuevoAño++;
    } else if (nuevoMes < 1) {
      nuevoMes = 12;
      nuevoAño--;
    }
    
    cargarDisponibilidad(habitacionCalendario.id, nuevoMes, nuevoAño);
  };

  // Filtrar habitaciones
  const habitacionesFiltradas = habitaciones.filter(habitacion =>
    habitacion.numero.toLowerCase().includes(filtro.toLowerCase()) ||
    habitacion.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    habitacion.tipo.toLowerCase().includes(filtro.toLowerCase())
  );

  // Función para obtener color según estado - VERSIÓN MEJORADA
  const getEstadoColor = (estado, tieneReservas = false) => {
    switch (estado) {
      case 'disponible': 
        return tieneReservas ? '#D4A76A' : '#722F37'; // Hueso si tiene reservas, vino si no
      case 'ocupada': return '#8B4513';
      case 'mantenimiento': return '#6D6875';
      default: return '#B5838D';
    }
  };

  // Obtener icono según estado
  const getEstadoIcono = (estado) => {
    switch (estado) {
      case 'disponible': return <FaDoorOpen className="estado-icono" />;
      case 'ocupada': return <FaDoorClosed className="estado-icono" />;
      case 'mantenimiento': return <FaTools className="estado-icono" />;
      default: return <FaBed className="estado-icono" />;
    }
  };

  // Formatear fecha
  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  if (loading) {
    return (
      <div className="habitaciones-loading">
        <div className="loading-spinner"></div>
        <p>Cargando habitaciones...</p>
      </div>
    );
  }

  return (
    <div className="habitaciones-admin">
      {/* Header */}
      <header className="habitaciones-header">
        <div className="header-title">
          <FaBed className="header-icon" />
          <h1>GESTIÓN DE HABITACIONES</h1>
        </div>
        <div className="habitaciones-actions">
          <button className="btn-nueva" onClick={abrirModalNueva}>
            <FaPlus className="btn-icon" />
            Nueva Habitación
          </button>
        </div>
      </header>

      {/* Búsqueda */}
      <div className="filtros-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por número, nombre o tipo..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="input-busqueda"
          />
        </div>
        <div className="filtros-info">
          <span>Mostrando {habitacionesFiltradas.length} de {habitaciones.length} habitaciones</span>
        </div>
      </div>

      {/* Tabla de Habitaciones */}
      <div className="tabla-container">
        <table className="tabla-habitaciones">
          <thead>
            <tr>
              <th>#</th>
              <th>Imagen</th>
              <th>Habitación</th>
              <th>Tipo</th>
              <th>Capacidad</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {habitacionesFiltradas.map((habitacion, index) => (
              <tr key={habitacion.id} className="fila-habitacion">
                <td className="numero-fila">{index + 1}</td>
                <td>
                  <div className="habitacion-imagen">
                    <img 
                      src={`/images/${habitacion.imagen || 'doble1.jpg'}`} 
                      alt={habitacion.nombre}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="imagen-placeholder" style={{display: habitacion.imagen ? 'none' : 'flex'}}>
                      <FaBed />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="habitacion-info">
                    <strong className="habitacion-numero">{habitacion.numero}</strong>
                    <span className="habitacion-nombre">{habitacion.nombre}</span>
                  </div>
                </td>
                <td>
                  <div className="capacidad-info">
                    <FaUsers className="capacidad-icono" />
                    <span>{habitacion.capacidad} personas</span>
                  </div>
                </td>
                <td>
                  <div className="precio-info">
                    <FaMoneyBillWave className="precio-icono" />
                    <strong>S/. {parseFloat(habitacion.precio).toFixed(2)}</strong>
                    <span>por noche</span>
                  </div>
                </td>
                <td>
                  <div className="estado-container">
                    <select
                      value={habitacion.estado}
                      onChange={(e) => cambiarEstado(habitacion.id, e.target.value)}
                      className={`select-estado ${habitacion.estado}`}
                      style={{ 
                        backgroundColor: getEstadoColor(habitacion.estado, habitacion.reservas_activas > 0),
                        color: 'white'
                      }}
                    >
                      {/* SOLO mostrar disponible y mantenimiento - ocupada es automática */}
                      <option value="disponible">Disponible</option>
                      <option value="mantenimiento">Mantenimiento</option>
                      {/* Ocupada solo se muestra cuando está ocupada realmente */}
                      {habitacion.estado === 'ocupada' && (
                        <option value="ocupada">Ocupada (Check-in)</option>
                      )}
                    </select>
                    
                    {/* Mostrar badge si tiene reservas activas */}
                    {habitacion.reservas_activas > 0 && (
                      <div className="reservas-badge">
                        <FaCalendarAlt className="reserva-icono" />
                        {habitacion.reservas_activas} reserva(s)
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="acciones-habitacion">
                    <button 
                      className="btn-accion btn-calendario"
                      onClick={() => abrirCalendario(habitacion)}
                      title="Ver Calendario"
                    >
                      <FaCalendarAlt />
                    </button>
                    <button 
                      className="btn-accion btn-reservas"
                      onClick={() => abrirReservas(habitacion)}
                      title="Ver Reservas"
                    >
                      <FaListAlt />
                    </button>
                    <button 
                      className="btn-accion btn-editar"
                      onClick={() => abrirModalEditar(habitacion)}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn-accion btn-eliminar"
                      onClick={() => eliminarHabitacion(habitacion.id, habitacion.numero)}
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {habitacionesFiltradas.length === 0 && (
          <div className="sin-resultados">
            <FaBed className="sin-resultados-icono" />
            <p>No se encontraron habitaciones</p>
          </div>
        )}
      </div>

      {/* Modal para Crear/Editar Habitación */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-habitacion">
            <div className="modal-header">
              <div className="modal-title">
                {habitacionEditando ? <FaEdit /> : <FaPlus />}
                <h2>{habitacionEditando ? 'EDITAR HABITACIÓN' : 'NUEVA HABITACIÓN'}</h2>
              </div>
              <button className="btn-cerrar" onClick={cerrarModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>N° de Habitación: *</label>
                  <input
                    type="text"
                    value={nuevaHabitacion.numero}
                    onChange={(e) => handleChange('numero', e.target.value)}
                    className="input-form"
                    placeholder="Ej: 101, 202..."
                  />
                </div>

                <div className="form-group">
                  <label>Nombre: *</label>
                  <input
                    type="text"
                    value={nuevaHabitacion.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    className="input-form"
                    placeholder="Ej: Suite Deluxe, Habitación Doble..."
                  />
                </div>

                <div className="form-group">
                  <label>Tipo: *</label>
                  <select
                    value={nuevaHabitacion.tipo}
                    onChange={(e) => handleChange('tipo', e.target.value)}
                    className="select-form"
                  >
                    <option value="simple">Simple</option>
                    <option value="doble">Doble</option>
                    <option value="suite">Suite</option>
                    <option value="familiar">Familiar</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Capacidad: *</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={nuevaHabitacion.capacidad}
                    onChange={(e) => handleChange('capacidad', parseInt(e.target.value))}
                    className="input-form"
                  />
                </div>

                <div className="form-group">
                  <label>Precio por Noche (S/.): *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={nuevaHabitacion.precio}
                    onChange={(e) => handleChange('precio', parseFloat(e.target.value))}
                    className="input-form"
                  />
                </div>

                <div className="form-group">
                  <label>Estado: *</label>
                  <select
                    value={nuevaHabitacion.estado}
                    onChange={(e) => handleChange('estado', e.target.value)}
                    className="select-form"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="mantenimiento">Mantenimiento</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Imagen: *</label>
                  <select
                    value={nuevaHabitacion.imagen}
                    onChange={(e) => handleChange('imagen', e.target.value)}
                    className="select-form"
                  >
                    <option value="doble1.jpg">Doble 1</option>
                    <option value="suitel.jpg">Suite 1</option>
                    <option value="suite2.jpg">Suite 2</option>
                    <option value="familiar1.jpg">Familiar 1</option>
                    <option value="simple1.jpg">Simple 1</option>
                  </select>
                  <small className="form-help">
                    Imágenes disponibles en /public/images/
                  </small>
                </div>

                <div className="form-group full-width">
                  <label>Descripción: *</label>
                  <textarea
                    value={nuevaHabitacion.descripcion}
                    onChange={(e) => handleChange('descripcion', e.target.value)}
                    className="textarea-form"
                    rows="4"
                    placeholder="Describe las características de la habitación..."
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarModal}>
                Cancelar
              </button>
              <button className="btn-guardar" onClick={guardarHabitacion}>
                {habitacionEditando ? 'Actualizar' : 'Crear'} Habitación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Calendario de Disponibilidad */}
      {mostrarCalendario && habitacionCalendario && (
        <div className="modal-overlay">
          <div className="modal-calendario">
            <div className="modal-header">
              <div className="modal-title">
                <FaCalendarAlt />
                <h2>DISPONIBILIDAD - Habitación {habitacionCalendario.numero}</h2>
              </div>
              <button className="btn-cerrar" onClick={cerrarCalendario}>×</button>
            </div>

            <div className="modal-body">
              {disponibilidad ? (
                <div className="calendario-container">
                  <div className="calendario-header">
                    <button onClick={() => cambiarMesCalendario(-1)} className="btn-mes">
                      ‹
                    </button>
                    <h3>
                      {new Date(disponibilidad.año, disponibilidad.mes - 1).toLocaleString('es-ES', { 
                        month: 'long', 
                        year: 'numeric' 
                      }).toUpperCase()}
                    </h3>
                    <button onClick={() => cambiarMesCalendario(1)} className="btn-mes">
                      ›
                    </button>
                  </div>

                  <div className="leyenda-calendario">
                    <div className="leyenda-item">
                      <div className="color-muestra disponible"></div>
                      <span>Disponible</span>
                    </div>
                    <div className="leyenda-item">
                      <div className="color-muestra reservada"></div>
                      <span>Reservada</span>
                    </div>
                  </div>

                  <div className="calendario-grid">
                    {/* Días de la semana */}
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(dia => (
                      <div key={dia} className="dia-header">
                        {dia}
                      </div>
                    ))}

                    {/* Días del mes */}
                    {disponibilidad.dias.map(dia => (
                      <div
                        key={dia.fecha}
                        className={`dia-calendario ${dia.estado}`}
                        title={`${dia.fecha}: ${dia.estado === 'reservada' ? 'Reservada' : 'Disponible'}`}
                      >
                        <span className="numero-dia">{dia.dia}</span>
                      </div>
                    ))}
                  </div>

                  {disponibilidad.reservas.length > 0 && (
                    <div className="reservas-activas">
                      <h4>Reservas Activas este Mes:</h4>
                      <ul>
                        {disponibilidad.reservas.map((reserva, index) => (
                          <li key={index}>
                            <strong>{reserva.cliente_nombre} {reserva.cliente_apellido}</strong><br/>
                            {formatFecha(reserva.fecha_entrada)} a {formatFecha(reserva.fecha_salida)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="cargando-calendario">
                  <p>Cargando disponibilidad...</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarCalendario}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Ver Reservas */}
      {mostrarReservas && habitacionReservas && (
        <div className="modal-overlay">
          <div className="modal-reservas">
            <div className="modal-header">
              <div className="modal-title">
                <FaListAlt />
                <h2>RESERVAS - Habitación {habitacionReservas.numero}</h2>
              </div>
              <button className="btn-cerrar" onClick={cerrarReservas}>×</button>
            </div>

            <div className="modal-body">
              {reservas.length > 0 ? (
                <div className="reservas-container">
                  <div className="reservas-list">
                    {reservas.map((reserva) => (
                      <div key={reserva.id} className="reserva-item">
                        <div className="reserva-header">
                          <h4>{reserva.cliente_nombre} {reserva.cliente_apellido}</h4>
                          <span className={`estado-reserva ${reserva.estado}`}>
                            {reserva.estado}
                          </span>
                        </div>
                        <div className="reserva-details">
                          <p><strong>Email:</strong> {reserva.cliente_email}</p>
                          <p><strong>Fechas:</strong> {formatFecha(reserva.fecha_entrada)} a {formatFecha(reserva.fecha_salida)}</p>
                          <p><strong>Huéspedes:</strong> {reserva.adultos} adultos, {reserva.ninos} niños</p>
                          <p><strong>Total:</strong> S/. {parseFloat(reserva.total).toFixed(2)}</p>
                          <p><strong>Estado pago:</strong> {reserva.estado_pago}</p>
                        </div>
                        <div className="reserva-actions">
                          {reserva.estado === 'confirmada' && (
                            <button 
                              className="btn-cancelar-reserva"
                              onClick={() => cancelarReserva(reserva.id)}
                            >
                              Cancelar Reserva
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="sin-reservas">
                  <FaListAlt className="sin-reservas-icono" />
                  <p>No hay reservas activas para esta habitación</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarReservas}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habitaciones;