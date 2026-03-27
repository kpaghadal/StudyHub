import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ title, message, onConfirm, onCancel, confirmText = 'Delete', danger = true }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: '1.5rem', width: '100%', maxWidth: '420px',
          padding: '2rem', boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
          animation: 'scaleIn 0.2s ease-out',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '0.875rem', flexShrink: 0,
            background: danger ? '#fff1f2' : '#eff6ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AlertTriangle size={20} style={{ color: danger ? '#ef4444' : '#3b82f6' }} />
          </div>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#191c1e', marginBottom: '0.375rem' }}>{title}</h3>
            <p style={{ fontSize: '0.875rem', color: '#767586', lineHeight: 1.6 }}>{message}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '0.625rem 1.25rem', borderRadius: '999px', border: '1px solid #e0e3e5',
              background: '#fff', color: '#191c1e', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
            }}
          >Cancel</button>
          <button
            onClick={onConfirm}
            style={{
              padding: '0.625rem 1.25rem', borderRadius: '999px', border: 'none',
              background: danger ? '#ef4444' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
              color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
            }}
          >{confirmText}</button>
        </div>
      </div>
    </div>
  );
}
