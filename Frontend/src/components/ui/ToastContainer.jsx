import { useState, useEffect } from 'react';
import { _setListener } from './toast.js';

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _setListener((toast) => {
      const id = Date.now() + Math.random();
      const t = { ...toast, id };
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 2500);
    });
    return () => _setListener(null);
  }, []);

  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="fade-in"
          style={{
            background: t.type === 'error' ? '#ef4444' : '#111111',
            color: '#ffffff',
            borderRadius: 10,
            padding: '10px 22px',
            fontSize: '0.85rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
