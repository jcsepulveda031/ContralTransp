import React from 'react';

const items = [
  { color: '#e53935', label: 'Lleno' },
  { color: '#ffb300', label: 'Parcial' },
  { color: '#43a047', label: 'Vacío' },
];

const Legend3D: React.FC = () => (
  <div style={{
    position: 'fixed',
    bottom: 32,
    left: 32,
    background: 'rgba(24,28,36,0.95)',
    borderRadius: 12,
    padding: '12px 24px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
    display: 'flex',
    gap: 24,
    zIndex: 1000,
    alignItems: 'center',
  }}>
    {items.map(item => (
      <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 18, height: 18, borderRadius: 4, background: item.color, display: 'inline-block' }} />
        <span style={{ color: '#fff', fontWeight: 600 }}>{item.label}</span>
      </span>
    ))}
  </div>
);

export default Legend3D; 