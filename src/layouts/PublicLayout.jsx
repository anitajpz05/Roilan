import { Outlet } from 'react-router-dom';
import './PublicLayout.css';

export function PublicLayout() {
  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="container">
          <h1>Sistema de Gestión de Turnos</h1>
          <p>Reserva tu turno de forma fácil y rápida</p>
        </div>
      </header>
      <main className="public-main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="public-footer">
        <p>&copy; 2024 Sistema de Gestión de Turnos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
