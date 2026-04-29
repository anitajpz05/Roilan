import { useState, useEffect } from 'react';
import { Tabla, Alert } from '../components';
import { useStorage, useReservas } from '../hooks';
import './ListadoReservas.css';

export function ListadoReservas() {
  const { reservas, cancelarReserva, loading } = useReservas();
  const storage = useStorage();
  const [reservasConTurnos, setReservasConTurnos] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        const todasLasReservas = await storage.getReservas();
        const turnos = await storage.getTurnos();

        const reservasFormateadas = todasLasReservas.map(reserva => ({
          ...reserva,
          turno: turnos.find(t => t.id === reserva.turnoId)
        }));

        setReservasConTurnos(reservasFormateadas);
      } catch (error) {
      }
    };

    cargarReservas();
  }, [storage, reservas]);

  const handleCancelarReserva = async (reserva) => {
    if (confirm(`¿Estás seguro de que deseas cancelar la reserva de ${reserva.nombreCliente}?`)) {
      try {
        await cancelarReserva(reserva.id);
        setAlertMessage('Reserva cancelada exitosamente');
        setAlertType('success');
        setTimeout(() => setAlertMessage(''), 3000);
      } catch (error) {
        setAlertMessage('Error al cancelar la reserva');
        setAlertType('danger');
      }
    }
  };

  const columnas = [
    {
      key: 'nombreCliente',
      label: 'Nombre Cliente'
    },
    {
      key: 'carnetIdentidad',
      label: 'Carnet Identidad'
    },
    {
      key: 'turno',
      label: 'Turno',
      render: (turno) => turno ? `${turno.fecha} ${turno.horaInicio}-${turno.horaFin}` : 'N/A'
    },
    {
      key: 'fechaReserva',
      label: 'Fecha Reserva',
      render: (valor) => new Date(valor).toLocaleDateString('es-ES')
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (estado) => (
        <span className={`estado-badge estado-${estado}`}>
          {estado}
        </span>
      )
    }
  ];

  const acciones = [
    {
      label: 'Cancelar',
      tipo: 'danger',
      onClick: (reserva) => handleCancelarReserva(reserva)
    }
  ];

  return (
    <div className="listado-reservas">
      <div className="reservas-header">
        <h2>Listado de Reservas</h2>
      </div>

      {alertMessage && (
        <Alert
          type={alertType}
          message={alertMessage}
          onClose={() => setAlertMessage('')}
        />
      )}

      <Tabla
        columnas={columnas}
        datos={reservasConTurnos}
        acciones={acciones}
      />
    </div>
  );
}
