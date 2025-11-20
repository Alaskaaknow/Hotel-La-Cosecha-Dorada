import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { FaHeart, FaRegHeart, FaUsers, FaBed, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./SeccionHabitaciones.css";

function SeccionHabitaciones() {
  const [favoritos, setFavoritos] = useState([]);
  const [habitacionesReales, setHabitacionesReales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Configuración del slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          dots: false,
        },
      },
    ],
  };

  // Cargar habitaciones reales desde tu backend
  useEffect(() => {
    const cargarHabitaciones = async () => {
      try {
        setLoading(true);
        setError("");
        console.log("🔄 Intentando cargar habitaciones...");
        
        const response = await fetch('/api/habitaciones');
        console.log("📡 Respuesta recibida:", response.status);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo conectar al servidor`);
        }
        
        const result = await response.json();
        console.log("📦 Datos recibidos:", result);
        
        if (result.success && Array.isArray(result.data)) {
          console.log(`✅ ${result.data.length} habitaciones cargadas correctamente`);
          setHabitacionesReales(result.data);
        } else {
          throw new Error("Formato de datos incorrecto del servidor");
        }
        
      } catch (error) {
        console.error("❌ Error crítico:", error.message);
        setError("No se pudo conectar al servidor. El backend no está respondiendo.");
        
        // Datos de emergencia con los nombres CORRECTOS de tus imágenes
        setHabitacionesReales([
          {
            id: 1,
            nombre: "Suite Deluxe",
            tipo: "suite",
            descripcion: "Habitación amplia con jacuzzi y vista al viñedo.",
            capacidad: 2,
            precio: 258,
            imagen: "suitel.jpg", // ← CORREGIDO: suitel.jpg en lugar de suite1.jpg
            estado: "disponible",
            numero: "101"
          },
          {
            id: 2,
            nombre: "Habitación Doble",
            tipo: "doble", 
            descripcion: "Con dos camas individuales y balcón privado.",
            capacidad: 2,
            precio: 180,
            imagen: "doble1.jpg", // ← Esta imagen SÍ existe
            estado: "disponible",
            numero: "102"
          },
          {
            id: 3,
            nombre: "Habitación Familiar",
            tipo: "familiar",
            descripcion: "Perfecta para familias con niños.",
            capacidad: 4,
            precio: 300,
            imagen: "familiar1.jpg", // ← Esta imagen SÍ existe
            estado: "disponible", 
            numero: "103"
          },
          {
            id: 4,
            nombre: "Habitación Simple", 
            tipo: "simple",
            descripcion: "Ideal para una persona, cómoda y económica.",
            capacidad: 1,
            precio: 120,
            imagen: "simple1.jpg", // ← Esta imagen SÍ existe
            estado: "disponible",
            numero: "104"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    cargarHabitaciones();
  }, []);

  const toggleFavorito = (id) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleReservar = (habitacion) => {
    console.log("📍 Redirigiendo a reserva de:", habitacion.nombre);
    navigate("/");
    
    setTimeout(() => {
      alert(`Para reservar la ${habitacion.nombre}, por favor completa el formulario de búsqueda con tus fechas preferidas.`);
    }, 500);
  };

  // Función MEJORADA para obtener imágenes - usa tus imágenes reales
  const obtenerImagen = (habitacion) => {
    // Si no hay imagen definida en la base de datos
    if (!habitacion.imagen || habitacion.imagen === "") {
      // Asignar imágenes por defecto según el tipo
      const imagenesPorTipo = {
        'suite': 'suitel.jpg',
        'doble': 'doble1.jpg', 
        'familiar': 'familiar1.jpg',
        'simple': 'simple1.jpg'
      };
      return `/images/${imagenesPorTipo[habitacion.tipo] || 'suitel.jpg'}`;
    }
    
    // Si la imagen empieza con http, es una URL externa
    if (habitacion.imagen.startsWith('http')) {
      return habitacion.imagen;
    }
    
    // Si es una ruta local, asegurar que empiece con /images/
    if (!habitacion.imagen.startsWith('/images/')) {
      return `/images/${habitacion.imagen}`;
    }
    
    return habitacion.imagen;
  };

  return (
    <section id="habitaciones" className="habitaciones-section">
      <div className="container">
        <h2 className="titulo-seccion">Nuestras Habitaciones</h2>
        <p className="subtitulo-seccion">
          Descubre el confort y elegancia de nuestras exclusivas habitaciones
        </p>
        
        {/* Mensaje de error SIEMPRE visible si hay error */}
        {error && (
          <div style={{
            background: '#ffebee',
            border: '1px solid #f44336',
            borderRadius: '8px',
            padding: '15px',
            margin: '20px 0',
            textAlign: 'center'
          }}>
            <FaExclamationTriangle style={{color: '#f44336', marginRight: '10px'}} />
            <strong>Error de conexión:</strong> {error}
          </div>
        )}

        {/* Habitaciones - SIEMPRE muestralas */}
        {habitacionesReales.length > 0 && (
          <div className="carousel-container">
            <Slider {...settings}>
              {habitacionesReales.map((habitacion) => (
                <div key={habitacion.id} className="habitacion-card">
                  <div className="imagen-container">
                    <img
                      src={obtenerImagen(habitacion)}
                      alt={habitacion.nombre}
                      className="habitacion-img"
                      onError={(e) => {
                        console.log(`❌ Imagen no encontrada: ${habitacion.imagen}`);
                        // Si falla la imagen específica, usar una genérica que SÍ existe
                        const imagenFallback = habitacion.tipo === 'suite' ? '/images/suitel.jpg' : '/images/doble1.jpg';
                        e.target.src = imagenFallback;
                      }}
                    />
                    <button
                      className="icono-corazon"
                      onClick={() => toggleFavorito(habitacion.id)}
                    >
                      {favoritos.includes(habitacion.id) ? (
                        <FaHeart className="lleno" />
                      ) : (
                        <FaRegHeart className="vacio" />
                      )}
                    </button>
                    <div className="badge-tipo">
                      {habitacion.tipo?.toUpperCase() || 'STANDARD'}
                    </div>
                  </div>
                  
                  <div className="info-habitacion">
                    <h3 className="nombre-habitacion">{habitacion.nombre}</h3>
                    <p className="descripcion-corta">{habitacion.descripcion}</p>
                    
                    <div className="detalles-habitacion">
                      <div className="detalle">
                        <FaUsers />
                        <span>{habitacion.capacidad} persona{habitacion.capacidad > 1 ? 's' : ''}</span>
                      </div>
                      <div className="detalle">
                        <FaBed />
                        <span>{habitacion.tipo?.charAt(0).toUpperCase() + habitacion.tipo?.slice(1) || 'Standard'}</span>
                      </div>
                    </div>
                    
                    <div className="precio-reserva">
                      <div className="precio">
                        <span className="precio-numero">${habitacion.precio}</span>
                        <span className="precio-texto">/noche</span>
                      </div>
                      <button 
                        className="boton-reserva"
                        onClick={() => handleReservar(habitacion)}
                      >
                        Reservar
                      </button>
                    </div>
                    
                    {habitacion.numero && (
                      <div className="numero-habitacion">
                        Habitación #{habitacion.numero}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{textAlign: 'center', padding: '40px'}}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #5c2a3d',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
            <p>Cargando habitaciones...</p>
          </div>
        )}

        {/* Información adicional */}
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '15px',
          background: '#f8f4e9',
          borderRadius: '8px'
        }}>
          <p>
            💡 <strong>Nota:</strong> Todas nuestras habitaciones incluyen desayuno buffet, 
            WiFi gratuito y acceso a nuestras instalaciones del viñedo.
          </p>
        </div>
      </div>

      {/* Agregar los estilos de animación */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}

export default SeccionHabitaciones;