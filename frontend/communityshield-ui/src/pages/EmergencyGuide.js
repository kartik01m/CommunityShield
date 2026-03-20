import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const DISASTERS = [
  {
    id: 'flood',
    emoji: '🌊',
    title: 'FLOOD',
    subtitle: 'Rising water levels, flash floods, coastal inundation',
    risk: 'HIGH',
    riskColor: 'var(--red)',
    category: 'natural',
    color: 'var(--blue)',
    colorDim: 'var(--blue-dim)',
    colorBorder: 'var(--blue-border)',
    steps: [
      'Move immediately to the highest ground available — go upstairs or to the roof',
      'Never walk, swim, or drive through floodwaters — 6 inches can knock you down',
      'Disconnect electrical appliances and turn off utilities at main switches',
      'If trapped, signal for help using a whistle, bright cloth, or flashlight',
      'Avoid storm drains, drainage channels, and low-lying bridges',
      'Do not return home until authorities declare it safe',
    ],
    dos: ['Move to high ground fast', 'Turn off utilities', 'Keep emergency kit ready', 'Charge all phones'],
    donts: ['Walk through floodwater', 'Drive into flooded roads', 'Touch electrical equipment', 'Return before clearance'],
    contacts: [{ label: 'NDRF', number: '011-24363260' }, { label: 'Emergency', number: '112' }, { label: 'Disaster Helpline', number: '1070' }],
  },
  {
    id: 'fire',
    emoji: '🔥',
    title: 'FIRE',
    subtitle: 'Building fires, wildfires, gas explosions',
    risk: 'HIGH',
    riskColor: 'var(--red)',
    category: 'natural',
    color: 'var(--orange)',
    colorDim: 'var(--orange-dim)',
    colorBorder: 'var(--orange-border)',
    steps: [
      'Alert everyone loudly and activate the nearest fire alarm immediately',
      'Evacuate via stairs — never use elevators during a fire',
      'Stay low and crawl below smoke — toxic gases rise to the top',
      'Close doors as you leave to slow fire spread (do not lock them)',
      'Feel doors before opening — if hot, find another exit route',
      'Once outside, call 101 immediately and do not re-enter the building',
    ],
    dos: ['Sound the alarm', 'Crawl below smoke', 'Close doors behind you', 'Meet at assembly point'],
    donts: ['Use the elevator', 'Open hot doors', 'Go back for belongings', 'Fight large fires yourself'],
    contacts: [{ label: 'Fire Brigade', number: '101' }, { label: 'Emergency', number: '112' }, { label: 'Ambulance', number: '108' }],
  },
  {
    id: 'earthquake',
    emoji: '🌍',
    title: 'EARTHQUAKE',
    subtitle: 'Ground shaking, aftershocks, structural collapse',
    risk: 'HIGH',
    riskColor: 'var(--red)',
    category: 'natural',
    color: 'var(--amber)',
    colorDim: 'var(--amber-dim)',
    colorBorder: 'var(--amber-border)',
    steps: [
      'DROP to hands and knees immediately to prevent being knocked down',
      'COVER your head and neck under a sturdy table or against an interior wall',
      'HOLD ON and stay in position until shaking completely stops',
      'Stay away from windows, exterior walls, heavy furniture, and overhead lights',
      'If outdoors, move away from buildings, trees, and power lines',
      'After shaking stops, check for injuries and evacuate carefully watching for debris',
    ],
    dos: ['Drop, Cover, Hold On', 'Stay away from windows', 'Move from coastline after', 'Check for gas leaks after'],
    donts: ['Run outside during shaking', 'Use elevators', 'Stand in doorways', 'Return without inspection'],
    contacts: [{ label: 'NDMA', number: '1078' }, { label: 'Emergency', number: '112' }, { label: 'NDRF', number: '011-24363260' }],
  },
  {
    id: 'cyclone',
    emoji: '🌀',
    title: 'CYCLONE',
    subtitle: 'High winds, storm surge, heavy rainfall',
    risk: 'HIGH',
    riskColor: 'var(--red)',
    category: 'natural',
    color: 'var(--violet)',
    colorDim: 'var(--violet-dim)',
    colorBorder: 'var(--violet-border)',
    steps: [
      'Follow official evacuation orders immediately — do not delay',
      'Move away from coastal areas, rivers, and low-lying land',
      'Seek shelter in a sturdy reinforced building away from trees',
      'Close and reinforce all windows, doors, and shutters',
      'Store at least 3 days of food, water, medicines, and documents',
      'During the storm stay indoors — the calm eye can be deceptive',
    ],
    dos: ['Evacuate early', 'Secure outdoor objects', 'Fill water containers', 'Stay indoors during storm'],
    donts: ['Go outside during eye', 'Shelter under trees', 'Use candles near gas', 'Ignore official warnings'],
    contacts: [{ label: 'NDRF', number: '011-24363260' }, { label: 'Emergency', number: '112' }, { label: 'Coast Guard', number: '1554' }],
  },
  {
    id: 'landslide',
    emoji: '⛰️',
    title: 'LANDSLIDE',
    subtitle: 'Mudslides, debris flows, slope failure',
    risk: 'MEDIUM',
    riskColor: 'var(--amber)',
    category: 'natural',
    color: 'var(--amber)',
    colorDim: 'var(--amber-dim)',
    colorBorder: 'var(--amber-border)',
    steps: [
      'Move quickly away from the landslide path — go sideways not downhill',
      'Listen for unusual sounds — cracking trees or boulders signal danger',
      'If escape is impossible, curl into a ball and protect your head',
      'After the slide, stay away from the area — secondary slides are common',
      'Check for injured people — do not move seriously injured persons',
      'Report hazardous areas to local authorities immediately',
    ],
    dos: ['Move perpendicular to slide', 'Alert neighbours', 'Stay away after slide', 'Monitor hillsides in rain'],
    donts: ['Move towards the slide', 'Re-enter slide area quickly', 'Cross unstable ground', 'Build below steep slopes'],
    contacts: [{ label: 'NDMA', number: '1078' }, { label: 'Emergency', number: '112' }, { label: 'Police', number: '100' }],
  },
  {
    id: 'medical',
    emoji: '🏥',
    title: 'MEDICAL EMERGENCY',
    subtitle: 'Cardiac arrest, severe bleeding, unconsciousness',
    risk: 'HIGH',
    riskColor: 'var(--red)',
    category: 'medical',
    color: 'var(--green)',
    colorDim: 'var(--green-dim)',
    colorBorder: 'var(--green-border)',
    steps: [
      'Call 108 for ambulance immediately — do not delay',
      'Check responsiveness — tap shoulders and shout "Are you OK?"',
      'If not breathing normally, begin CPR: 30 hard chest compressions and 2 rescue breaths',
      'For bleeding, apply firm direct pressure with clean cloth and elevate if possible',
      'Do not move someone with suspected spinal or neck injury unless in immediate danger',
      'Keep the person warm, calm, and informed until help arrives',
    ],
    dos: ['Call 108 first', 'Start CPR if not breathing', 'Control bleeding with pressure', 'Stay with patient'],
    donts: ['Remove embedded objects', 'Give water to unconscious', 'Move spinal injury patients', 'Leave patient alone'],
    contacts: [{ label: 'Ambulance', number: '108' }, { label: 'Emergency', number: '112' }, { label: 'Police', number: '100' }],
  },
  {
    id: 'chemical',
    emoji: '☣️',
    title: 'CHEMICAL / GAS LEAK',
    subtitle: 'Toxic fumes, gas leaks, hazardous spills',
    risk: 'HIGH',
    riskColor: 'var(--red)',
    category: 'industrial',
    color: 'var(--cyan)',
    colorDim: 'var(--cyan-dim)',
    colorBorder: 'var(--cyan-border)',
    steps: [
      'Evacuate upwind immediately — move in the direction the wind is blowing',
      'Cover nose and mouth with a wet cloth to filter particles',
      'Do not use any electrical switches — sparks can ignite gas',
      'Do not re-enter until hazmat team gives all-clear signal',
      'Remove contaminated clothing and wash skin with large amounts of water',
      'Seek medical attention even if symptoms seem mild at first',
    ],
    dos: ['Move upwind fast', 'Cover nose and mouth', 'Call emergency services', 'Wash skin with water'],
    donts: ['Use electrical switches', 'Breathe deeply near leak', 'Re-enter without clearance', 'Ignore mild symptoms'],
    contacts: [{ label: 'Emergency', number: '112' }, { label: 'Poison Control', number: '1800-11-6117' }, { label: 'Fire', number: '101' }],
  },
  {
    id: 'tsunami',
    emoji: '🌊',
    title: 'TSUNAMI',
    subtitle: 'Giant ocean waves from earthquakes or eruptions',
    risk: 'HIGH',
    riskColor: 'var(--red)',
    category: 'natural',
    color: 'var(--blue)',
    colorDim: 'var(--blue-dim)',
    colorBorder: 'var(--blue-border)',
    steps: [
      'If you feel a strong earthquake near the coast, move inland immediately',
      'If the sea suddenly recedes, this is a warning — evacuate to high ground now',
      'Move to at least 30 meters above sea level or 3km inland',
      'Stay away from shore until official all-clear — multiple waves come in series',
      'Do not return to collect belongings — the first wave is rarely the largest',
      'Listen to emergency broadcasts and follow all official instructions',
    ],
    dos: ['Move to high ground now', 'Go at least 30m elevation', 'Wait for official all-clear', 'Help others evacuate'],
    donts: ['Watch from the shore', 'Return for belongings', 'Assume first wave is last', 'Use coastal roads'],
    contacts: [{ label: 'NDMA', number: '1078' }, { label: 'Emergency', number: '112' }, { label: 'Coast Guard', number: '1554' }],
  },
];

