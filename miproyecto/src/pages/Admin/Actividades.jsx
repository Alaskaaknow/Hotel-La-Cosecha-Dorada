// pages/Admin/Actividades.jsx
import React, { useState, useEffect } from 'react';
import { actividadesService } from '../../services/actividadesService';
import './Actividades.css';

const Actividades = () => {
  const [actividades, setActividades] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    try {
      const data = await actividadesService.getActividades();
      setActividades(data);
    } catch (error) {
      console.error('Error cargando actividades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (actividad) => {
    setEditando({ ...actividad });
  };

  const handleSave = async () => {
    try {
      if (editando.id) {
        await actividadesService.updateActividad(editando.id, editando);
      } else {
        await actividadesService.createActividad(editando);
      }
      setEditando(null);
      cargarActividades();
    } catch (error) {
      alert('Error al guardar la actividad');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta actividad?')) {
      try {
        await actividadesService.deleteActividad(id);
        cargarActividades();
      } catch (error) {
        alert('Error al eliminar la actividad');
      }
    }
  };

  const handleAddNew = () => {
    setEditando({
      titulo: '',
      descripcion: '',
      imagen: '',
      activa: true,
      orden: actividades.length + 1
    });
  };

  const handleCancel = () => {
    setEditando(null);
  };

  if (loading) {
    return <div className="cargando">Cargando actividades...</div>;
  }

  return (
    <div className="admin-actividades">
      <header className="actividades-header">
        <h1>🎯 Gestión de Actividades</h1>
        <p>Administra las actividades y experiencias que se muestran en la sección "Experiencias Únicas"</p>
      </header>

      <button className="btn-agregar" onClick={handleAddNew}>
        + Agregar Nueva Actividad
      </button>

      {editando && (
        <div className="modal-edicion">
          <h3>{editando.id ? 'Editar' : 'Nueva'} Actividad</h3>
          <div className="form-group">
            <label>Título:</label>
            <input
              type="text"
              value={editando.titulo}
              onChange={(e) => setEditando({...editando, titulo: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              value={editando.descripcion}
              onChange={(e) => setEditando({...editando, descripcion: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>URL de Imagen:</label>
            <input
              type="text"
              value={editando.imagen}
              onChange={(e) => setEditando({...editando, imagen: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Orden:</label>
            <input
              type="number"
              value={editando.orden}
              onChange={(e) => setEditando({...editando, orden: parseInt(e.target.value)})}
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={editando.activa}
                onChange={(e) => setEditando({...editando, activa: e.target.checked})}
              />
              Activa
            </label>
          </div>
          <div className="acciones">
            <button className="btn-guardar" onClick={handleSave}>Guardar</button>
            <button className="btn-cancelar" onClick={handleCancel}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="lista-actividades">
        {actividades.map((actividad) => (
          <div key={actividad.id} className="actividad-item">
            <div className="actividad-imagen">
              <img 
                src={actividad.imagen} 
                alt={actividad.titulo}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100x80/5D4037/F5F5DC?text=Imagen+no+disponible';
                }}
              />
            </div>
            <div className="actividad-info">
              <h4>{actividad.titulo}</h4>
              <p>{actividad.descripcion}</p>
              <div className="actividad-metadata">
                <span>Orden: {actividad.orden}</span>
                <span className={`estado ${actividad.activa ? 'activa' : 'inactiva'}`}>
                  {actividad.activa ? '✅ Activa' : '❌ Inactiva'}
                </span>
              </div>
            </div>
            <div className="actividad-acciones">
              <button onClick={() => handleEdit(actividad)}>Editar</button>
              <button onClick={() => handleDelete(actividad.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Actividades;