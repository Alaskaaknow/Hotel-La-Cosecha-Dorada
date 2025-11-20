import React, { useState, useEffect } from 'react';
import hotelService from '../../services/hotelService';
import './PerfilHotel.css';

const PerfilHotel = () => {
    const [hotelInfo, setHotelInfo] = useState({
        nombre_hotel: '',
        email_principal: '',
        email_secundario: '',
        telefono_principal: '',
        telefono_secundario: '',
        direccion: '',
        ubicacion_mapa: '',
        historia: '',
        horario_atencion: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadHotelInfo();
    }, []);

    const loadHotelInfo = async () => {
        try {
            const data = await hotelService.getHotelInfo();
            if (data) {
                setHotelInfo(data);
            }
        } catch (error) {
            console.error('Error al cargar información del hotel:', error);
            setMessage('Error al cargar la información del hotel');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHotelInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const result = await hotelService.updateHotelInfo(hotelInfo);
            setMessage('Información del hotel actualizada correctamente');
            // Recargar la información actualizada
            await loadHotelInfo();
        } catch (error) {
            console.error('Error al actualizar información del hotel:', error);
            setMessage('Error al actualizar la información del hotel');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="perfil-hotel">
            <h2>Perfil del Hotel</h2>
            
            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="hotel-form">
                <div className="form-section">
                    <h3>Información General</h3>
                    <div className="form-group">
                        <label>Nombre del Hotel:</label>
                        <input
                            type="text"
                            name="nombre_hotel"
                            value={hotelInfo.nombre_hotel}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Horario de Atención:</label>
                        <input
                            type="text"
                            name="horario_atencion"
                            value={hotelInfo.horario_atencion}
                            onChange={handleChange}
                            placeholder="Ej: 8:00 AM - 1:00 PM"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Información de Contacto</h3>
                    
                    <div className="form-group">
                        <label>Email Principal:</label>
                        <input
                            type="email"
                            name="email_principal"
                            value={hotelInfo.email_principal}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Secundario:</label>
                        <input
                            type="email"
                            name="email_secundario"
                            value={hotelInfo.email_secundario}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Teléfono Principal:</label>
                        <input
                            type="text"
                            name="telefono_principal"
                            value={hotelInfo.telefono_principal}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Teléfono Secundario:</label>
                        <input
                            type="text"
                            name="telefono_secundario"
                            value={hotelInfo.telefono_secundario}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Dirección:</label>
                        <textarea
                            name="direccion"
                            value={hotelInfo.direccion}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    <div className="form-group">
                        <label>Ubicación para Mapa:</label>
                        <textarea
                            name="ubicacion_mapa"
                            value={hotelInfo.ubicacion_mapa}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Dirección para mostrar en Google Maps"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Historia del Hotel</h3>
                    <div className="form-group">
                        <label>Nuestra Historia:</label>
                        <textarea
                            name="historia"
                            value={hotelInfo.historia}
                            onChange={handleChange}
                            rows="6"
                            placeholder="Cuenta la historia de tu hotel..."
                        />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </form>
        </div>
    );
};

export default PerfilHotel;