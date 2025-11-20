import React, { useState, useEffect } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import hotelService from '../services/hotelService';
import './SeccionContacto.css';

const SeccionContacto = () => {
  const [hotelInfo, setHotelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotelInfo();
  }, []);

  const loadHotelInfo = async () => {
    try {
      const data = await hotelService.getHotelInfo();
      setHotelInfo(data);
    } catch (error) {
      console.error('Error al cargar información del hotel:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="seccion-contacto">
        <div className="container">
          <div className="loading">Cargando información de contacto...</div>
        </div>
      </section>
    );
  }

  if (!hotelInfo) {
    return (
      <section className="seccion-contacto">
        <div className="container">
          <div className="error">No se pudo cargar la información de contacto</div>
        </div>
      </section>
    );
  }

  return (
    <section className="seccion-contacto">
      <div className="container">
        {/* Información de Contacto Compacta */}
        <div id="ubicacion" className="contacto-info-section">
          <div className="contacto-header">
            <h2 style={{ lineHeight: "1.8", fontWeight: "bold" }}>Reservas y Contacto</h2>
            <div className="horario-info">
              <FiClock className="horario-icon" />
              <span>Horario: {hotelInfo.horario_atencion || '8:00 AM - 10:00 PM'}</span>
            </div>
          </div>
          
          <div className="contacto-info-grid">
            <div className="contacto-item">
              <div className="contacto-icon">
                <FiMail />
              </div>
              <div className="contacto-content">
                <h3>Email</h3>
                <p>{hotelInfo.email_principal || 'reservas@lacosechadorada.com'}</p>
                <p>{hotelInfo.email_secundario || 'info@lacosechadorada.com'}</p>
              </div>
            </div>
            
            <div className="contacto-item">
              <div className="contacto-icon">
                <FiPhone />
              </div>
              <div className="contacto-content">
                <h3>Teléfono</h3>
                <p>{hotelInfo.telefono_principal || '+54 261 123 4567'}</p>
                <p>{hotelInfo.telefono_secundario || '+54 261 987 6543'}</p>
              </div>
            </div>
            
            <div className="contacto-item">
              <div className="contacto-icon">
                <FiMapPin />
              </div>
              <div className="contacto-content">
                <h3>Dirección</h3>
                <p>{hotelInfo.direccion || 'Av. de Acceso Este 1360, M5519'}</p>
                <p>{hotelInfo.ubicacion_mapa ? hotelInfo.ubicacion_mapa.split(', ')[1] : 'Mendoza, Argentina'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa Compacto */}
        <div className="mapa-section">
          <div className="mapa-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3350.448238909925!2d-68.81654192426628!3d-32.883171073632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x967e091ed0dd3f3f%3A0xe259b57c8c2c7f1c!2sAv.%20de%20Acceso%20Este%201360%2C%20M5519%20Mendoza!5e0!3m2!1ses!2sar!4v1699999999999!5m2!1ses!2sar"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '10px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de La Cosecha Dorada en Mendoza"
            ></iframe>
          </div>
          <div className="mapa-info">
            <h3>Nuestra Ubicación</h3>
            <p>{hotelInfo.ubicacion_mapa || 'Av. de Acceso Este 1360, M5519 Mendoza, Argentina'}</p>
            <a 
              href={`https://maps.google.com/?q=${encodeURIComponent(hotelInfo.ubicacion_mapa || 'Av. de Acceso Este 1360, M5519 Mendoza, Argentina')}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-mapa"
            >
              Ver en Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeccionContacto;