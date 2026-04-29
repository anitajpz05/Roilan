import { useState, useCallback } from 'react';
import { useStorage } from './useStorage';

export function useTurnos() {
  const storage = useStorage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validarSolapamiento = useCallback(async (fecha, horaInicio, horaFin, excludeTurnoId = null) => {
    const turnos = await storage.getTurnos();
    
    const turnoEnLaFecha = turnos.filter(t => {
      if (excludeTurnoId && t.id === excludeTurnoId) return false;
      if (t.fecha !== fecha) return false;
      return true;
    });

    for (const turno of turnoEnLaFecha) {
      const inicio1 = parseInt(horaInicio.replace(':', ''));
      const fin1 = parseInt(horaFin.replace(':', ''));
      const inicio2 = parseInt(turno.horaInicio.replace(':', ''));
      const fin2 = parseInt(turno.horaFin.replace(':', ''));

      if (!(fin1 <= inicio2 || fin2 <= inicio1)) {
        return false;
      }
    }

    return true;
  }, [storage]);

  const calcularCupoDisponible = useCallback(async (turnoId) => {
    const turno = await storage.getTurnoById(turnoId);
    if (!turno) return 0;

    const reservas = await storage.getReservasByTurnoId(turnoId);
    const reservasConfirmadas = reservas.filter(r => r.estado === 'confirmada').length;

    return turno.capacidadMaxima - reservasConfirmadas;
  }, [storage]);

  const crearTurno = useCallback(async (datosTurno) => {
    setLoading(true);
    setError(null);
    try {
      const { fecha, horaInicio, horaFin, capacidadMaxima } = datosTurno;

      const noHaySolapamiento = await validarSolapamiento(fecha, horaInicio, horaFin);
      if (!noHaySolapamiento) {
        throw new Error('Ya existe un turno en este horario');
      }

      const nuevoTurno = {
        fecha,
        horaInicio,
        horaFin,
        capacidadMaxima,
        estado: 'activo'
      };

      const id = await storage.addTurno(nuevoTurno);
      return { ...nuevoTurno, id };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [storage, validarSolapamiento]);

  const actualizarTurno = useCallback(async (id, datosTurno) => {
    setLoading(true);
    setError(null);
    try {
      const { fecha, horaInicio, horaFin, capacidadMaxima, estado } = datosTurno;

      const noHaySolapimiento = await validarSolapamiento(fecha, horaInicio, horaFin, id);
      if (!noHaySolapamiento) {
        throw new Error('Ya existe un turno en este horario');
      }

      const turnoActualizado = {
        fecha,
        horaInicio,
        horaFin,
        capacidadMaxima,
        estado
      };

      await storage.updateTurno(id, turnoActualizado);
      return { ...turnoActualizado, id };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [storage, validarSolapamiento]);

  const eliminarTurno = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await storage.deleteTurno(id);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [storage]);

  return {
    turnos: storage.turnos,
    loading,
    error,
    crearTurno,
    actualizarTurno,
    eliminarTurno,
    calcularCupoDisponible,
    validarSolapamiento
  };
}
