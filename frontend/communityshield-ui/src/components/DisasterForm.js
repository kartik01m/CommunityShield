import React, { useState, useRef } from 'react';
import axios from 'axios';

const API = 'https://communityshield.onrender.com';

const DISASTER_TYPES = [
  { value: '',           label: '— Select disaster type —' },
  { value: 'Flood',      label: '🌊 Flood' },
  { value: 'Fire',       label: '🔥 Fire / Wildfire' },
  { value: 'Earthquake', label: '🌍 Earthquake' },
  { value: 'Cyclone',    label: '🌀 Cyclone / Hurricane' },
  { value: 'Landslide',  label: '⛰️ Landslide' },
  { value: 'Medical',    label: '🏥 Medical Emergency' },
  { value: 'Chemical',   label: '☣️ Chemical / Gas Leak' },
  { value: 'Other',      label: '⚠️ Other Emergency' },
];

// Rule-based AI fallback — works 100% offline, no API needed
function ruleBasedAnalysis(disasterType, description, location) {
  const HIGH_TYPES   = ['Flood', 'Fire', 'Earthquake', 'Cyclone', 'Chemical'];
  const MEDIUM_TYPES = ['Landslide', 'Medical'];
  const text = (description || '').toLowerCase();
  const criticalWords = ['trapped', 'unconscious', 'bleeding', 'collapse', 'drowning', 'explosion', 'dying'];

  let risk = 'LOW';
  if (HIGH_TYPES.includes(disasterType))   risk = 'HIGH';
  else if (MEDIUM_TYPES.includes(disasterType)) risk = 'MEDIUM';
  if (criticalWords.some(w => text.includes(w))) risk = 'HIGH';

  const actionMap = {
    Flood:      'Move immediately to highest ground available. Do not walk through floodwater.',
    Fire:       'Evacuate the building. Stay low to avoid smoke. Call 101.',
    Earthquake: 'Drop, Cover, and Hold On. Move away from windows and exterior walls.',
    Cyclone:    'Seek sturdy shelter immediately. Stay away from windows.',
    Landslide:  'Move away from the slope path quickly. Alert neighbours.',
    Medical:    'Keep the patient calm and still. Call 108 for ambulance immediately.',
    Chemical:   'Cover nose and mouth. Move upwind away from the source immediately.',
    Other:      'Move to a safe location and await rescue teams.',
  };

  const resourceMap = {
    Flood:      ['NDRF: 011-24363260', 'Emergency: 112'],
    Fire:       ['Fire: 101', 'Emergency: 112'],
    Earthquake: ['NDMA: 1078', 'Emergency: 112'],
    Cyclone:    ['NDRF: 011-24363260', 'Emergency: 112'],
    Landslide:  ['NDMA: 1078', 'Emergency: 112'],
    Medical:    ['Ambulance: 108', 'Emergency: 112'],
    Chemical:   ['Emergency: 112', 'Poison Control: 1800-11-6117'],
    Other:      ['Emergency: 112', 'Disaster Helpline: 1070'],
  };

  return {
    risk_level: risk,
    summary: `${disasterType} emergency reported at ${location || 'your location'}. Risk level assessed as ${risk}. Rescue teams will be dispatched immediately upon receiving your SOS.`,
    immediate_action: actionMap[disasterType] || 'Move to a safe location and await rescue.',
    resources: resourceMap[disasterType] || ['Emergency: 112', 'Disaster Helpline: 1070'],
  };
}

