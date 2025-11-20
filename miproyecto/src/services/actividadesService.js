const API_URL = 'http://localhost:5001/api';

export const actividadesService = {
  // Obtener todas las actividades
  getActividades: async () => {
    try {
      console.log("🔗 Conectando al backend en puerto 5001...");
      const response = await fetch(`${API_URL}/actividades`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Dependiendo de la estructura de la respuesta, puede ser result.data o result
      const actividades = result.data || result;
      
      console.log("✅ Actividades cargadas desde backend:", actividades);
      return actividades;
    } catch (error) {
      console.error('❌ Error conectando al backend, usando datos locales:', error);
      // Datos de respaldo con imágenes locales
      return [
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
      ];
    }
  },

  // Obtener actividades activas (para frontend público)
  getActividadesActivas: async () => {
    try {
      const response = await fetch(`${API_URL}/actividades/activas`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error obteniendo actividades activas:', error);
      // Si falla, usar getActividades y filtrar
      const todasActividades = await actividadesService.getActividades();
      return todasActividades.filter(act => act.activa);
    }
  },

  // Actualizar una actividad
  updateActividad: async (id, actividadData) => {
    try {
      const response = await fetch(`${API_URL}/actividades/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actividadData)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error actualizando actividad:', error);
      throw error;
    }
  },

  // Crear nueva actividad
  createActividad: async (actividadData) => {
    try {
      const response = await fetch(`${API_URL}/actividades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actividadData)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creando actividad:', error);
      throw error;
    }
  },

  // Eliminar actividad
  deleteActividad: async (id) => {
    try {
      const response = await fetch(`${API_URL}/actividades/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error eliminando actividad:', error);
      throw error;
    }
  },

  // Obtener actividad por ID
  getActividadById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/actividades/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error obteniendo actividad por ID:', error);
      throw error;
    }
  }
};