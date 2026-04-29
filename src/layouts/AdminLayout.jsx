import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import './AdminLayout.css';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Panel Admin</h2>
          <p>Usuario: {user?.email}</p>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin/turnos" className="nav-link">
            📅 Gestión de Turnos
          </Link>
          <Link to="/admin/reservas" className="nav-link">
            🗂️ Gestión de Reservas
          </Link>
        </nav>
        <button className="btn btn-danger logout-btn" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </aside>
      <main className="admin-main">
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
