import React, { useEffect, useRef, useState } from 'react';

export default function MapView({ alerts = [], center = [20.5937, 78.9629], zoom = 5 }) {
  const mapRef        = useRef(null);
  const mapInstance   = useRef(null);
  const markersRef    = useRef([]);
  const [ready, setReady] = useState(false);

  // ── Load Leaflet once ────────────────────────────────────────
  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link   = document.createElement('link');
      link.id      = 'leaflet-css';
      link.rel     = 'stylesheet';
      link.href    = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const init = () => {
      if (!window.L || !mapRef.current || mapInstance.current) return;
      try {
        mapInstance.current = window.L.map(mapRef.current, { center, zoom, zoomControl: true });
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
          maxZoom: 18,
        }).addTo(mapInstance.current);
        setReady(true);
      } catch (e) {
        console.warn('Map init failed:', e);
      }
    };

    if (window.L) {
      init();
    } else if (!document.getElementById('leaflet-js')) {
      const script    = document.createElement('script');
      script.id       = 'leaflet-js';
      script.src      = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload   = init;
      script.onerror  = () => console.warn('Leaflet failed to load');
      document.head.appendChild(script);
    } else {
      // script tag exists but not loaded yet — wait
      const existing = document.getElementById('leaflet-js');
      existing.addEventListener('load', init);
    }

    return () => {
      if (mapInstance.current) {
        try { mapInstance.current.remove(); } catch (e) {}
        mapInstance.current = null;
      }
      setReady(false);
    };
  }, []); // eslint-disable-line

  // ── Update markers ───────────────────────────────────────────
  useEffect(() => {
    if (!ready || !mapInstance.current || !window.L) return;
    const L = window.L;

    markersRef.current.forEach(m => { try { m.remove(); } catch (e) {} });
    markersRef.current = [];

    const validAlerts = alerts.filter(
      a => a && typeof a.latitude === 'number' && typeof a.longitude === 'number'
    );

    validAlerts.forEach(alert => {
      try {
        const colorMap = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#10b981' };
        const color    = colorMap[alert.risk_level] || '#3b82f6';

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:14px;height:14px;border-radius:50%;
            background:${color};border:2px solid #fff;
            box-shadow:0 0 10px ${color};
          "></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

        const marker = L.marker([alert.latitude, alert.longitude], { icon })
          .addTo(mapInstance.current)
          .bindPopup(`
            <div style="font-family:sans-serif;min-width:160px">
              <strong style="font-size:14px">${alert.disaster_type || 'Alert'}</strong><br/>
              <span style="color:#666;font-size:12px">📍 ${alert.location || ''}</span><br/>
              <span style="
                display:inline-block;margin-top:6px;padding:2px 8px;
                border-radius:4px;font-size:11px;
                background:${color}22;color:${color};border:1px solid ${color}55;
              ">${alert.risk_level} RISK</span>
            </div>
          `);
        markersRef.current.push(marker);
      } catch (e) {
        console.warn('Marker error:', e);
      }
    });

    if (markersRef.current.length > 0) {
      try {
        const group = L.featureGroup(markersRef.current);
        mapInstance.current.fitBounds(group.getBounds().pad(0.3));
      } catch (e) {}
    }
  }, [alerts, ready]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 'var(--radius)',
          background: '#1a2235',
          zIndex: 1,
        }}
      />
      {!ready && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#111827', borderRadius: 'var(--radius)',
          gap: 8, zIndex: 2,
        }}>
          <div style={{
            backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            position: 'absolute', inset: 0, borderRadius: 'var(--radius)',
          }} />
          <span style={{ fontSize: 28, zIndex: 1, animation: 'bounce 0.9s ease-in-out infinite alternate' }}>📍</span>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#475569', letterSpacing: 1, zIndex: 1 }}>
            LOADING MAP...
          </span>
        </div>
      )}
    </div>
  );
}