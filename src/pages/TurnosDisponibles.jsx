import { useState, useEffect } from 'react';
import { Modal, FormularioReserva, Alert } from '../components';
import { useTurnos, useReservas } from '../hooks';
import './TurnosDisponibles.css';
import { Link } from 'react-router-dom';

export function TurnosDisponibles() {
  const { turnos } = useTurnos();
  const { crearReserva, loading, error: reservaError } = useReservas();
  const [modalOpen, setModalOpen] = useState(false);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [reservaRealizada, setReservaRealizada] = useState(false);
  const [turnosConCupo, setTurnosConCupo] = useState([]);

  const handleReservaTurno = (turno) => {
    setTurnoSeleccionado(turno);
    setModalOpen(true);
  };

  const handleConfirmarReserva = async (datosReserva) => {
    try {
      await crearReserva({
        turnoId: turnoSeleccionado.id,
        nombreCliente: datosReserva.nombreCliente,
        carnetIdentidad: datosReserva.carnetIdentidad
      });
      setReservaRealizada(true);
      setModalOpen(false);
      setTurnoSeleccionado(null);
      setTimeout(() => setReservaRealizada(false), 3000);
    } catch (error) {
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="turnos-disponibles">
      {reservaRealizada && (
        <Alert
          type="success"
          message="¡Reserva realizada exitosamente!"
          onClose={() => setReservaRealizada(false)}
        />
      )}

      <div className="turnos-header">
        <h2>Turnos Disponibles</h2>
        <Link to="/login" className="btn btn-primary" style={{ marginLeft: 'auto' }}>
          Área de Administrador
        </Link>
      </div>

      {turnos && turnos.length > 0 ? (
        <div className="turnos-grid">
          {turnos
            .filter(turno => turno.estado === 'activo')
            .map((turno) => {
              return (
                <div key={turno.id} className="turno-card">
                  <div className="turno-fecha">
                    <strong>{formatearFecha(turno.fecha)}</strong>
                  </div>
                  <div className="turno-horario">
                    <span>🕐 {turno.horaInicio} - {turno.horaFin}</span>
                  </div>
                  <div className="turno-cupo">
                    <span>Capacidad: {turno.capacidadMaxima}</span>
                  </div>
                  <button
                    className="btn btn-success"
                    onClick={() => handleReservaTurno(turno)}
                    style={{ width: '100%', marginTop: 'auto' }}
                  >
                    Reservar Turno
                  </button>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="sin-turnos">
          <p>No hay turnos disponibles en este momento</p>
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          turnoSeleccionado
            ? `Reservar Turno - ${turnoSeleccionado.horaInicio} a ${turnoSeleccionado.horaFin}`
            : 'Reservar Turno'
        }
      >
        {reservaError && <Alert type="danger" message={reservaError} />}
        <FormularioReserva
          onSubmit={handleConfirmarReserva}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
