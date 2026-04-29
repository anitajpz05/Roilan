import './Tabla.css';

export function Tabla({ columnas, datos, acciones = [] }) {
  if (!datos || datos.length === 0) {
    return (
      <div className="tabla-vacia">
        <p>No hay datos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="tabla-contenedor">
      <table className="tabla">
        <thead>
          <tr>
            {columnas.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {acciones.length > 0 && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {datos.map((fila, idx) => (
            <tr key={fila.id || idx}>
              {columnas.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(fila[col.key], fila) : fila[col.key]}
                </td>
              ))}
              {acciones.length > 0 && (
                <td className="acciones-celda">
                  <div className="acciones-botones">
                    {acciones.map((accion) => (
                      <button
                        key={accion.label}
                        className={`btn btn-accion btn-${accion.tipo}`}
                        onClick={() => accion.onClick(fila)}
                        title={accion.label}
                      >
                        {accion.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
