import React, { useState, useRef, useEffect } from 'react';

// Rule-based emergency knowledge base — works fully offline
const KB = [
  {
    keywords: ['flood', 'flooding', 'water', 'inundation'],
    answer: '🌊 FLOOD SAFETY:\n• Move immediately to higher ground\n• Never walk through floodwater (6 inches can knock you down)\n• Avoid bridges over fast-moving water\n• Turn off utilities at main switches\n• Call NDRF: 011-24363260 | Emergency: 112',
  },
  {
    keywords: ['fire', 'burning', 'smoke', 'flame', 'wildfire'],
    answer: '🔥 FIRE SAFETY:\n• Alert everyone and evacuate immediately\n• Stay low under smoke — crawl if needed\n• Feel doors before opening (if hot, don\'t open)\n• Never use elevator during fire\n• Call Fire: 101 | Emergency: 112',
  },
  {
    keywords: ['earthquake', 'tremor', 'quake', 'shaking'],
    answer: '🌍 EARTHQUAKE SAFETY:\n• DROP — COVER — HOLD ON immediately\n• Get under sturdy desk/table or against interior wall\n• Stay away from windows, glass, and heavy furniture\n• After shaking stops, evacuate carefully\n• Call NDMA: 1078 | Emergency: 112',
  },
  {
    keywords: ['cyclone', 'hurricane', 'storm', 'typhoon', 'wind'],
    answer: '🌀 CYCLONE SAFETY:\n• Seek shelter in a sturdy building immediately\n• Move away from coastal areas and low-lying land\n• Close all windows and doors\n• Store water and food for 3 days\n• Call NDRF: 011-24363260 | Emergency: 112',
  },
  {
    keywords: ['landslide', 'mudslide', 'debris', 'slope', 'hill'],
    answer: '⛰️ LANDSLIDE SAFETY:\n• Move away from the slope path quickly\n• Listen for unusual sounds (cracking trees, boulders)\n• Never cross a landslide — unstable ground may continue\n• Alert neighbours and call local authorities\n• Emergency: 112 | NDMA: 1078',
  },
  {
    keywords: ['medical', 'injured', 'hurt', 'bleeding', 'unconscious', 'heart', 'breathe'],
    answer: '🏥 MEDICAL EMERGENCY:\n• Call ambulance: 108 immediately\n• If unconscious and not breathing, start CPR\n• For bleeding: apply firm pressure with clean cloth\n• Do not move a person with suspected spinal injury\n• Keep patient warm and calm until help arrives',
  },
  {
    keywords: ['chemical', 'gas', 'toxic', 'leak', 'poison', 'fumes'],
    answer: '☣️ CHEMICAL/GAS EMERGENCY:\n• Move upwind away from the source immediately\n• Cover nose/mouth with wet cloth\n• Do not use electrical switches (may spark)\n• Evacuate the area and warn others\n• Call Emergency: 112 | Poison Control: 1800-11-6117',
  },
  {
    keywords: ['first aid', 'cpr', 'rescue', 'help', 'emergency kit'],
    answer: '🆘 FIRST AID BASICS:\n• CPR: 30 chest compressions + 2 rescue breaths\n• Bleeding: direct pressure for 10+ minutes\n• Burns: cool with running water for 10 minutes\n• Fracture: immobilize and do not straighten\n• Choking: 5 back blows + 5 abdominal thrusts',
  },
  {
    keywords: ['evacuate', 'evacuation', 'escape', 'leave', 'run'],
    answer: '🚪 EVACUATION GUIDELINES:\n• Grab emergency kit (water, food, medicine, documents)\n• Follow official evacuation routes\n• Help elderly, children, and disabled people\n• Do not return until authorities say it is safe\n• Notify family of your evacuation route',
  },
  {
    keywords: ['kit', 'prepare', 'stock', 'supply', 'bag', 'ready'],
    answer: '🎒 EMERGENCY KIT ESSENTIALS:\n• 3 litres of water per person per day (3 day supply)\n• Non-perishable food (3 day supply)\n• Torch + extra batteries\n• First aid kit + medications\n• Copies of important documents\n• Phone charger + power bank\n• Whistle to signal for help',
  },
  {
    keywords: ['contact', 'number', 'call', 'helpline', 'hotline'],
    answer: '📞 EMERGENCY CONTACTS (INDIA):\n• Emergency: 112\n• Ambulance: 108\n• Fire: 101\n• Police: 100\n• NDMA Helpline: 1078\n• NDRF: 011-24363260\n• Disaster Helpline: 1070\n• Poison Control: 1800-11-6117',
  },
];

function getResponse(input) {
  const lower = input.toLowerCase();
  for (const entry of KB) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.answer;
    }
  }
  return '🛡️ I can help with emergency procedures for:\n\n• Flood • Fire • Earthquake\n• Cyclone • Landslide • Medical\n• Chemical emergencies • First Aid\n• Evacuation • Emergency kit\n• Emergency contact numbers\n\nType any of these topics for instant guidance. For immediate help call 112.';
}

export default function Chat() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    text: '🛡️ CommunityShield Emergency Assistant ready.\n\nAsk me about: flood safety, fire evacuation, earthquake procedures, first aid, emergency contacts, or disaster preparedness.',
  }]);
  const [input,   setInput]   = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');

    const userMsg = { role: 'user', text };
    const botMsg  = { role: 'assistant', text: getResponse(text) };
    setMessages(prev => [...prev, userMsg, botMsg]);
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '12px 16px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}
          >
            <div style={{
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              background: m.role === 'user' ? 'var(--blue-dim)' : 'var(--bg4)',
              border: `1px solid ${m.role === 'user' ? 'var(--blue-border)' : 'var(--border)'}`,
              fontSize: 13,
              lineHeight: 1.65,
              color: 'var(--text)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div style={{
        padding: '8px 14px',
        display: 'flex', gap: 6, flexWrap: 'wrap',
        borderTop: '1px solid var(--border)',
      }}>
        {['Flood safety', 'Fire escape', 'First aid', 'Emergency numbers'].map(q => (
          <button
            key={q}
            type="button"
            onClick={() => { setInput(q); }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              padding: '4px 10px', border: '1px solid var(--border)',
              borderRadius: 4, background: 'transparent',
              color: 'var(--text3)', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.color = 'var(--text2)'; e.target.style.borderColor = 'var(--border2)'; }}
            onMouseLeave={e => { e.target.style.color = 'var(--text3)'; e.target.style.borderColor = 'var(--border)'; }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div style={{
        padding: '10px 14px',
        borderTop: '1px solid var(--border)',
        display: 'flex', gap: 8,
      }}>
        <input
          className="field-input"
          style={{ flex: 1 }}
          placeholder="Ask about emergency procedures..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          type="button"
          onClick={send}
          disabled={!input.trim()}
          style={{
            padding: '10px 16px',
            background: 'var(--blue)',
            border: 'none',
            borderRadius: 'var(--radius)',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: 1,
            opacity: !input.trim() ? 0.4 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          SEND
        </button>
      </div>
    </div>
  );
}