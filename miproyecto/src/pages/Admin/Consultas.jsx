import React, { useState } from 'react';
import './Consultas.css';

const Consultas = () => {
    const [tipoConsulta, setTipoConsulta] = useState('reservas-por-fecha');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [habitacion, setHabitacion] = useState('');
    const [resultados, setResultados] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const ejecutarConsulta = async () => {
        if (!fechaInicio || !fechaFin) {
            setError('Las fechas inicio y fin son obligatorias');
            return;
        }

        setCargando(true);
        setError('');
        setResultados(null);
        
        try {
            let url = '';
            const params = new URLSearchParams({
                fechaInicio,
                fechaFin
            });

            switch (tipoConsulta) {
                case 'reservas-por-fecha':
                    url = `/api/consultas/reservas-por-fecha`;
                    if (habitacion) params.append('habitacion', habitacion);
                    break;
                case 'ocupacion-habitacion':
                    url = `/api/consultas/ocupacion-habitacion`;
                    break;
                case 'clientes-frecuentes':
                    url = `/api/consultas/clientes-frecuentes`;
                    break;
                case 'ingresos-periodo':
                    url = `/api/consultas/ingresos-periodo`;
                    break;
                case 'habitaciones-populares':
                    url = `/api/consultas/habitaciones-populares`;
                    break;
                default:
                    throw new Error('Tipo de consulta no válido');
            }

            const urlCompleta = `${url}?${params.toString()}`;
            console.log(`🔍 Ejecutando consulta: ${urlCompleta}`);
            
            const response = await fetch(urlCompleta);
            
            if (!response.ok) {
                // Intentar obtener el mensaje de error del backend
                try {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
                } catch (e) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
            }

            const data = await response.json();
            
            if (data.success) {
                console.log(`✅ Consulta exitosa: ${data.data?.length || 0} registros encontrados`);
                setResultados(data.data);
            } else {
                throw new Error(data.error || 'Error en la consulta');
            }
        } catch (err) {
            console.error('❌ Error en consulta:', err);
            setError('Error al ejecutar la consulta: ' + err.message);
            setResultados(null);
        } finally {
            setCargando(false);
        }
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return 'N/A';
        try {
            return new Date(fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    const formatearMoneda = (monto) => {
        if (!monto && monto !== 0) return 'N/A';
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'PEN'
        }).format(monto || 0);
    };

    const limpiarFiltros = () => {
        setFechaInicio('');
        setFechaFin('');
        setHabitacion('');
        setResultados(null);
        setError('');
    };

    const renderizarResultados = () => {
        if (!resultados) return null;

        if (resultados.length === 0) {
            return (
                <div className="no-resultados">
                    <div className="no-resultados-icon">📭</div>
                    <h3>No se encontraron resultados</h3>
                    <p>No hay datos que coincidan con los criterios de búsqueda seleccionados.</p>
                </div>
            );
        }

        switch (tipoConsulta) {
            case 'reservas-por-fecha':
                return (
                    <div className="tabla-resultados">
                        <div className="resultados-header">
                            <h3>📅 Reservas por Fecha</h3>
                            <span className="contador-resultados">{resultados.length} registros</span>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID Reserva</th>
                                        <th>Cliente</th>
                                        <th>Email</th>
                                        <th>Habitación</th>
                                        <th>Check-in</th>
                                        <th>Check-out</th>
                                        <th>Total</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultados.map((reserva) => (
                                        <tr key={reserva.id}>
                                            <td className="text-center">#{reserva.id}</td>
                                            <td>
                                                <div className="cliente-info">
                                                    <strong>{reserva.cliente_nombre} {reserva.cliente_apellido}</strong>
                                                </div>
                                            </td>
                                            <td>{reserva.cliente_email}</td>
                                            <td>
                                                <div className="habitacion-info">
                                                    <span className="numero-habitacion">{reserva.numero_habitacion}</span>
                                                    <span className="tipo-habitacion">({reserva.habitacion_tipo})</span>
                                                </div>
                                            </td>
                                            <td>{formatearFecha(reserva.fecha_entrada)}</td>
                                            <td>{formatearFecha(reserva.fecha_salida)}</td>
                                            <td className="text-right">{formatearMoneda(reserva.total)}</td>
                                            <td className={`estado ${reserva.estado?.toLowerCase() || 'desconocido'}`}>
                                                <span className="estado-badge">{reserva.estado || 'N/A'}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'ocupacion-habitacion':
                return (
                    <div className="tabla-resultados">
                        <div className="resultados-header">
                            <h3>🏨 Ocupación por Habitación</h3>
                            <span className="contador-resultados">{resultados.length} habitaciones</span>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Habitación</th>
                                        <th>Tipo</th>
                                        <th>Total Reservas</th>
                                        <th>Total Noches</th>
                                        <th>Ingresos</th>
                                        <th>% Ocupación</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultados.map((hab, index) => (
                                        <tr key={index}>
                                            <td className="text-center">{hab.numero}</td>
                                            <td>{hab.tipo}</td>
                                            <td className="text-center">{hab.total_reservas || 0}</td>
                                            <td className="text-center">{hab.total_noches || 0}</td>
                                            <td className="text-right">{formatearMoneda(hab.ingresos_totales)}</td>
                                            <td className="text-center">
                                                <div className="porcentaje-container">
                                                    <span className={`porcentaje ${hab.porcentaje_ocupacion > 70 ? 'alto' : hab.porcentaje_ocupacion > 30 ? 'medio' : 'bajo'}`}>
                                                        {hab.porcentaje_ocupacion || 0}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'clientes-frecuentes':
                return (
                    <div className="tabla-resultados">
                        <div className="resultados-header">
                            <h3>👥 Clientes Frecuentes</h3>
                            <span className="contador-resultados">{resultados.length} clientes</span>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Email</th>
                                        <th>Nacionalidad</th>
                                        <th>Total Reservas</th>
                                        <th>Total Noches</th>
                                        <th>Total Gastado</th>
                                        <th>Última Visita</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultados.map((cliente, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div className="cliente-info">
                                                    <strong>{cliente.nombre} {cliente.apellido}</strong>
                                                </div>
                                            </td>
                                            <td>{cliente.email}</td>
                                            <td>{cliente.nacionalidad || 'No especificada'}</td>
                                            <td className="text-center">{cliente.total_reservas || 0}</td>
                                            <td className="text-center">{cliente.total_noches || 0}</td>
                                            <td className="text-right">{formatearMoneda(cliente.total_gastado)}</td>
                                            <td>{formatearFecha(cliente.ultima_reserva)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'ingresos-periodo':
                return (
                    <div className="tabla-resultados">
                        <div className="resultados-header">
                            <h3>💰 Ingresos por Período</h3>
                            <span className="contador-resultados">{resultados.length} períodos</span>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Mes</th>
                                        <th>Total Reservas</th>
                                        <th>Ingresos Totales</th>
                                        <th>Promedio por Reserva</th>
                                        <th>Total Noches</th>
                                        <th>Estadía Promedio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultados.map((ingreso, index) => (
                                        <tr key={index}>
                                            <td>
                                                <strong>{ingreso.mes}</strong>
                                            </td>
                                            <td className="text-center">{ingreso.total_reservas || 0}</td>
                                            <td className="text-right">{formatearMoneda(ingreso.ingresos_totales)}</td>
                                            <td className="text-right">{formatearMoneda(ingreso.promedio_por_reserva)}</td>
                                            <td className="text-center">{ingreso.total_noches || 0}</td>
                                            <td className="text-center">{ingreso.promedio_estadia || 0} días</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'habitaciones-populares':
                return (
                    <div className="tabla-resultados">
                        <div className="resultados-header">
                            <h3>🛏️ Habitaciones Más Populares</h3>
                            <span className="contador-resultados">{resultados.length} habitaciones</span>
                        </div>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Habitación</th>
                                        <th>Tipo</th>
                                        <th>Precio Base</th>
                                        <th>Total Reservas</th>
                                        <th>Total Noches</th>
                                        <th>Ingresos Generados</th>
                                        <th>Estadía Promedio</th>
                                        <th>% Reservas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultados.map((hab, index) => (
                                        <tr key={index}>
                                            <td className="text-center">{hab.numero}</td>
                                            <td>{hab.tipo}</td>
                                            <td className="text-right">{formatearMoneda(hab.precio)}</td>
                                            <td className="text-center">{hab.total_reservas || 0}</td>
                                            <td className="text-center">{hab.total_noches || 0}</td>
                                            <td className="text-right">{formatearMoneda(hab.ingresos_generados)}</td>
                                            <td className="text-center">{hab.promedio_estadia || 0} días</td>
                                            <td className="text-center">
                                                <div className="porcentaje-container">
                                                    <span className={`porcentaje ${hab.porcentaje_reservas > 15 ? 'alto' : hab.porcentaje_reservas > 5 ? 'medio' : 'bajo'}`}>
                                                        {hab.porcentaje_reservas || 0}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="no-resultados">
                        <div className="no-resultados-icon">❓</div>
                        <h3>Tipo de consulta no soportado</h3>
                        <p>Selecciona un tipo de consulta válido.</p>
                    </div>
                );
        }
    };

    return (
        <div className="consultas-container">
            <div className="consultas-header">
                <h1>🔍 CONSULTAS PARAMETRIZADAS</h1>
                <p>Genera reportes y análisis del negocio en tiempo real</p>
            </div>

            <div className="formulario-consultas">
                <div className="campo-grupo">
                    <div className="campo">
                        <label>Tipo de Consulta:</label>
                        <select 
                            value={tipoConsulta} 
                            onChange={(e) => {
                                setTipoConsulta(e.target.value);
                                setResultados(null);
                                setError('');
                            }}
                            className="select-consulta"
                        >
                            <option value="reservas-por-fecha">📅 Reservas por Fecha</option>
                            <option value="ocupacion-habitacion">🏨 Ocupación por Habitación</option>
                            <option value="clientes-frecuentes">👥 Clientes Frecuentes</option>
                            <option value="ingresos-periodo">💰 Ingresos por Período</option>
                            <option value="habitaciones-populares">🛏️ Habitaciones Más Populares</option>
                        </select>
                    </div>
                </div>

                <div className="campo-grupo">
                    <div className="campo-fechas">
                        <div className="campo">
                            <label>Fecha Inicio:</label>
                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                className="input-fecha"
                            />
                        </div>
                        
                        <div className="campo">
                            <label>Fecha Fin:</label>
                            <input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                className="input-fecha"
                            />
                        </div>
                    </div>
                </div>

                {tipoConsulta === 'reservas-por-fecha' && (
                    <div className="campo-grupo">
                        <div className="campo">
                            <label>Filtrar por habitación (opcional):</label>
                            <input
                                type="text"
                                placeholder="Ej: 101, 201, 305..."
                                value={habitacion}
                                onChange={(e) => setHabitacion(e.target.value)}
                                className="input-habitacion"
                            />
                            <small className="hint">Dejar vacío para ver todas las habitaciones</small>
                        </div>
                    </div>
                )}

                <div className="acciones-consultas">
                    <button 
                        className="btn-ejecutar"
                        onClick={ejecutarConsulta}
                        disabled={cargando || !fechaInicio || !fechaFin}
                    >
                        {cargando ? (
                            <>
                                <span className="spinner"></span>
                                ⏳ Ejecutando...
                            </>
                        ) : (
                            '🚀 Ejecutar Consulta'
                        )}
                    </button>
                    
                    <button 
                        className="btn-limpiar"
                        onClick={limpiarFiltros}
                        disabled={cargando}
                    >
                        🗑️ Limpiar
                    </button>
                </div>

                {error && (
                    <div className="error-message">
                        <div className="error-icon">❌</div>
                        <div className="error-content">
                            <strong>Error:</strong> {error}
                        </div>
                    </div>
                )}
            </div>

            <div className="resultados-section">
                <h2>📋 Resultados</h2>
                {cargando ? (
                    <div className="cargando">
                        <div className="loading-spinner"></div>
                        <p>Procesando consulta...</p>
                        <small>Esto puede tomar unos segundos</small>
                    </div>
                ) : (
                    renderizarResultados()
                )}
            </div>
        </div>
    );
};

export default Consultas;