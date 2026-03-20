import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../layout/MainLayout';
import DisasterForm from '../components/DisasterForm';
import AlertModal from '../components/AlertModal';
import MapView from '../components/MapView';
import Chat from '../components/Chat';
import '../App.css';

export default function Dashboard() {
  const [myAlerts,      setMyAlerts]      = useState([]);
  const [successAlert,  setSuccessAlert]  = useState(null);
  const [activeTab,     setActiveTab]     = useState('map');
  const [mapCoords,     setMapCoords]     = useState(null);

  const handleAlertSent = useCallback((alert) => {
    if (!alert) return;
    setMyAlerts(prev => [alert, ...prev]);
    setSuccessAlert(alert);
    if (typeof alert.latitude === 'number' && typeof alert.longitude === 'number') {
      setMapCoords({ lat: alert.latitude, lng: alert.longitude });
    }
  }, []);

  useEffect(() => {
    if (myAlerts.length === 0) return;
    const interval = setInterval(async () => {
      try {
        const updated = await Promise.all(
          myAlerts.map(async a => {
            try {
              const res = await fetch(`http://localhost:8000/alerts/${a.id}`, {
                signal: AbortSignal.timeout(3000),
              });
              if (res.ok) {
                const data = await res.json();
                return data.error ? a : data;
              }
              return a;
            } catch { return a; }
          })
        );
        setMyAlerts(updated);
      } catch { /* ignore */ }
    }, 10000);
    return () => clearInterval(interval);
  }, [myAlerts.length]); // eslint-disable-line

  const pending = myAlerts.filter(a => a.status === 'pending').length;

  return (
    <MainLayout role="citizen" alertCount={pending}>
      <div className="citizen-layout">
        <div className="citizen-grid">

          {/* LEFT — SOS Form */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-icon">🆘</span>
              <span className="panel-title">REPORT EMERGENCY</span>
              <span className="panel-badge">SOS FORM</span>
            </div>
            <div className="panel-body">
              <DisasterForm onAlertSent={handleAlertSent} />
            </div>
          </div>

          {/* RIGHT — Map / Chat + My Alerts */}
          <div className="citizen-right">

            {/* Tab panel */}
            <div className="panel" style={{ flexShrink: 0 }}>
              <div className="panel-header">
                <span className="panel-icon">{activeTab === 'map' ? '🗺️' : '💬'}</span>
                <span className="panel-title">
                  {activeTab === 'map' ? 'LIVE DISASTER MAP' : 'EMERGENCY ASSISTANT'}
                </span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 'map' ? 'active' : 'inactive'}`}
                    onClick={() => setActiveTab('map')}
                  >MAP</button>
                  <button
                    type="button"
                    className={`tab-btn ${activeTab === 'chat' ? 'active' : 'inactive'}`}
                    onClick={() => setActiveTab('chat')}
                  >AI CHAT</button>
                </div>
              </div>

              {activeTab === 'map' ? (
                <div className="map-wrapper">
                  <div className="map-container">
                    <MapView
                      alerts={myAlerts.filter(a => typeof a.latitude === 'number')}
                      center={mapCoords ? [mapCoords.lat, mapCoords.lng] : [20.5937, 78.9629]}
                      zoom={mapCoords ? 12 : 5}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ height: 320 }}>
                  <Chat />
                </div>
              )}
            </div>

            {/* My Alerts */}
            <div className="panel" style={{ flex: 1 }}>
              <div className="panel-header">
                <span className="panel-icon">📋</span>
                <span className="panel-title">MY ALERTS</span>
                <span className={`panel-badge ${myAlerts.length > 0 ? '' : 'green'}`}>
                  {myAlerts.length} SENT
                </span>
              </div>
              <div
                className="panel-body"
                style={{ padding: '14px 16px', maxHeight: 320, overflowY: 'auto' }}
              >
                {myAlerts.length === 0 ? (
                  <div className="empty-msg">NO ALERTS SENT YET</div>
                ) : (
                  myAlerts.map((a, idx) => (
                    <div key={a.id || idx} className={`my-alert-item ${a.risk_level || 'LOW'}`}>
                      <div className="my-alert-top">
                        <span className="my-alert-type">{a.disaster_type}</span>
                        <span className="my-alert-time">{a.created_at || ''}</span>
                      </div>
                      <div className="my-alert-loc">📍 {a.location}</div>
                      <div className="my-alert-footer">
                        <span className={`status-badge status-${a.status || 'pending'}`}>
                          {(a.status || 'pending').toUpperCase()}
                        </span>
                        <span className={`risk-chip chip-${a.risk_level || 'LOW'}`}>
                          {a.risk_level || 'LOW'}
                        </span>
                        {a.id && (
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 10,
                            color: 'var(--text3)', marginLeft: 'auto',
                          }}>#{a.id}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {successAlert && (
        <AlertModal alert={successAlert} onClose={() => setSuccessAlert(null)} />
      )}
    </MainLayout>
  );
}