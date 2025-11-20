import React, { useState } from "react";
import { FaCalendarAlt, FaUser, FaChild } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function BusquedaReservas() {
  const [entrada, setEntrada] = useState("");
  const [salida, setSalida] = useState("");
  const [adultos, setAdultos] = useState(1);
  const [ninos, setNinos] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBuscar = async () => {
    if (!entrada || !salida) {
      setError("Por favor selecciona las fechas de entrada y salida.");
      return;
    }

    // Validar que la fecha de salida sea posterior a la de entrada
    if (new Date(salida) <= new Date(entrada)) {
      setError("La fecha de salida debe ser posterior a la de entrada.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log("🔍 Buscando habitaciones...");
      
      const response = await fetch(`/api/habitaciones/disponibles`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          entrada, 
          salida, 
          adultos: parseInt(adultos), 
          ninos: parseInt(ninos) 
        }),
      });

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("El servidor no devolvió una respuesta válida");
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Error ${response.status}`);
      }

      setLoading(false);
      
      if (result.length === 0) {
        setError("No hay habitaciones disponibles para las fechas seleccionadas.");
        return;
      }

      console.log(`✅ ${result.length} habitaciones disponibles encontradas`);

      // 🔥 REDIRIGIR A LA PÁGINA DE HABITACIONES ELEGANTE
      navigate("/habitaciones-disponibles", {
        state: {
          habitaciones: result,
          datosBusqueda: { 
            entrada, 
            salida, 
            adultos, 
            ninos 
          }
        }
      });

    } catch (err) {
      console.error("❌ Error en la búsqueda:", err);
      setError(err.message || "Error al conectar con el servidor.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        padding: "20px 40px",
        borderRadius: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        flexWrap: "wrap",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      {/* 📅 Fecha de entrada */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <label style={{ fontWeight: "bold", color: "#5c2a3d", marginBottom: "5px" }}>
          <FaCalendarAlt style={{ marginRight: "5px" }} /> 
          Entrada
        </label>
        <input
          type="date"
          value={entrada}
          onChange={(e) => setEntrada(e.target.value)}
          style={{ 
            padding: "10px", 
            borderRadius: "8px", 
            border: "2px solid #e8d0d9",
            backgroundColor: "#fff",
            fontSize: "14px",
            minWidth: "140px"
          }}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* 📅 Fecha de salida */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <label style={{ fontWeight: "bold", color: "#5c2a3d", marginBottom: "5px" }}>
          <FaCalendarAlt style={{ marginRight: "5px" }} /> 
          Salida
        </label>
        <input
          type="date"
          value={salida}
          onChange={(e) => setSalida(e.target.value)}
          style={{ 
            padding: "10px", 
            borderRadius: "8px", 
            border: "2px solid #e8d0d9",
            backgroundColor: "#fff",
            fontSize: "14px",
            minWidth: "140px"
          }}
          min={entrada || new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* 👨 Adultos */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <label style={{ fontWeight: "bold", color: "#5c2a3d", marginBottom: "5px" }}>
          <FaUser style={{ marginRight: "5px" }} /> 
          Adultos
        </label>
        <input
          type="number"
          min="1"
          max="10"
          value={adultos}
          onChange={(e) => setAdultos(parseInt(e.target.value) || 1)}
          style={{ 
            padding: "10px", 
            width: "80px", 
            borderRadius: "8px", 
            border: "2px solid #e8d0d9",
            backgroundColor: "#fff",
            fontSize: "14px",
            textAlign: "center"
          }}
        />
      </div>

      {/* 👶 Niños */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <label style={{ fontWeight: "bold", color: "#5c2a3d", marginBottom: "5px" }}>
          <FaChild style={{ marginRight: "5px" }} /> 
          Niños
        </label>
        <input
          type="number"
          min="0"
          max="10"
          value={ninos}
          onChange={(e) => setNinos(parseInt(e.target.value) || 0)}
          style={{ 
            padding: "10px", 
            width: "80px", 
            borderRadius: "8px", 
            border: "2px solid #e8d0d9",
            backgroundColor: "#fff",
            fontSize: "14px",
            textAlign: "center"
          }}
        />
      </div>

      {/* 🔘 Botón de búsqueda */}
      <button
        onClick={handleBuscar}
        disabled={loading}
        style={{
          padding: "12px 30px",
          backgroundColor: loading ? "#ccc" : "#5c2a3d",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "0.3s",
          fontWeight: "bold",
          fontSize: "16px",
          marginTop: "25px",
          boxShadow: "0 4px 15px rgba(92, 42, 61, 0.3)",
        }}
        onMouseOver={(e) => {
          if (!loading) e.target.style.backgroundColor = "#472031";
        }}
        onMouseOut={(e) => {
          if (!loading) e.target.style.backgroundColor = "#5c2a3d";
        }}
      >
        {loading ? "Buscando..." : "Continuar"}
      </button>

      {/* ❗ Mensaje de error */}
      {error && (
        <div style={{ 
          color: "#d32f2f", 
          width: "100%", 
          textAlign: "center", 
          marginTop: "15px",
          padding: "10px",
          backgroundColor: "#ffebee",
          borderRadius: "8px",
          border: "1px solid #ffcdd2"
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default BusquedaReservas;