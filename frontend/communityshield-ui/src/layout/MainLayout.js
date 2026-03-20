import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

export default function MainLayout({ role, children, alertCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  const citizenNav = [
    { path: '/citizen', label: 'SOS REPORT',     isGuide: false },
    { path: '/guide',   label: 'EMERGENCY GUIDE', isGuide: true  },
  ];
  const rescuerNav = [
    { path: '/rescuer', label: 'COMMAND CENTER',  isGuide: false },
    { path: '/guide',   label: 'EMERGENCY GUIDE', isGuide: true  },
  ];
  const navItems = role === 'citizen' ? citizenNav : rescuerNav;

  return (
    <div className="app-shell">
      <div className="topbar">

        <div className="topbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-pulse" />
          <span className="logo-text">
            COMMUNITY<span style={{ color: 'var(--red)' }}>SHIELD</span>
          </span>
        </div>

        <nav className="topbar-nav">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            if (item.isGuide) {
              return (
                <button
                  key={item.path}
                  className={`nav-link-guide ${isActive ? 'active-guide' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <div className="guide-btn-dot" />
                  📖 {item.label}
                </button>
              );
            }
            return (
              <button
                key={item.path}
                className={`nav-link ${isActive ? 'active-red' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <div className="nav-dot" style={{ background: isActive ? 'var(--red)' : 'var(--text3)' }} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="topbar-right">
          <span className="status-pill pill-live">● LIVE</span>
          {alertCount > 0 && (
            <span className="status-pill pill-alerts">
              {alertCount} ALERT{alertCount !== 1 ? 'S' : ''}
            </span>
          )}
          <span className="status-pill pill-role">
            {role === 'citizen' ? '🆘 CITIZEN' : '🚑 RESCUER'}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)', letterSpacing: 1 }}>
            {time}
          </span>
          <button className="btn-back" onClick={() => navigate('/')}>← EXIT</button>
        </div>

      </div>
      {children}
    </div>
  );
}