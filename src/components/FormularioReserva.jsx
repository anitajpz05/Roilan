import { useState } from 'react';
import './FormularioReserva.css';

export function FormularioReserva({ onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    nombreCliente: '',
    carnetIdentidad: ''
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

    if (!formData.nombreCliente || !formData.carnetIdentidad) {
      setError('Todos los campos son requeridos');
      return;
    }

    if (formData.carnetIdentidad.length < 5) {
      setError('El carnet de identidad debe tener al menos 5 caracteres');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Error al realizar la reserva');
    }
  };

  return (
    <form className="formulario-reserva" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="nombreCliente">Nombre Completo *</label>
        <input
          id="nombreCliente"
          type="text"
          name="nombreCliente"
          value={formData.nombreCliente}
          onChange={handleChange}
          disabled={loading}
          placeholder="Ej: Juan Pérez"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="carnetIdentidad">Carnet de Identidad *</label>
        <input
          id="carnetIdentidad"
          type="text"
          name="carnetIdentidad"
          value={formData.carnetIdentidad}
          onChange={handleChange}
          disabled={loading}
          placeholder="Ej: 12345678"
          required
        />
      </div>

      <button type="submit" className="btn btn-success" disabled={loading}>
        {loading ? 'Reservando...' : 'Confirmar Reserva'}
      </button>
    </form>
  );
}