const EMERGENCY_NUMBERS = [
  { icon: '🆘', name: 'All Emergencies', number: '112',          color: 'var(--red)'    },
  { icon: '🚑', name: 'Ambulance',       number: '108',          color: 'var(--green)'  },
  { icon: '🚒', name: 'Fire Brigade',    number: '101',          color: 'var(--orange)' },
  { icon: '👮', name: 'Police',          number: '100',          color: 'var(--blue)'   },
  { icon: '🛡️', name: 'NDMA Helpline',  number: '1078',         color: 'var(--violet)' },
  { icon: '🪖', name: 'NDRF Control',   number: '011-24363260', color: 'var(--amber)'  },
  { icon: '🌊', name: 'Coast Guard',    number: '1554',          color: 'var(--cyan)'   },
  { icon: '☠️', name: 'Poison Control', number: '1800-11-6117', color: 'var(--red)'    },
];

const KIT_ITEMS = [
  { icon: '💧', label: '3 litres water per person per day (3 day supply)' },
  { icon: '🥫', label: 'Non-perishable food — 3 day supply' },
  { icon: '🔦', label: 'Torch with extra batteries' },
  { icon: '🩺', label: 'First aid kit and personal medications' },
  { icon: '📄', label: 'Copies of important documents (ID, insurance)' },
  { icon: '🔋', label: 'Power bank and phone charger' },
  { icon: '📻', label: 'Battery-powered or hand-crank radio' },
  { icon: '🪢', label: 'Rope, tape, and basic tools' },
  { icon: '🧯', label: 'Fire extinguisher (ABC type)' },
  { icon: '🫁', label: 'Face masks N95 or better' },
  { icon: '🗺️', label: 'Physical map of your local area' },
  { icon: '💰', label: 'Emergency cash — ATMs may be offline' },
];

