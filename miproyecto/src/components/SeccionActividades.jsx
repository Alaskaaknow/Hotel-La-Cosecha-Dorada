import React, { useState, useEffect } from 'react';
import './SeccionActividades.css';
import { actividadesService } from '../services/actividadesService';

const SeccionActividades = () => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    try {
      const data = await actividadesService.getActividades();
      setActividades(data);
    } catch (error) {
      console.error('Error cargando actividades:', error);
      // Datos por defecto en caso de error
      setActividades([
        {
          id: 1,
          titulo: "Paseos a Caballo",
          descripcion: "Recorridos guiados por nuestros viñedos al atardecer",
          imagen: "/images/actividad1.jpg",
          activa: true
        },
        {
          id: 2,
          titulo: "Cenas Gourmet",
          descripcion: "Experiencias culinarias con productos locales y nuestros vinos",
          imagen: "/images/actividad2.jpg",
          activa: true
        },
        {
          id: 3,
          titulo: "Catas de Vino",
          descripcion: "Degustación de nuestras reservas exclusivas en la bodega",
          imagen: "/images/actividad3.jpg",
          activa: true
        },
        {
          id: 4,
          titulo: "Noches de Baile",
          descripcion: "Veladas con música en vivo y danzas tradicionales",
          imagen: "/images/actividad4.jpg",
          activa: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (actividadId) => {
    setImageErrors(prev => ({
      ...prev,
      [actividadId]: true
    }));
  };

  const getImageSource = (actividad) => {
    if (imageErrors[actividad.id]) {
      return `https://via.placeholder.com/400x300/722F37/FFFFFF?text=${encodeURIComponent(actividad.titulo)}`;
    }

    if (actividad.imagen?.startsWith('http')) {
      return actividad.imagen;
    }

    if (actividad.imagen && !actividad.imagen.startsWith('/')) {
      return `/${actividad.imagen}`;
    }

    return actividad.imagen;
  };

  if (loading) {
    return (
      <section id="act" className="seccion-actividades">
        <div className="container">
          <div className="cargando">
            <div className="loading-spinner"></div>
            <p>Cargando experiencias únicas...</p>
          </div>
        </div>
      </section>
    );
  }

  const actividadesActivas = actividades.filter(act => act.activa);

  if (actividadesActivas.length === 0) {
    return (
      <section className="seccion-actividades">
        <div className="container">
          <div className="sin-actividades">
            <h2>Próximamente nuevas experiencias</h2>
            <p>Estamos preparando actividades especiales para tu estadía.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="seccion-actividades">
      <div className="container">
        <div className="actividades-header">
          <h2 style={{ lineHeight: "1.8", fontWeight: "bold" }}>Vive Experiencias Únicas</h2>
          <p>Disfruta de momentos inolvidables en medio de la belleza natural de Los Ariaza</p>
        </div>

        <div className="actividades-grid">
          {actividadesActivas.map((actividad, index) => (
            <div key={actividad.id} className="actividad-card">
              <div className="actividad-imagen">
                <img
                  src={getImageSource(actividad)}
                  alt={actividad.titulo}
                  onError={() => handleImageError(actividad.id)}
                  loading="lazy"
                />
                <div className="actividad-numero">{index + 1}</div>
              </div>
              <div className="actividad-content">
                <h3>{actividad.titulo}</h3>
                <p>{actividad.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeccionActividades;