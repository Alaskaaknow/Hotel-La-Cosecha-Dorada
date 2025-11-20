import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import './Reportes.css';

const Reportes = () => {
    const [tipoReporte, setTipoReporte] = useState('ventas-ingresos');
    const [periodo, setPeriodo] = useState('mensual');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [estadisticas, setEstadisticas] = useState({});
    const [error, setError] = useState('');

    // Colores para gráficos
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
    const COLOR_VENTAS = '#8884d8';
    const COLOR_RESERVAS = '#82ca9d';

    useEffect(() => {
        // Establecer fechas por defecto (últimos 12 meses)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 11); // Últimos 12 meses
        startDate.setDate(1); // Primer día del mes
        
        setFechaInicio(startDate.toISOString().split('T')[0]);
        setFechaFin(endDate.toISOString().split('T')[0]);
    }, []);

    const generarReporte = async () => {
        if (!fechaInicio || !fechaFin) {
            setError('Por favor seleccione un rango de fechas');
            return;
        }

        if (new Date(fechaInicio) > new Date(fechaFin)) {
            setError('La fecha de inicio no puede ser mayor a la fecha fin');
            return;
        }

        setCargando(true);
        setDatos(null);
        setEstadisticas({});
        setError('');
        
        try {
            const params = new URLSearchParams({
                periodo: tipoReporte === 'ventas-ingresos' ? periodo : 'mensual',
                fechaInicio,
                fechaFin
            });

            console.log('🔍 Solicitando reporte:', `/api/reportes/${tipoReporte}?${params}`);
            
            const response = await fetch(`/api/reportes/${tipoReporte}?${params}`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Error HTTP: ${response.status}`);
            }
            
            const result = await response.json();

            if (result.success) {
                setDatos(result.data);
                setEstadisticas(result.estadisticas || {});
                console.log('✅ Reporte recibido:', result.data);
            } else {
                throw new Error(result.error || 'Error en el servidor');
            }
        } catch (error) {
            console.error('❌ Error generando reporte:', error);
            setError(`Error al generar el reporte: ${error.message}`);
        } finally {
            setCargando(false);
        }
    };

    const exportarPDF = () => {
        alert('📄 Funcionalidad de exportación PDF en desarrollo...');
    };

    const exportarExcel = () => {
        alert('📊 Funcionalidad de exportación Excel en desarrollo...');
    };

    const formatearMoneda = (valor) => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(valor || 0);
    };

    const renderizarGraficoVentas = () => {
        if (!datos || !Array.isArray(datos) || datos.length === 0) {
            return (
                <div className="sin-datos-grafico">
                    <p>No hay datos de ventas para el período seleccionado</p>
                </div>
            );
        }

        return (
            <div className="grafico-container">
                <h3>📈 Ventas Mensuales</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={datos}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey={periodo === 'mensual' ? "periodo_formateado" : "periodo"} 
                        />
                        <YAxis />
                        <Tooltip 
                            formatter={(value) => [formatearMoneda(value), 'Ingresos']}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="ingresos_totales" 
                            stroke={COLOR_VENTAS} 
                            fill={COLOR_VENTAS}
                            fillOpacity={0.6}
                            name="Ingresos Totales"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderizarGraficoReservas = () => {
        if (!datos || !Array.isArray(datos) || datos.length === 0) {
            return (
                <div className="sin-datos-grafico">
                    <p>No hay datos de reservas para el período seleccionado</p>
                </div>
            );
        }

        return (
            <div className="grafico-container">
                <h3>📊 Tendencia de Reservas</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={datos}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={periodo === 'mensual' ? "periodo_formateado" : "periodo"} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="total_reservas" 
                            stroke={COLOR_RESERVAS} 
                            strokeWidth={3}
                            dot={{ fill: COLOR_RESERVAS, r: 4 }}
                            name="Total Reservas"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderizarGraficoOcupacion = () => {
        if (!datos?.ocupacionTipo || datos.ocupacionTipo.length === 0) {
            return (
                <div className="sin-datos-grafico">
                    <p>No hay datos de ocupación para el período seleccionado</p>
                </div>
            );
        }

        return (
            <div className="grafico-container">
                <h3>🏨 Ocupación por Tipo de Habitación</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={datos.ocupacionTipo}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="tipo" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => {
                            if (name === 'tasa_ocupacion') return [`${parseFloat(value || 0).toFixed(1)}%`, 'Tasa Ocupación'];
                            if (name === 'ingresos_generados') return [formatearMoneda(value), 'Ingresos'];
                            return [value, name];
                        }} />
                        <Bar dataKey="tasa_ocupacion" fill="#0088FE" name="Tasa Ocupación (%)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderizarGraficoClientes = () => {
        if (!datos?.clientesNacionalidad || datos.clientesNacionalidad.length === 0) {
            return (
                <div className="sin-datos-grafico">
                    <p>No hay datos de clientes para el período seleccionado</p>
                </div>
            );
        }

        const topNacionalidades = datos.clientesNacionalidad.slice(0, 6);

        return (
            <div className="grafico-container">
                <h3>🌎 Clientes por Nacionalidad</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={topNacionalidades}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ nacionalidad, percent }) => 
                                `${nacionalidad.substring(0, 10)}... (${(percent * 100).toFixed(1)}%)`
                            }
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="total_clientes"
                            nameKey="nacionalidad"
                        >
                            {topNacionalidades.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Clientes']} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderizarMetricas = () => {
        if (tipoReporte === 'ventas-ingresos') {
            return (
                <div className="metricas-grid">
                    <div className="metrica-card primary">
                        <div className="metrica-icon">💰</div>
                        <div className="metrica-info">
                            <div className="metrica-valor">
                                {formatearMoneda(estadisticas.ventasTotales)}
                            </div>
                            <div className="metrica-label">VENTAS TOTALES</div>
                        </div>
                    </div>

                    <div className="metrica-card success">
                        <div className="metrica-icon">📈</div>
                        <div className="metrica-info">
                            <div className="metrica-valor">
                                {estadisticas.totalReservas || 0}
                            </div>
                            <div className="metrica-label">TOTAL RESERVAS</div>
                            {estadisticas.crecimiento > 0 && (
                                <div className="metrica-tendencia positivo">
                                    +{estadisticas.crecimiento}% ↗
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="metrica-card warning">
                        <div className="metrica-icon">🎫</div>
                        <div className="metrica-info">
                            <div className="metrica-valor">
                                {formatearMoneda(estadisticas.ticketPromedio)}
                            </div>
                            <div className="metrica-label">TICKET PROMEDIO</div>
                        </div>
                    </div>
                </div>
            );
        }

        if (tipoReporte === 'ocupacion-rendimiento' && datos?.metricas) {
            return (
                <div className="metricas-grid">
                    <div className="metrica-card primary">
                        <div className="metrica-icon">🏨</div>
                        <div className="metrica-info">
                            <div className="metrica-valor">
                                {datos.metricas.tasa_ocupacion_general || 0}%
                            </div>
                            <div className="metrica-label">OCUPACIÓN GENERAL</div>
                        </div>
                    </div>

                    <div className="metrica-card success">
                        <div className="metrica-icon">📊</div>
                        <div className="metrica-info">
                            <div className="metrica-valor">
                                {datos.metricas.total_reservas || 0}
                            </div>
                            <div className="metrica-label">RESERVAS ACTIVAS</div>
                        </div>
                    </div>

                    <div className="metrica-card warning">
                        <div className="metrica-icon">⏱️</div>
                        <div className="metrica-info">
                            <div className="metrica-valor">
                                {datos.metricas.promedio_estadia ? parseFloat(datos.metricas.promedio_estadia).toFixed(1) : '0.0'}
                            </div>
                            <div className="metrica-label">ESTADÍA PROMEDIO (días)</div>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    const renderizarContenidoReporte = () => {
        if (cargando) {
            return (
                <div className="cargando-reporte">
                    <div className="loading-spinner"></div>
                    <p>Generando reporte...</p>
                    <small>Esto puede tomar unos segundos</small>
                </div>
            );
        }

        if (error) {
            return (
                <div className="error-reporte">
                    <div className="error-icon">❌</div>
                    <h3>Error al generar reporte</h3>
                    <p>{error}</p>
                    <button className="btn-reintentar" onClick={generarReporte}>
                        🔄 Reintentar
                    </button>
                </div>
            );
        }

        if (!datos) {
            return (
                <div className="sin-datos">
                    <div className="icono-sin-datos">📊</div>
                    <h3>No hay datos para mostrar</h3>
                    <p>Seleccione un rango de fechas y genere un reporte</p>
                </div>
            );
        }

        // Verificar si hay datos en el reporte actual
        const tieneDatos = 
            (tipoReporte === 'ventas-ingresos' && Array.isArray(datos) && datos.length > 0) ||
            (tipoReporte === 'ocupacion-rendimiento' && datos.ocupacionTipo && datos.ocupacionTipo.length > 0) ||
            (tipoReporte === 'clientes-fidelizacion' && datos.clientesNacionalidad && datos.clientesNacionalidad.length > 0);

        if (!tieneDatos) {
            return (
                <div className="sin-datos">
                    <div className="icono-sin-datos">📭</div>
                    <h3>No se encontraron datos</h3>
                    <p>No hay información disponible para los criterios seleccionados</p>
                </div>
            );
        }

        return (
            <div className="contenido-reporte">
                {renderizarMetricas()}
                
                <div className="graficos-grid">
                    {tipoReporte === 'ventas-ingresos' && (
                        <>
                            {renderizarGraficoVentas()}
                            {renderizarGraficoReservas()}
                        </>
                    )}
                    
                    {tipoReporte === 'ocupacion-rendimiento' && (
                        <>
                            {renderizarGraficoOcupacion()}
                        </>
                    )}
                    
                    {tipoReporte === 'clientes-fidelizacion' && (
                        <>
                            {renderizarGraficoClientes()}
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="reportes-container">
            <header className="reportes-header">
                <h1>📊 REPORTES Y GRÁFICOS</h1>
                <p>Análisis visual del rendimiento del hotel</p>
            </header>

            <div className="panel-controles">
                <div className="filtros-row">
                    <div className="filtro-group">
                        <label>Tipo de Reporte:</label>
                        <select 
                            value={tipoReporte} 
                            onChange={(e) => {
                                setTipoReporte(e.target.value);
                                setDatos(null);
                                setError('');
                            }}
                            className="select-filtro"
                        >
                            <option value="ventas-ingresos">💰 Ventas e Ingresos</option>
                            <option value="ocupacion-rendimiento">🏨 Ocupación y Rendimiento</option>
                            <option value="clientes-fidelizacion">👥 Clientes y Fidelización</option>
                        </select>
                    </div>

                    {tipoReporte === 'ventas-ingresos' && (
                        <div className="filtro-group">
                            <label>Periodo:</label>
                            <select 
                                value={periodo} 
                                onChange={(e) => setPeriodo(e.target.value)}
                                className="select-filtro"
                            >
                                <option value="diario">Diario</option>
                                <option value="semanal">Semanal</option>
                                <option value="mensual">Mensual</option>
                                <option value="anual">Anual</option>
                            </select>
                        </div>
                    )}

                    <div className="filtro-group">
                        <label>Fecha Inicio:</label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            className="input-fecha"
                        />
                    </div>

                    <div className="filtro-group">
                        <label>Fecha Fin:</label>
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            className="input-fecha"
                        />
                    </div>
                </div>

                <div className="acciones-row">
                    <button 
                        className="btn-generar"
                        onClick={generarReporte}
                        disabled={cargando || !fechaInicio || !fechaFin}
                    >
                        {cargando ? (
                            <>
                                <span className="spinner"></span>
                                ⏳ Generando...
                            </>
                        ) : (
                            '🚀 Generar Reporte'
                        )}
                    </button>
                    
                    <div className="botones-exportacion">
                        <button 
                            className="btn-exportar" 
                            onClick={exportarPDF}
                            disabled={!datos || cargando}
                        >
                            📄 Exportar PDF
                        </button>
                        <button 
                            className="btn-exportar" 
                            onClick={exportarExcel}
                            disabled={!datos || cargando}
                        >
                            📊 Exportar Excel
                        </button>
                    </div>
                </div>
            </div>

            {renderizarContenidoReporte()}
        </div>
    );
};

export default Reportes;