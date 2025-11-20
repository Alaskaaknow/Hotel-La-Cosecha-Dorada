import React from 'react';
import './SeccionServiciosExtra.css';

const SeccionServiciosExtra = () => {
  const serviciosExtra = [
    {
      id: 1,
      titulo: "Reserva de Tours",
      descripcion: "Disfruta de tours guiados por los viñedos y sus alrededores con expertos locales.",
      imagen: "/images/extra1.jpg"
    },
    {
      id: 2,
      titulo: "Traslados al Aeropuerto",
      descripcion: "Servicio de traslado privado desde y hacia el aeropuerto para tu mayor comodidad.",
      imagen: "/images/extra2.jpg"
    },
    {
      id: 3,
      titulo: "Reserva de Actividades",
      descripcion: "Organizamos actividades exclusivas y experiencias personalizadas para tu estadía.",
      imagen: "/images/extra3.jpg"
    }
  ];

  return (
    <section id="extras" className="seccion-servicios-extra">
      <div className="container">
        <div className="servicios-extra-header">
          <h2 style={{ lineHeight: "1.8", fontWeight: "bold" }}>Servicios Extras</h2>
          <p>Ofrecemos servicios adicionales para hacer tu estadía aún más especial y memorable.</p>
        </div>
        
        <div className="servicios-extra-grid">
          {serviciosExtra.map(servicio => (
            <div key={servicio.id} className="servicio-extra-card">
              <div className="servicio-extra-imagen">
                <img 
                  src={servicio.imagen} 
                  alt={servicio.titulo}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x250/722F37/FFFFFF?text=${encodeURIComponent(servicio.titulo)}`;
                  }}
                />
              </div>
              <div className="servicio-extra-content">
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

export default SeccionServiciosExtra;