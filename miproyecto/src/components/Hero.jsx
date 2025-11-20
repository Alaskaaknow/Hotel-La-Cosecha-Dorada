import React from "react";
import BusquedaReservas from "./BusquedaReservas";

function Hero() {
  return (
    <section
      id="principal"
      style={{
        height: "100vh",
        backgroundImage: "url('/images/fondo01.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        textAlign: "center",
        textShadow: "2px 2px 6px rgba(0,0,0,0.6)",
        padding: "0 20px",
      }}
    >
      <h1 style={{ fontSize: "4rem", margin: 0 }}>La Cosecha Dorada</h1>
      <p style={{ fontSize: "1.5rem", marginTop: "10px", marginBottom: "40px" }}>
        El arte de celebrar la tierra
      </p>

      {/* Buscador horizontal debajo del texto */}
      <div style={{ width: "90%", maxWidth: "1000px" }}>
        <BusquedaReservas />
      </div>
    </section>
  );
}

export default Hero;
