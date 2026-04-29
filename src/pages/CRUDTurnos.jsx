import { useState, useEffect } from 'react';
import { Modal, FormularioTurno, Tabla, Alert } from '../components';
import { useTurnos } from '../hooks';
import './CRUDTurnos.css';

export function CRUDTurnos() {
  const { turnos, crearTurno, actualizarTurno, eliminarTurno, loading, error } = useTurnos();
  const [modalOpen, setModalOpen] = useState(false);
  const [turnoEnEdicion, setTurnoEnEdicion] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  const handleAbrirModal = (turno = null) => {
    setTurnoEnEdicion(turno);
    setModalOpen(true);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setTurnoEnEdicion(null);
  };

  const handleGuardarTurno = async (datosTurno) => {
    try {
      if (turnoEnEdicion) {
        await actualizarTurno(turnoEnEdicion.id, datosTurno);
        setAlertMessage('Turno actualizado exitosamente');
      } else {
        await crearTurno(datosTurno);
        setAlertMessage('Turno creado exitosamente');
      }
      setAlertType('success');
      handleCerrarModal();
      setTimeout(() => setAlertMessage(''), 3000);
    } catch (err) {
      setAlertMessage(err.message || 'Error al guardar el turno');
      setAlertType('danger');
    }
  };

  const handleEliminarTurno = async (turno) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el turno de ${turno.horaInicio}?`)) {
      try {
        await eliminarTurno(turno.id);
        setAlertMessage('Turno eliminado exitosamente');
        setAlertType('success');
        setTimeout(() => setAlertMessage(''), 3000);
      } catch (err) {
        setAlertMessage('Error al eliminar el turno');
        setAlertType('danger');
      }
    }
  };

  const columnas = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value) => new Date(value).toLocaleDateString('es-ES')
    },
    {
      key: 'horaInicio',
      label: 'Hora Inicio'
    },
    {
      key: 'horaFin',
      label: 'Hora Fin'
    },
    {
      key: 'capacidadMaxima',
      label: 'Capacidad'
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value) => (
        <span className={`estado-badge estado-${value}`}>
          {value}
        </span>
      )
    }
  ];

  const acciones = [
    {
      label: 'Editar',
      tipo: 'secondary',
      onClick: (turno) => handleAbrirModal(turno)
    },
    {
      label: 'Eliminar',
      tipo: 'danger',
      onClick: (turno) => handleEliminarTurno(turno)
    }
  ];

  return (
    <div className="crud-turnos">
      <div className="crud-header">
        <h2>Gestión de Turnos</h2>
        <button className="btn btn-success" onClick={() => handleAbrirModal()}>
          + Nuevo Turno
        </button>
      </div>

      {(alertMessage || error) && (
        <Alert
          type={alertType}
          message={alertMessage || error}
          onClose={() => setAlertMessage('')}
        />
      )}

      <Tabla
        columnas={columnas}
        datos={turnos || []}
        acciones={acciones}
      />

      <Modal
        isOpen={modalOpen}
        onClose={handleCerrarModal}
        title={turnoEnEdicion ? 'Editar Turno' : 'Crear Nuevo Turno'}
      >
        <FormularioTurno
          onSubmit={handleGuardarTurno}
          turnoInicial={turnoEnEdicion}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
