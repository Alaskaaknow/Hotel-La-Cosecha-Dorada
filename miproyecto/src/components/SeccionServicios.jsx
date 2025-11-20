import React from 'react';
import { 
  FiWifi, 
  FiCoffee, 
  FiMapPin, 
  FiHeart, 
  FiDroplet, 
  FiActivity 
} from 'react-icons/fi';
import './SeccionServicios.css';

const SeccionServicios = () => {
  const servicios = [
    {
      id: 1,
      titulo: "WiFi de Alta Velocidad",
      descripcion: "Conexión a internet de alta velocidad en todas las instalaciones.",
      icono: <FiWifi />
    },
    {
      id: 2,
      titulo: "Restaurante y Bar",
      descripcion: "Gastronomía local y los mejores vinos en ambiente acogedor.",
      icono: <FiCoffee />
    },
    {
      id: 3,
      titulo: "Estacionamiento",
      descripcion: "Amplio estacionamiento privado y seguro para tu comodidad.",
      icono: <FiMapPin />
    },
    {
      id: 4,
      titulo: "Centro de Spa",
      descripcion: "Tratamientos de spa y masajes terapéuticos para tu relajación.",
      icono: <FiHeart />
    },
    {
      id: 5,
      titulo: "Piscina",
      descripcion: "Piscina al aire libre con vistas panorámicas a los viñedos.",
      icono: <FiDroplet />
    },
    {
      id: 6,
      titulo: "Centro de Fitness",
      descripcion: "Gimnasio totalmente equipado para mantener tu rutina.",
      icono: <FiActivity />
    }
  ];

  return (
    <section id="servicios" className="seccion-servicios">
      <div className="container">
        <div className="servicios-header">
          <h2 style={{ lineHeight: "1.8", fontWeight: "bold" }}>Instalaciones y Servicios</h2>
          <p>Disfruta de nuestras exclusivas instalaciones y servicios de primera calidad</p>
        </div>
        
        <div className="servicios-grid">
          {servicios.map(servicio => (
            <div key={servicio.id} className="servicio-card">
              <div className="servicio-icon">{servicio.icono}</div>
              <div className="servicio-content">
                <h3>{servicio.titulo}</h3>
                <p>{servicio.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeccionServicios;