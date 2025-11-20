import React, { useState, useEffect } from "react";
import hotelService from "../services/hotelService";

function SeccionHistoria() {
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
      console.error('Error al cargar historia del hotel:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section
        id="historia"
        style={{
          backgroundColor: "#f5f0e6",
          padding: "80px 20px",
          textAlign: "center",
          color: "#4b1f2f",
        }}
      >
        <div>Cargando historia del hotel...</div>
      </section>
    );
  }

  if (!hotelInfo) {
    return (
      <section
        id="historia"
        style={{
          backgroundColor: "#f5f0e6",
          padding: "80px 20px",
          textAlign: "center",
          color: "#4b1f2f",
        }}
      >
        <div>No se pudo cargar la historia del hotel</div>
      </section>
    );
  }

  return (
    <section
      id="historia"
      style={{
        backgroundColor: "#F6F2EE", // Beige suave
        padding: "80px 20px",
        textAlign: "center",
        color: "#4b1f2f", // Bordó elegante
      }}
    >
      <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
        Desde nuestras raíces
      </h2>
      <p style={{ maxWidth: "800px", margin: "0 auto", fontSize: "1.2rem", lineHeight: "1.8" }}>
        {hotelInfo.historia || "Nacimos entre viñedos, donde el sol acaricia las uvas y el tiempo se detiene. Lo que inició como un pequeño sueño familiar, se convirtió en un refugio de calma, donde cada visita es una celebración de la tierra, el vino y la calidez."}
      </p>
    </section>
  );
}

export default SeccionHistoria;