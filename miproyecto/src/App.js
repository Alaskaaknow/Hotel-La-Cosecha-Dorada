import { Routes, Route, Navigate } from "react-router-dom";
import HomeUsuario from "./pages/Usuario/HomeUsuario";
import Dashboard from "./pages/Admin/Dashboard";
import HabitacionesDisponibles from "./components/HabitacionesDisponibles";
import MisReservas from "./components/MisReservas";
import ConfirmacionReserva from "./components/ConfirmacionReserva";
import DashboardUsuario from "./components/DashboardUsuario";
import AdminLayout from "./components/AdminLayout";
import Habitaciones from "./pages/Admin/Habitaciones";
import Usuarios from "./pages/Admin/Usuarios";
import PerfilHotel from "./pages/Admin/PerfilHotel";
import Consultas from "./pages/Admin/Consultas";
import Reportes from "./pages/Admin/Reportes";
import Actividades from "./pages/Admin/Actividades";
import DashboardOperator from "./pages/Operador/DashboardOperator";
import BotonAyudaFlotante from "./components/BotonAyudaFlotante"; // ← Agregar esta importación

function App() {
  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomeUsuario />} />
        <Route path="/habitaciones-disponibles" element={<HabitacionesDisponibles />} />
        
        {/* Rutas protegidas de cliente */}
        <Route 
          path="/mis-reservas" 
          element={
            <ProtectedRoute role="cliente">
              <MisReservas />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/confirmacion-reserva" 
          element={
            <ProtectedRoute role="cliente">
              <ConfirmacionReserva />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute role="cliente">
              <DashboardUsuario />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas del Admin con Layout */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute role="administrador">
              <AdminLayout />
            </ProtectedRoute>
          } 
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="habitaciones" element={<Habitaciones />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="perfil-hotel" element={<PerfilHotel />} />
          <Route path="consultas" element={<Consultas />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="actividades" element={<Actividades />} />
          
          {/* Puedes agregar más rutas administrativas aquí */}
          <Route path="reservaciones" element={<div>Reservaciones - En desarrollo</div>} />
          <Route path="clientes" element={<div>Clientes - En desarrollo</div>} />
        </Route>

        {/* NUEVA: Ruta del Operador/Recepcionista */}
        <Route 
          path="/operator/dashboard" 
          element={
            <ProtectedRoute role="recepcionista">
              <DashboardOperator />
            </ProtectedRoute>
          } 
        />

        {/* Ruta de fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* 👇🏼 Agregar el botón flotante aquí - aparecerá en todas las páginas */}
      <BotonAyudaFlotante />
    </>
  );
}

// Componente para proteger rutas - ACTUALIZADO
function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // Verificar tanto 'role' como 'tipo'
  const userRole = user.role || user.tipo; // Algunos usuarios tienen 'role', otros 'tipo'
  
  // Verificar según el rol requerido
  if (role === 'administrador' && userRole !== 'administrador') {
    return <Navigate to="/" replace />;
  }
  
  if (role === 'cliente' && userRole !== 'cliente') {
    return <Navigate to="/" replace />;
  }
  
  // NUEVO: Verificar rol de recepcionista
  if (role === 'recepcionista' && userRole !== 'recepcionista') {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default App;