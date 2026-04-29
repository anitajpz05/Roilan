import { useState, useCallback, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

export function useStorage() {
  const turnos = useLiveQuery(() => db.turnos.toArray(), [], []);
  const reservas = useLiveQuery(() => db.reservas.toArray(), [], []);
  const usuarios = useLiveQuery(() => db.usuarios.toArray(), [], []);

  const getTurnos = useCallback(async () => {
    return await db.turnos.toArray();
  }, []);

  const getTurnoById = useCallback(async (id) => {
    return await db.turnos.get(id);
  }, []);

  const addTurno = useCallback(async (turno) => {
    return await db.turnos.add(turno);
  }, []);

  const updateTurno = useCallback(async (id, turno) => {
    return await db.turnos.update(id, turno);
  }, []);

  const deleteTurno = useCallback(async (id) => {
    await db.reservas.where('turnoId').equals(id).delete();
    return await db.turnos.delete(id);
  }, []);

  const getReservas = useCallback(async () => {
    return await db.reservas.toArray();
  }, []);

  const getReservasByTurnoId = useCallback(async (turnoId) => {
    return await db.reservas.where('turnoId').equals(turnoId).toArray();
  }, []);

  const addReserva = useCallback(async (reserva) => {
    return await db.reservas.add(reserva);
  }, []);

  const cancelReserva = useCallback(async (id) => {
    return await db.reservas.update(id, { estado: 'cancelada' });
  }, []);

  const getUsuarioByEmail = useCallback(async (email) => {
    return await db.usuarios.where('email').equals(email).first();
  }, []);

  return {
    turnos,
    reservas,
    usuarios,
    getTurnos,
    getTurnoById,
    addTurno,
    updateTurno,
    deleteTurno,
    getReservas,
    getReservasByTurnoId,
    addReserva,
    cancelReserva,
    getUsuarioByEmail
  };
}