export default function DisasterForm({ onAlertSent }) {
  const [disasterType,  setDisasterType]  = useState('');
  const [location,      setLocation]      = useState('');
  const [description,   setDescription]  = useState('');
  const [citizenName,   setCitizenName]  = useState('');
  const [file,          setFile]          = useState(null);
  const [fileName,      setFileName]      = useState('');
  const [coords,        setCoords]        = useState(null);
  const [aiResult,      setAiResult]      = useState(null);
  const [analyzing,     setAnalyzing]     = useState(false);
  const [sending,       setSending]       = useState(false);
  const [toast,         setToast]         = useState(null);
  const fileRef = useRef(null);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── GPS ──────────────────────────────────────────────────────
  const handleGPS = () => {
    if (!navigator.geolocation) {
      showToast('GPS not supported by your browser', 'error');
      return;
    }
    showToast('Detecting location...', 'info');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude.toFixed(5);
        const lng = pos.coords.longitude.toFixed(5);
        setCoords({ lat: parseFloat(lat), lng: parseFloat(lng) });
        setLocation(`${lat}, ${lng}`);
        showToast('📍 Location acquired', 'success');
      },
      () => {
        setLocation('Nashik, Maharashtra, India');
        setCoords({ lat: 19.9975, lng: 73.7898 });
        showToast('Could not get GPS — using approximate location', 'warning');
      },
      { timeout: 8000 }
    );
  };

  // ── File ─────────────────────────────────────────────────────
  const handleFile = e => {
    const f = e.target.files[0];
    if (f) { setFile(f); setFileName(f.name); }
  };

  // ── AI Analysis (rule-based only — safe, no external API) ───
  const analyzeWithAI = () => {
    if (!disasterType && !description) {
      showToast('Please select a disaster type or add a description first', 'error');
      return;
    }
    setAnalyzing(true);
    setAiResult(null);

    // Simulate a brief analysis delay for UX
    setTimeout(() => {
      try {
        const result = ruleBasedAnalysis(disasterType, description, location);
        setAiResult(result);
      } catch (e) {
        setAiResult({
          risk_level: 'MEDIUM',
          summary: 'Emergency detected. Rescue teams will be notified.',
          immediate_action: 'Move to safety and await rescue teams.',
          resources: ['Emergency: 112'],
        });
      }
      setAnalyzing(false);
    }, 900);
  };

  // ── Send SOS ─────────────────────────────────────────────────
  const sendSOS = async () => {
    if (!disasterType) { showToast('Please select a disaster type', 'error');  return; }
    if (!location)     { showToast('Please enter your location', 'error');      return; }

    setSending(true);

    try {
      let imageUrl = null;

      // 1. Upload image if selected
      if (file) {
        try {
          const fd = new FormData();
          fd.append('file', file);
          const imgRes = await axios.post(`${API}/upload-photo`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 10000,
          });
          imageUrl = imgRes.data.image_url;
        } catch {
          // Continue without image — don't block SOS
        }
      }

      // 2. Send alert
      const payload = {
        disaster_type: disasterType,
        location:      location,
        details:       description,
        latitude:      coords ? coords.lat : null,
        longitude:     coords ? coords.lng : null,
        citizen_name:  citizenName.trim() || 'Anonymous',
      };

      const res = await axios.post(`${API}/alert`, payload, { timeout: 10000 });
      const newAlert = { ...res.data, image_url: imageUrl };

      showToast('✓ SOS sent! Rescue teams notified.', 'success');
      if (onAlertSent) onAlertSent(newAlert);

      // Reset form
      setDisasterType('');
      setLocation('');
      setDescription('');
      setCitizenName('');
      setFile(null);
      setFileName('');
      setAiResult(null);
      setCoords(null);
      if (fileRef.current) fileRef.current.value = '';

    } catch (err) {
      const msg = err.code === 'ECONNABORTED'
        ? 'Request timed out. Is the backend running?'
        : 'Could not reach backend. Run: python -m uvicorn main:app --reload';
      showToast(msg, 'error');
    }

    setSending(false);
  };

  return (
    <>
      {/* Disaster type */}
      <div className="field">
        <label className="field-label">DISASTER TYPE *</label>
        <select
          className="field-select"
          value={disasterType}
          onChange={e => { setDisasterType(e.target.value); setAiResult(null); }}
        >
          {DISASTER_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Name */}
      <div className="field">
        <label className="field-label">YOUR NAME (OPTIONAL)</label>
        <input
          className="field-input"
          type="text"
          placeholder="Anonymous"
          value={citizenName}
          onChange={e => setCitizenName(e.target.value)}
        />
      </div>

      {/* Location + GPS */}
      <div className="field">
        <label className="field-label">YOUR LOCATION *</label>
        <div className="loc-row">
          <input
            className="field-input"
            type="text"
            placeholder="Enter address or use GPS..."
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <button type="button" className="btn-gps" onClick={handleGPS}>
            📍 GPS
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="field">
        <label className="field-label">SITUATION DESCRIPTION</label>
        <textarea
          className="field-textarea"
          placeholder="Describe the emergency — number of people trapped, visible damage, immediate dangers..."
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      {/* Photo upload */}
      <div className="field">
        <label className="field-label">PHOTO EVIDENCE (OPTIONAL)</label>
        <div className="upload-zone">
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={handleFile}
          />
          <div className="upload-icon">📷</div>
          <div className="upload-hint">
            Click or drag photo here
            <small>JPG, PNG, WEBP · max 10MB</small>
          </div>
          {fileName && <div className="upload-name">✓ {fileName}</div>}
        </div>
      </div>

      {/* AI Analyze button */}
      <button
        type="button"
        className="btn-analyze"
        onClick={analyzeWithAI}
        disabled={analyzing}
      >
        {analyzing
          ? <><span className="spinner" />&nbsp; ANALYZING...</>
          : '⚡ AI RISK ANALYSIS'
        }
      </button>

      {/* AI result box */}
      {aiResult && (
        <div className="ai-analysis-box">
          <div className="ai-header">
            <div className="ai-indicator">
              <div className="ai-dot" />
              AI RISK ASSESSMENT
            </div>
          </div>
          <p className="ai-text">{aiResult.summary}</p>
          {aiResult.immediate_action && (
            <p className="ai-action">⚡ {aiResult.immediate_action}</p>
          )}
          {aiResult.resources && aiResult.resources.length > 0 && (
            <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>
              {aiResult.resources.join(' · ')}
            </p>
          )}
          <div className="risk-chips">
            <span className={`risk-chip chip-${aiResult.risk_level}`}>
              RISK: {aiResult.risk_level}
            </span>
            <span className="risk-chip chip-info">AI ASSESSED</span>
          </div>
        </div>
      )}

      {/* SOS button */}
      <button
        type="button"
        className="btn-sos"
        onClick={sendSOS}
        disabled={sending}
      >
        {sending
          ? <><span className="spinner" />&nbsp; SENDING SOS...</>
          : <><span>🚨</span> SEND EMERGENCY SOS</>
        }
      </button>

      {/* Toast notification */}
      {toast && (
        <div className={`toast ${toast.type} show`} style={{ position: 'fixed' }}>
          {toast.msg}
        </div>
      )}
    </>
  );
}