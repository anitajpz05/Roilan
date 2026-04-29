import { useState, useCallback } from 'react';
import { useStorage } from './useStorage';

export function useReservas() {
  const storage = useStorage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const crearReserva = useCallback(async (datosReserva) => {
    setLoading(true);
    setError(null);
    try {
      const { turnoId, nombreCliente, carnetIdentidad } = datosReserva;

      // Obtener el turno
      const turno = await storage.getTurnoById(turnoId);
      if (!turno) {
        throw new Error('Turno no encontrado');
      }

      // Obtener las reservas confirmadas del turno
      const reservas = await storage.getReservasByTurnoId(turnoId);
      const reservasConfirmadas = reservas.filter(r => r.estado === 'confirmada').length;

      // Verificar disponibilidad
      if (reservasConfirmadas >= turno.capacidadMaxima) {
        throw new Error('No hay cupo disponible para este turno');
      }

      const nuevaReserva = {
        turnoId,
        nombreCliente,
        carnetIdentidad,
        fechaReserva: new Date().toISOString(),
        estado: 'confirmada'
      };

      const id = await storage.addReserva(nuevaReserva);
      return { ...nuevaReserva, id };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [storage]);

  const cancelarReserva = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await storage.cancelReserva(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [storage]);

  const obtenerReservasConTurnos = useCallback(async () => {
    try {
      const reservas = await storage.getReservas();
      const turnos = await storage.getTurnos();

      return reservas.map(reserva => ({
        ...reserva,
        turno: turnos.find(t => t.id === reserva.turnoId)
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [storage]);

  return {
    reservas: storage.reservas,
    loading,
    error,
    crearReserva,
    cancelarReserva,
    obtenerReservasConTurnos
  };
}
