import React from "react";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import SeccionHistoria from "../../components/SeccionHistoria";
import SeccionActividades from "../../components/SeccionActividades";
import SeccionHabitaciones from "../../components/SeccionHabitaciones";
import SeccionServicios from "../../components/SeccionServicios"; 
import SeccionServiciosExtra from "../../components/SeccionServiciosExtra";
import SeccionContacto from "../../components/SeccionContacto";

function HomeUsuario() {
  return (
    <>
      <Header />
      <Hero />           
      <SeccionHistoria />
      <SeccionActividades /> 
      <SeccionHabitaciones />
      <SeccionServicios />   
      <SeccionServiciosExtra />
      <SeccionContacto/>
    </>
  );
}

export default HomeUsuario;