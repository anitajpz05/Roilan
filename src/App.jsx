import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout, AdminLayout } from './layouts';
import { TurnosDisponibles, Login, CRUDTurnos, ListadoReservas, ProtectedRoute } from './pages';
import { initializeDatabase } from './db/db';
import './styles/global.css';

function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<TurnosDisponibles />} />
            <Route path="/login" element={<Login />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/turnos" element={<CRUDTurnos />} />
            <Route path="/admin/reservas" element={<ListadoReservas />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Navigate to="/admin/turnos" replace />
              </ProtectedRoute>
            }
          />

          {/* Ruta 404 - redirige al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
