import { useState } from 'react';
import './FormularioTurno.css';

export function FormularioTurno({ onSubmit, turnoInicial = null, loading = false }) {
  const [formData, setFormData] = useState(turnoInicial || {
    fecha: '',
    horaInicio: '',
    horaFin: '',
    capacidadMaxima: '',
    estado: 'activo'
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fecha || !formData.horaInicio || !formData.horaFin || !formData.capacidadMaxima) {
      setError('Todos los campos son requeridos');
      return;
    }

    if (formData.horaInicio >= formData.horaFin) {
      setError('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }

    if (parseInt(formData.capacidadMaxima) <= 0) {
      setError('La capacidad debe ser mayor a 0');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Error al guardar el turno');
    }
  };

  return (
    <form className="formulario-turno" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="fecha">Fecha *</label>
        <input
          id="fecha"
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          disabled={loading}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="horaInicio">Hora Inicio (HH:MM) *</label>
          <input
            id="horaInicio"
            type="time"
            name="horaInicio"
            value={formData.horaInicio}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="horaFin">Hora Fin (HH:MM) *</label>
          <input
            id="horaFin"
            type="time"
            name="horaFin"
            value={formData.horaFin}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="capacidadMaxima">Capacidad Máxima *</label>
          <input
            id="capacidadMaxima"
            type="number"
            name="capacidadMaxima"
            value={formData.capacidadMaxima}
            onChange={handleChange}
            disabled={loading}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado *</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            disabled={loading}
            required
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar Turno'}
      </button>
    </form>
  );
}
