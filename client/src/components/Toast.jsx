import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();
  if (!toasts.length) return null;
  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {toasts.map(t => <Toast key={t.id} toast={t} remove={removeToast} />)}
    </div>
  );
}

function Toast({ toast, remove }) {
  const icons = { success: CheckCircle, error: XCircle, info: Info };
  const colors = {
    success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', icon: '#22c55e' },
    error: { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', icon: '#ef4444' },
    info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', icon: '#3b82f6' },
  };
  const c = colors[toast.type] || colors.info;
  const Icon = icons[toast.type] || Info;

  return (
    <div style={{
      background: c.bg, border: `1px solid ${c.border}`, borderRadius: '1rem',
      padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem',
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)', minWidth: '280px', maxWidth: '360px',
      animation: 'slideInRight 0.3s ease-out',
    }}>
      <Icon size={18} style={{ color: c.icon, flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: c.text }}>{toast.message}</span>
      <button onClick={() => remove(toast.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.text, opacity: 0.6, padding: 0, lineHeight: 1 }}>
        <X size={16} />
      </button>
    </div>
  );
}