const CATEGORIES = [
  { id: 'all',        label: 'ALL',        color: '#ef4444' },
  { id: 'natural',    label: 'NATURAL',    color: '#3b82f6' },
  { id: 'medical',    label: 'MEDICAL',    color: '#10b981' },
  { id: 'industrial', label: 'INDUSTRIAL', color: '#06b6d4' },
];

export default function EmergencyGuide() {
  const navigate            = useNavigate();
  const [category, setCategory] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [checked,  setChecked]  = useState({});

  const filtered = category === 'all'
    ? DISASTERS
    : DISASTERS.filter(d => d.category === category);

  const toggleCheck = (idx) => setChecked(prev => ({ ...prev, [idx]: !prev[idx] }));
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div className="app-shell">

      {/* ── Topbar ── */}
      <div className="topbar">
        <div className="topbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-pulse" />
          <span className="logo-text">COMMUNITY<span>SHIELD</span></span>
        </div>

        <nav className="topbar-nav">
          <button className="nav-link" onClick={() => navigate(-1)}>
            <div className="nav-dot" style={{ background: 'var(--text3)' }} />
            BACK
          </button>
          <button className="nav-link active">
            <div className="nav-dot" style={{ background: 'var(--green)' }} />
            EMERGENCY GUIDE
          </button>
        </nav>

        <div className="topbar-right">
          <span className="status-pill pill-live">● LIVE</span>
          <button className="btn-back" onClick={() => navigate('/')}>← EXIT</button>
        </div>
      </div>

      {/* ── Page body ── */}
      <div className="guide-layout">
        <div className="guide-inner">

          {/* Hero */}
          <div className="guide-hero">
            <div className="guide-hero-icon">🛡️</div>
            <h1 className="guide-hero-title">
              EMERGENCY<br /><span>GUIDE</span>
            </h1>
            <p className="guide-hero-sub">
              Life-saving procedures for natural disasters, medical emergencies,
              and industrial accidents. Know what to do before disaster strikes.
            </p>
            <div className="guide-hotline">🆘 &nbsp;NATIONAL EMERGENCY: 112</div>
          </div>

          {/* Category tabs */}
          <div className="guide-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`guide-tab ${category === cat.id ? 'active' : ''}`}
                style={category === cat.id
                  ? { background: cat.color, borderColor: cat.color, color: '#fff' }
                  : {}}
                onClick={() => setCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Disaster cards */}
          <div className="guide-grid">
            {filtered.map((d, i) => {
              const isOpen = expanded === d.id;
              return (
                <div
                  key={d.id}
                  className="guide-card"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {/* Header — always visible */}
                  <div
                    className="guide-card-header"
                    onClick={() => setExpanded(isOpen ? null : d.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="guide-card-emoji">{d.emoji}</div>
                    <div className="guide-card-info">
                      <div className="guide-card-title" style={{ color: d.color }}>
                        {d.title}
                      </div>
                      <div className="guide-card-subtitle">{d.subtitle}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <span
                        className="guide-risk-badge"
                        style={{
                          color: d.riskColor,
                          background: `${d.riskColor}18`,
                          borderColor: `${d.riskColor}44`,
                        }}
                      >
                        {d.risk} RISK
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)', fontSize: 14,
                        color: 'var(--text3)',
                        display: 'inline-block',
                        transition: 'transform 0.2s',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}>
                        ▾
                      </span>
                    </div>
                  </div>

                  {/* Expanded body */}
                  {isOpen && (
                    <div className="guide-card-body" style={{ animation: 'fadeUp 0.25s ease' }}>

                      <div className="guide-section-title" style={{ color: d.color }}>
                        IMMEDIATE ACTION STEPS
                      </div>
                      <ol className="guide-steps">
                        {d.steps.map((step, si) => (
                          <li key={si}>
                            <span
                              className="step-num"
                              style={{
                                background: `${d.color}22`,
                                color: d.color,
                                border: `1px solid ${d.color}44`,
                              }}
                            >
                              {si + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>

                      <div className="guide-section-title" style={{ color: d.color, marginTop: 6 }}>
                        DOS AND DONTS
                      </div>
                      <div className="dos-donts">
                        <div className="do-list">
                          <div className="dd-title">✓ DO</div>
                          {d.dos.map((item, di) => (
                            <div key={di} className="dd-item">
                              <span style={{ color: 'var(--green)', flexShrink: 0 }}>✓</span>
                              {item}
                            </div>
                          ))}
                        </div>
                        <div className="dont-list">
                          <div className="dd-title">✗ DON'T</div>
                          {d.donts.map((item, di) => (
                            <div key={di} className="dd-item">
                              <span style={{ color: 'var(--red)', flexShrink: 0 }}>✗</span>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="guide-section-title" style={{ color: d.color, marginTop: 14 }}>
                        EMERGENCY CONTACTS
                      </div>
                      <div className="guide-contacts">
                        {d.contacts.map((c, ci) => (
                          <div
                            key={ci}
                            className="guide-contact-chip"
                            style={{
                              color: d.color,
                              background: `${d.color}12`,
                              borderColor: `${d.color}40`,
                            }}
                          >
                            📞 <strong>{c.label}:</strong>&nbsp;{c.number}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Collapsed preview */}
                  {!isOpen && (
                    <div style={{ padding: '12px 22px 16px', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      {d.contacts.map((c, ci) => (
                        <span key={ci} style={{
                          fontFamily: 'var(--font-mono)', fontSize: 10,
                          color: 'var(--text3)', background: 'var(--bg3)',
                          border: '1px solid var(--border)',
                          padding: '3px 9px', borderRadius: 4,
                        }}>
                          {c.label}: {c.number}
                        </span>
                      ))}
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)', fontSize: 10,
                          color: d.color, marginLeft: 'auto', cursor: 'pointer',
                        }}
                        onClick={() => setExpanded(d.id)}
                      >
                        TAP FOR STEPS →
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Emergency Numbers */}
          <div className="numbers-section">
            <div className="numbers-title">📞 EMERGENCY NUMBERS</div>
            <div className="numbers-sub">Save these numbers on your phone right now. Every second counts.</div>
            <div className="numbers-grid">
              {EMERGENCY_NUMBERS.map((n, i) => (
                <div key={i} className="number-card">
                  <div className="number-icon">{n.icon}</div>
                  <div className="number-name">{n.name}</div>
                  <div className="number-val" style={{ color: n.color }}>{n.number}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Kit Checklist */}
          <div className="kit-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div className="numbers-title">🎒 EMERGENCY KIT CHECKLIST</div>
                <div className="numbers-sub">
                  Every household needs a 72-hour emergency kit. Tick off what you have.
                </div>
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 12,
                color: checkedCount === KIT_ITEMS.length ? 'var(--green)' : 'var(--amber)',
                background: checkedCount === KIT_ITEMS.length ? 'var(--green-dim)' : 'var(--amber-dim)',
                border: `1px solid ${checkedCount === KIT_ITEMS.length ? 'var(--green-border)' : 'var(--amber-border)'}`,
                padding: '8px 16px', borderRadius: 'var(--radius)',
              }}>
                {checkedCount}/{KIT_ITEMS.length} READY
              </div>
            </div>

            <div className="kit-grid">
              {KIT_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className={`kit-item ${checked[i] ? 'checked' : ''}`}
                  onClick={() => toggleCheck(i)}
                >
                  <div className="kit-checkbox">{checked[i] ? '✓' : ''}</div>
                  <div>
                    <div style={{ fontSize: 18, marginBottom: 3 }}>{item.icon}</div>
                    <div className="kit-label">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {checkedCount === KIT_ITEMS.length && (
              <div style={{
                marginTop: 20, textAlign: 'center',
                background: 'var(--green-dim)', border: '1px solid var(--green-border)',
                borderRadius: 'var(--radius-lg)', padding: 16,
                fontFamily: 'var(--font-display)', fontSize: 18,
                color: 'var(--green)', letterSpacing: 2,
                animation: 'fadeUp 0.3s ease',
              }}>
                YOUR EMERGENCY KIT IS COMPLETE — YOU ARE PREPARED!
              </div>
            )}
          </div>

          {/* CTA footer */}
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--red-border)',
            borderRadius: 'var(--radius-xl)', padding: '36px 40px',
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 20,
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 26,
                fontWeight: 700, letterSpacing: 2, marginBottom: 6,
              }}>
                IN AN ACTIVE EMERGENCY?
              </div>
              <div style={{ color: 'var(--text2)', fontSize: 14 }}>
                Do not wait — send an SOS alert now. Rescue teams are monitoring 24/7.
              </div>
            </div>
            <button
              onClick={() => navigate('/citizen')}
              style={{
                padding: '14px 32px', background: 'var(--red)',
                border: 'none', borderRadius: 'var(--radius-lg)',
                color: '#fff', fontFamily: 'var(--font-display)',
                fontSize: 20, fontWeight: 700, letterSpacing: 2,
                cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#f87171'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--red)';  e.currentTarget.style.transform = 'none'; }}
            >
              SEND SOS NOW
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}