import Dexie from 'dexie';

export const db = new Dexie('ShiftsManagementDB');

db.version(1).stores({
  turnos: '++id, fecha, estado',
  reservas: '++id, turnoId, estado, nombreCliente',
  usuarios: '++id, email'
});

export async function initializeDatabase() {
  const usuariosCount = await db.usuarios.count();
  
  if (usuariosCount === 0) {
    await db.usuarios.add({
      email: 'admin@example.com',
      password: 'admin123'
    });
  }

  const turnosCount = await db.turnos.count();
  if (turnosCount === 0) {
    const today = new Date();
    const turnos = [];
    
    for (let i = 0; i < 5; i++) {
      const fecha = new Date(today);
      fecha.setDate(fecha.getDate() + i);
      
      turnos.push({
        fecha: fecha.toISOString().split('T')[0],
        horaInicio: '09:00',
        horaFin: '10:00',
        capacidadMaxima: 5,
        estado: 'activo'
      });
      
      turnos.push({
        fecha: fecha.toISOString().split('T')[0],
        horaInicio: '10:30',
        horaFin: '11:30',
        capacidadMaxima: 5,
        estado: 'activo'
      });
      
      turnos.push({
        fecha: fecha.toISOString().split('T')[0],
        horaInicio: '14:00',
        horaFin: '15:00',
        capacidadMaxima: 5,
        estado: 'activo'
      });
    }
    
    await db.turnos.bulkAdd(turnos);
  }
}
