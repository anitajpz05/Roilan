export function Alert({ type = 'info', message, onClose }) {
  const tiposAlerta = {
    success: '✓',
    danger: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`alert alert-${type}`}>
      <span>{tiposAlerta[type]}</span>
      <span>{message}</span>
      {onClose && (
        <button 
          className="alert-close"
          onClick={onClose}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
        >
          ×
        </button>
      )}
    </div>
  );
}
