import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';
import MapView from '../components/MapView';
import '../App.css';

const API = 'http://localhost:8000';
const RISK_ORDER   = { HIGH: 0, MEDIUM: 1, LOW: 2 };
const STATUS_ORDER = { pending: 0, accepted: 1, resolved: 2 };

export default function Rescuer() {
  const [alerts,    setAlerts]    = useState([]);
  const [stats,     setStats]     = useState({ total:0, pending:0, accepted:0, high_risk:0 });
  const [feed,      setFeed]      = useState([{
    icon:'●', text:'System online — monitoring active',
    color:'var(--blue)', time: new Date().toLocaleTimeString(),
  }]);
  const [filter,    setFilter]    = useState('all');
  const [toast,     setToast]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [backendOk, setBackendOk] = useState(true);
  const wsRef = useRef(null);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const addFeed = useCallback((icon, text, color) => {
    setFeed(prev => [
      { icon, text, color, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9),
    ]);
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const [ar, sr] = await Promise.all([
        axios.get(`${API}/alerts`, { timeout: 5000 }),
        axios.get(`${API}/stats`,  { timeout: 5000 }),
      ]);
      const sorted = [...(ar.data || [])].sort((a, b) =>
        ((RISK_ORDER[a.risk_level]  ?? 3) - (RISK_ORDER[b.risk_level]  ?? 3)) ||
        ((STATUS_ORDER[a.status]    ?? 3) - (STATUS_ORDER[b.status]    ?? 3))
      );
      setAlerts(sorted);
      setStats(sr.data || { total:0, pending:0, accepted:0, high_risk:0 });
      setBackendOk(true);
    } catch {
      setBackendOk(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    try {
      const ws = new WebSocket('ws://localhost:8000/ws');
      wsRef.current = ws;
      ws.onmessage = e => {
        try {
          const data = JSON.parse(e.data);
          if (data.event === 'new_alert') {
            fetchAlerts();
            addFeed('🆘', `New SOS: ${data.alert?.disaster_type} at ${data.alert?.location}`, 'var(--red)');
            showToast(`New alert: ${data.alert?.disaster_type} — ${data.alert?.risk_level} RISK`, 'warning');
          }
          if (data.event === 'alert_accepted' || data.event === 'alert_resolved') fetchAlerts();
        } catch { /* ignore */ }
      };
      ws.onerror = () => {};
    } catch { /* WS unavailable */ }

    const poll = setInterval(fetchAlerts, 10000);
    return () => {
      clearInterval(poll);
      try { wsRef.current?.close(); } catch { /* ignore */ }
    };
  }, [fetchAlerts, addFeed]);

  const acceptRescue = async (id) => {
    try {
      await axios.post(`${API}/accept-rescue/${id}`, {}, { timeout: 5000 });
      addFeed('✓', `Mission accepted: Alert #${id}`, 'var(--green)');
      showToast('Mission accepted! Team deployed.', 'success');
      fetchAlerts();
    } catch { showToast('Could not accept mission.', 'error'); }
  };

  const resolveAlert = async (id) => {
    try {
      await axios.post(`${API}/resolve/${id}`, {}, { timeout: 5000 });
      addFeed('✅', `Alert #${id} resolved`, 'var(--text3)');
      showToast('Alert marked as resolved.', 'info');
      fetchAlerts();
    } catch { showToast('Could not resolve alert.', 'error'); }
  };

  const filtered = alerts.filter(a => {
    if (filter === 'pending')  return a.status === 'pending';
    if (filter === 'accepted') return a.status === 'accepted';
    if (filter === 'HIGH')     return a.risk_level === 'HIGH';
    return true;
  });

  const filterConfig = [
    { val:'all',      lbl:'ALL'       },
    { val:'pending',  lbl:'PENDING'   },
    { val:'accepted', lbl:'ACCEPTED'  },
    { val:'HIGH',     lbl:'HIGH RISK' },
  ];

  return (
    <MainLayout role="rescuer" alertCount={stats.pending}>
      <div className="rescuer-layout">

        {/* Backend offline warning */}
        {!backendOk && (
          <div style={{
            background:'var(--red-dim)', border:'1px solid var(--red-border)',
            borderRadius:'var(--radius)', padding:'12px 20px',
            fontFamily:'var(--font-mono)', fontSize:12, color:'var(--red)',
            marginBottom:16, maxWidth:1340, margin:'0 auto 16px',
          }}>
            ⚠️ Backend offline — run: <strong>python -m uvicorn main:app --reload</strong>
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card red">
            <div className="stat-val">{stats.total}</div>
            <div className="stat-lbl">TOTAL ALERTS</div>
            <div className="stat-sub">All time</div>
          </div>
          <div className="stat-card amber">
            <div className="stat-val">{stats.pending}</div>
            <div className="stat-lbl">PENDING</div>
            <div className="stat-sub">Awaiting response</div>
          </div>
          <div className="stat-card green">
            <div className="stat-val">{stats.accepted}</div>
            <div className="stat-lbl">ACCEPTED</div>
            <div className="stat-sub">Teams deployed</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-val">{stats.high_risk}</div>
            <div className="stat-lbl">HIGH RISK</div>
            <div className="stat-sub">Critical priority</div>
          </div>
        </div>

        <div className="rescuer-grid">

          {/* LEFT: Alerts */}
          <div>
            <div className="filter-bar">
              <span className="filter-label">FILTER:</span>
              {filterConfig.map(({ val, lbl }) => (
                <button
                  key={val} type="button"
                  className={`filter-btn ${filter === val ? (val === 'HIGH' ? 'active-high' : 'active-all') : 'inactive-filter'}`}
                  onClick={() => setFilter(val)}
                >{lbl}</button>
              ))}
              <button type="button" className="refresh-btn" onClick={fetchAlerts}>↻ REFRESH</button>
            </div>

            <div className="alerts-container">
              {loading ? (
                <div className="empty-msg"><span className="spinner" />&nbsp; LOADING ALERTS...</div>
              ) : filtered.length === 0 ? (
                <div className="empty-msg">
                  {backendOk ? 'NO ALERTS FOUND' : 'BACKEND OFFLINE — START YOUR SERVER'}
                </div>
              ) : (
                filtered.map((alert, idx) => (
                  <div key={alert.id || idx} className={`r-alert-card ${alert.risk_level || 'LOW'} ${alert.status || 'pending'}`}>
                    <div className="r-alert-top">
                      <div>
                        <div className="r-alert-type">{alert.disaster_type}</div>
                        <div style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text3)', marginTop:2 }}>
                          ALERT #{alert.id}
                        </div>
                      </div>
                      <div className="r-alert-right">
                        <span className={`risk-chip chip-${alert.risk_level || 'LOW'}`}>
                          {alert.risk_level || 'LOW'} RISK
                        </span>
                        <span className={`status-badge status-${alert.status || 'pending'}`}>
                          {(alert.status || 'pending').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="r-alert-meta">
                      <strong>📍 Location:</strong> {alert.location}<br />
                      {alert.citizen_name && alert.citizen_name !== 'Anonymous' && (
                        <><strong>👤 Citizen:</strong> {alert.citizen_name}<br /></>
                      )}
                      {alert.details && (
                        <><strong>📝 Details:</strong> {alert.details.length > 120 ? alert.details.slice(0,120)+'...' : alert.details}<br /></>
                      )}
                      {alert.created_at && (
                        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text3)' }}>
                          🕐 {alert.created_at}
                        </span>
                      )}
                    </div>

                    {alert.image_url && (
                      <img
                        src={`${API}${alert.image_url}`} alt="Disaster"
                        className="r-alert-img"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    )}

                    <div className="r-alert-actions">
                      <button type="button" className="btn-accept"
                        onClick={() => acceptRescue(alert.id)}
                        disabled={alert.status !== 'pending'}
                      >
                        {alert.status === 'pending' ? '✓ ACCEPT MISSION' : '✓ ACCEPTED'}
                      </button>
                      <button type="button" className="btn-resolve"
                        onClick={() => resolveAlert(alert.id)}
                        disabled={alert.status === 'resolved'}
                      >
                        {alert.status === 'resolved' ? 'RESOLVED' : 'MARK RESOLVED'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT: Side panel */}
          <div className="side-stack">

            {/* Map */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-icon">🗺️</span>
                <span className="panel-title">DISASTER MAP</span>
                <span className="panel-badge blue">
                  {alerts.filter(a => typeof a.latitude === 'number').length} PINNED
                </span>
              </div>
              <div style={{ padding:14 }}>
                <div style={{ height:220, borderRadius:'var(--radius)', overflow:'hidden', border:'1px solid var(--border)' }}>
                  {alerts.some(a => typeof a.latitude === 'number') ? (
                    <MapView alerts={alerts.filter(a => typeof a.latitude === 'number')} />
                  ) : (
                    <div className="mini-map">
                      <div className="map-pin" style={{ top:'38%', left:'52%' }}>🔴</div>
                      <div className="map-pin" style={{ top:'54%', left:'34%', animationDelay:'0.3s' }}>🟡</div>
                      <div className="map-pin" style={{ top:'28%', left:'62%', animationDelay:'0.6s' }}>🟢</div>
                      <div className="mini-map-label">MONITORING ACTIVE</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Severity bars */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-icon">📊</span>
                <span className="panel-title">SEVERITY BREAKDOWN</span>
              </div>
              <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  { label:'HIGH RISK',   count:alerts.filter(a=>a.risk_level==='HIGH').length,   color:'var(--red)' },
                  { label:'MEDIUM RISK', count:alerts.filter(a=>a.risk_level==='MEDIUM').length, color:'var(--amber)' },
                  { label:'LOW RISK',    count:alerts.filter(a=>a.risk_level==='LOW').length,    color:'var(--green)' },
                ].map(row => {
                  const pct = alerts.length > 0 ? Math.round((row.count/alerts.length)*100) : 0;
                  return (
                    <div key={row.label}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:row.color, letterSpacing:1 }}>{row.label}</span>
                        <span style={{ fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text2)' }}>{row.count} ({pct}%)</span>
                      </div>
                      <div style={{ height:5, background:'var(--bg4)', borderRadius:4, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${pct}%`, background:row.color, borderRadius:4, transition:'width 0.5s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity feed */}
            <div className="panel" style={{ flex:1 }}>
              <div className="panel-header">
                <span className="panel-icon">📡</span>
                <span className="panel-title">ACTIVITY FEED</span>
              </div>
              <div className="feed-panel">
                {feed.map((f, i) => (
                  <div className="feed-item" key={i}>
                    <div className="feed-dot" style={{ background:f.color }} />
                    <div>
                      <div className="feed-text">{f.text}</div>
                      <div className="feed-time">{f.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {toast && <div className={`toast ${toast.type} show`}>{toast.msg}</div>}
    </MainLayout>
  );
}