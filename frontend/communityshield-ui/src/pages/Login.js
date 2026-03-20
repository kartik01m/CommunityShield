import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function Login() {
  const [role, setRole] = useState('citizen');
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-logo">
          <div className="logo-pulse" />
          <span className="logo-text">COMMUNITY<span>SHIELD</span></span>
        </div>
        <div className="topbar-right">
          <span className="status-pill pill-live">● LIVE</span>
          <span className="status-pill pill-alerts">AI POWERED</span>
        </div>
      </div>

      {/* Body */}
      <div className="login-page">
        <div className="login-grid-bg" />
        <div className="login-glow" />

        <div className="login-card">
          <div className="login-header">
            <div className="login-title">
              COMMUNITY<br /><span className="highlight">SHIELD</span>
            </div>
            <div className="login-tagline">AI DISASTER RESPONSE SYSTEM · V2.0</div>
          </div>

          <span className="role-label">SELECT YOUR ROLE</span>

          <div className="role-grid">
            <div
              className={`role-card ${role === 'citizen' ? 'active' : ''}`}
              onClick={() => setRole('citizen')}
            >
              <div className="role-icon">🆘</div>
              <div className="role-name">CITIZEN</div>
              <div className="role-desc">Report emergencies & request rescue</div>
            </div>
            <div
              className={`role-card ${role === 'rescuer' ? 'active' : ''}`}
              onClick={() => setRole('rescuer')}
            >
              <div className="role-icon">🚑</div>
              <div className="role-name">RESCUER</div>
              <div className="role-desc">Command center & respond to SOS</div>
            </div>
          </div>

          <button
            className="btn-enter"
            onClick={() => navigate(role === 'citizen' ? '/citizen' : '/rescuer')}
          >
            ENTER SYSTEM →
          </button>

          {/* Quick guide link */}
          <div style={{ textAlign: 'center', marginTop: 18 }}>
            <button
              onClick={() => navigate('/guide')}
              style={{
                background: 'none', border: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 11,
                color: 'var(--text3)', cursor: 'pointer',
                letterSpacing: 1, transition: 'color 0.2s',
                textDecoration: 'underline', textUnderlineOffset: 3,
              }}
              onMouseEnter={e => e.target.style.color = 'var(--green)'}
              onMouseLeave={e => e.target.style.color = 'var(--text3)'}
            >
              📖 VIEW EMERGENCY GUIDE →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}