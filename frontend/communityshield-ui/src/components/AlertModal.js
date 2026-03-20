import React from 'react';

export default function AlertModal({ alert, onClose }) {
  if (!alert) return null;

  const colorMap = { HIGH: 'var(--red)', MEDIUM: 'var(--amber)', LOW: 'var(--green)' };
  const color = colorMap[alert.risk_level] || 'var(--blue)';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: 20,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border2)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px 40px',
          maxWidth: 480, width: '100%',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%',
          height: 1,
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }} />

        {/* Icon + heading */}
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{ fontSize: 46, marginBottom: 10 }}>✅</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700,
            letterSpacing: 2, color: 'var(--green)', marginBottom: 6,
          }}>
            SOS SENT
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>
            Rescue teams have been notified. Stay safe and await help.
          </p>
        </div>

        {/* Alert detail card */}
        <div style={{
          background: 'var(--bg3)',
          borderRadius: 'var(--radius)',
          padding: '16px 18px',
          marginBottom: 22,
          borderLeft: `3px solid ${color}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, letterSpacing: 1,
            }}>
              {alert.disaster_type}
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11,
              padding: '3px 10px', borderRadius: 4,
              color, background: `${color}22`, border: `1px solid ${color}55`,
            }}>
              {alert.risk_level}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
            <div>📍 {alert.location}</div>
            {alert.details && (
              <div style={{ marginTop: 3 }}>
                📝 {alert.details.slice(0, 80)}{alert.details.length > 80 ? '...' : ''}
              </div>
            )}
            <div style={{
              marginTop: 6,
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text3)',
            }}>
              ALERT ID: #{alert.id} · {alert.created_at}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: 14,
            background: 'var(--green)', border: 'none',
            borderRadius: 'var(--radius)',
            color: '#000',
            fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, letterSpacing: 2,
            cursor: 'pointer',
          }}
        >
          OK — STAY SAFE
        </button>
      </div>
    </div>
  );
}