import React, { useState, useEffect } from 'react';
import './Usuarios.css';

const Usuarios = () => {
  const [activeTab, setActiveTab] = useState('empleados');
  const [empleados, setEmpleados] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState(null);

  // Estado para nuevo empleado
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    puesto: 'recepcionista',
    salario: '',
    fecha_contratacion: new Date().toISOString().split('T')[0],
    username: '',
    password: '',
    role: 'recepcionista'
  });

  // Opciones para puestos y roles
  const puestosOptions = [
    { value: 'administrador', label: 'Administrador' },
    { value: 'recepcionista', label: 'Recepcionista' },
    { value: 'limpieza', label: 'Limpieza' },
    { value: 'cocina', label: 'Cocina' },
    { value: 'seguridad', label: 'Seguridad' }
  ];

  const rolesOptions = [
    { value: 'administrador', label: 'Administrador' },
    { value: 'recepcionista', label: 'Recepcionista' }
  ];

  // Cargar empleados
  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/empleados/buscar?query=${searchTerm}`);
      const data = await response.json();
      
      if (data.success) {
        setEmpleados(data.data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Error al cargar empleados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar clientes
  const cargarClientes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/clientes/buscar?query=${searchTerm}`);
      const data = await response.json();
      
      if (data.success) {
        setClientes(data.data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Error al cargar clientes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'empleados') {
      cargarEmpleados();
    } else {
      cargarClientes();
    }
  }, [activeTab, searchTerm]);

  // Manejar búsqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Crear nuevo empleado
  const handleCrearEmpleado = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/empleados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoEmpleado)
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        resetForm();
        cargarEmpleados();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Error al crear empleado: ' + error.message);
    }
  };

  // Actualizar empleado
  const handleActualizarEmpleado = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/empleados/${editingEmpleado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoEmpleado)
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        setEditingEmpleado(null);
        resetForm();
        cargarEmpleados();
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('Error al actualizar empleado: ' + error.message);
    }
  };

  // Eliminar empleado
  const handleEliminarEmpleado = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/empleados/${id}`, {
          method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
          cargarEmpleados();
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('Error al eliminar empleado: ' + error.message);
      }
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setNuevoEmpleado({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      puesto: 'recepcionista',
      salario: '',
      fecha_contratacion: new Date().toISOString().split('T')[0],
      username: '',
      password: '',
      role: 'recepcionista'
    });
  };

  // Abrir modal para editar
  const abrirEditarModal = (empleado) => {
    setEditingEmpleado(empleado);
    setNuevoEmpleado({
      nombre: empleado.nombre,
      apellido: empleado.apellido,
      email: empleado.email,
      telefono: empleado.telefono || '',
      puesto: empleado.puesto,
      salario: empleado.salario,
      fecha_contratacion: empleado.fecha_contratacion,
      username: empleado.username || '',
      password: '', // No mostrar contraseña actual
      role: empleado.role || 'recepcionista'
    });
    setShowModal(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setShowModal(false);
    setEditingEmpleado(null);
    resetForm();
  };

  // Formatear salario
  const formatSalario = (salario) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(salario);
  };

  // Formatear fecha
  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-MX');
  };

  // Formatear moneda para clientes
  const formatMoneda = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  };

  // Calcular edad desde fecha de nacimiento
  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'N/A';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h1>GESTIÓN DE USUARIOS Y EMPLEADOS</h1>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder={`Buscar por nombre, email o ${activeTab === 'empleados' ? 'puesto' : 'usuario'}...`}
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        {activeTab === 'empleados' && (
          <button 
            className="btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Agregar Empleado
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-error">×</button>
        </div>
      )}

      {/* Pestañas */}
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'empleados' ? 'active' : ''}`}
            onClick={() => setActiveTab('empleados')}
          >
            Empleados ({empleados.length})
          </button>
          <button 
            className={`tab ${activeTab === 'clientes' ? 'active' : ''}`}
            onClick={() => setActiveTab('clientes')}
          >
            Clientes ({clientes.length})
          </button>
        </div>
      </div>

      {/* Contenido de Empleados */}
      {activeTab === 'empleados' && (
        <div className="empleados-section">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>USUARIO</th>
                  <th>NOMBRE COMPLETO</th>
                  <th>EMAIL</th>
                  <th>TELÉFONO</th>
                  <th>PUESTO</th>
                  <th>SALARIO</th>
                  <th>ROL SISTEMA</th>
                  <th>FECHA CONTRATACIÓN</th>
                  <th>ESTADO SISTEMA</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {empleados.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="no-data">
                      No se encontraron empleados
                    </td>
                  </tr>
                ) : (
                  empleados.map((empleado, index) => (
                    <tr key={empleado.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="user-info">
                          <div className="username">{empleado.username || 'Sin usuario'}</div>
                        </div>
                      </td>
                      <td>
                        <div className="employee-name">
                          <strong>{empleado.nombre} {empleado.apellido}</strong>
                        </div>
                      </td>
                      <td>{empleado.email}</td>
                      <td>{empleado.telefono || 'N/A'}</td>
                      <td>
                        <span className="puesto-tag">{empleado.puesto}</span>
                      </td>
                      <td className="salario">{formatSalario(empleado.salario)}</td>
                      <td>
                        <span className={`role-tag ${empleado.role || 'sin-rol'}`}>
                          {empleado.role || 'Sin acceso'}
                        </span>
                      </td>
                      <td>{formatFecha(empleado.fecha_contratacion)}</td>
                      <td>
                        <span className={`estado-badge ${empleado.estado_sistema}`}>
                          {empleado.estado_sistema === 'activo' ? 'Activo' : 'Sin acceso'}
                        </span>
                      </td>
                      <td>
                        <div className="acciones">
                          <button 
                            className="btn-editar"
                            onClick={() => abrirEditarModal(empleado)}
                          >
                            Editar
                          </button>
                          <button 
                            className="btn-eliminar"
                            onClick={() => handleEliminarEmpleado(empleado.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Contenido de Clientes */}
      {activeTab === 'clientes' && (
        <div className="clientes-section">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>USUARIO</th>
                  <th>NOMBRE COMPLETO</th>
                  <th>EMAIL</th>
                  <th>TELÉFONO</th>
                  <th>EDAD</th>
                  <th>FECHA REGISTRO</th>
                  <th>TOTAL RESERVAS</th>
                  <th>TOTAL GASTADO</th>
                  <th>ÚLTIMA ACTUALIZACIÓN</th>
                </tr>
              </thead>
              <tbody>
                {clientes.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="no-data">
                      No se encontraron clientes
                    </td>
                  </tr>
                ) : (
                  clientes.map((cliente, index) => (
                    <tr key={cliente.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="user-info">
                          <div className="username">{cliente.username}</div>
                        </div>
                      </td>
                      <td>
                        <strong>{cliente.nombre} {cliente.apellido}</strong>
                      </td>
                      <td>{cliente.email}</td>
                      <td>{cliente.telefono || 'N/A'}</td>
                      <td>
                        <span className="edad-tag">
                          {calcularEdad(cliente.fecha_nacimiento)} años
                        </span>
                      </td>
                      <td>{formatFecha(cliente.fecha_registro)}</td>
                      <td>
                        <span className="reservas-count">
                          {cliente.total_reservas}
                        </span>
                      </td>
                      <td className="total-gastado">
                        {formatMoneda(cliente.total_gastado)}
                      </td>
                      <td>{formatFecha(cliente.fecha_actualizacion)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para agregar/editar empleado - MEJORADO */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingEmpleado ? 'Editar Empleado' : 'Agregar Nuevo Empleado'}</h2>
              <button 
                className="close-modal"
                onClick={cerrarModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={editingEmpleado ? handleActualizarEmpleado : handleCrearEmpleado}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={nuevoEmpleado.nombre}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Juan"
                  />
                </div>

                <div className="form-group">
                  <label>Apellido *</label>
                  <input
                    type="text"
                    name="apellido"
                    value={nuevoEmpleado.apellido}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: Pérez"
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={nuevoEmpleado.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Ej: juan.perez@hotel.com"
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={nuevoEmpleado.telefono}
                    onChange={handleInputChange}
                    placeholder="Ej: 123-456-7890"
                  />
                </div>

                <div className="form-group">
                  <label>Puesto *</label>
                  <select
                    name="puesto"
                    value={nuevoEmpleado.puesto}
                    onChange={handleInputChange}
                    required
                  >
                    {puestosOptions.map(puesto => (
                      <option key={puesto.value} value={puesto.value}>
                        {puesto.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Salario *</label>
                  <input
                    type="number"
                    name="salario"
                    value={nuevoEmpleado.salario}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                    placeholder="Ej: 1500.00"
                  />
                </div>

                <div className="form-group">
                  <label>Fecha de Contratación *</label>
                  <input
                    type="date"
                    name="fecha_contratacion"
                    value={nuevoEmpleado.fecha_contratacion}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <h3>Credenciales de Sistema (Opcional)</h3>
                  <p className="form-help">
                    Solo completar si el empleado necesita acceso al sistema
                  </p>
                </div>

                <div className="form-group">
                  <label>Usuario</label>
                  <input
                    type="text"
                    name="username"
                    value={nuevoEmpleado.username}
                    onChange={handleInputChange}
                    placeholder="Nombre de usuario para login"
                  />
                </div>

                <div className="form-group">
                  <label>Contraseña {!editingEmpleado && nuevoEmpleado.username && '*'}</label>
                  <input
                    type="password"
                    name="password"
                    value={nuevoEmpleado.password}
                    onChange={handleInputChange}
                    required={!editingEmpleado && nuevoEmpleado.username}
                    placeholder={editingEmpleado ? "Dejar vacío para mantener actual" : "Mínimo 4 caracteres"}
                  />
                </div>

                <div className="form-group">
                  <label>Rol Sistema</label>
                  <select
                    name="role"
                    value={nuevoEmpleado.role}
                    onChange={handleInputChange}
                  >
                    {rolesOptions.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancelar" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-guardar">
                  {editingEmpleado ? 'Actualizar' : 'Crear'} Empleado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;