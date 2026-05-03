// Shared components for Phlo Insights

const { useState, useEffect, useRef } = React;

// ── Nav ──────────────────────────────────────────────────────────────────────
function PhloNav({ active, setActive }) {
  const tabs = [
    { id: 'overview', label: 'Executive Overview' },
    { id: 'procurement', label: 'Procurement' },
    { id: 'assets', label: 'Asset Utilisation' },
    { id: 'cashflow', label: 'Cashflow' },
    { id: 'jobs', label: 'Job Profitability' },
    { id: 'pipeline', label: 'Sales Pipeline' },
  ];

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(247,247,245,0.96)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', gap: 24, minHeight: 56 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 17.44" style={{ height: 18, width: 'auto', display: 'block' }}>
            <g>
              <path fill="#e53f30" d="M30.08,13.4h9.36v4H23.49V0h6.59ZM72.32,4.07h.25l6.51,13.35H89.51V0H83.39l.36,13.41h-.24L76.92,0H66.56V17.44h6.09Zm31.93,0h6.65V0H91.34v4h6.33V17.44h6.58Zm13.85,0h.18l5.64,13.36H129l5.6-13.36h.2l-.59,13.36h5.89V0h-9.56l-4,10.89h-.2L122.13,0H112.8V17.44h5.88Zm55.79,0h.24l6.5,13.39h10.45V0H185l.37,13.39h-.25L178.48,0H168.13V17.44h6.12ZM15,3.52V7.05L12.27,9.81H6.58V3.52Zm1.16,10.12,4.91-4.86V0H0V17.44H6.58V13.63Zm40.44,3.8v-3H48v3H41.31V5.86L47.26,0H63.18V17.44Zm0-7.2V3.52H51.76L48.19,7.05v3.19ZM158,17.44v-3h-8.64v3h-6.65V5.86L148.69,0H164.6V17.44Zm0-7.2V3.52h-4.84l-3.57,3.53v3.19ZM197.15.74a2.32,2.32,0,0,0-1.73.71,2.3,2.3,0,0,0-.72,1.7,2.34,2.34,0,0,0,.71,1.72,2.47,2.47,0,0,0,3.47,0,2.31,2.31,0,0,0,.72-1.72,2.3,2.3,0,0,0-.72-1.7,2.35,2.35,0,0,0-1.73-.71M200,3.15a2.71,2.71,0,0,1-.83,2,2.9,2.9,0,0,1-4,0,2.7,2.7,0,0,1-.82-2,2.67,2.67,0,0,1,.83-2,2.77,2.77,0,0,1,2-.82,2.81,2.81,0,0,1,2,.82,2.69,2.69,0,0,1,.83,2m-2.1-.61a.46.46,0,0,0-.21-.45A1.4,1.4,0,0,0,197,2h-.47V3.09h.5a1.38,1.38,0,0,0,.52-.07.47.47,0,0,0,.33-.48m-.81-.94a2.31,2.31,0,0,1,.86.12.75.75,0,0,1,.48.77.67.67,0,0,1-.3.61,1.18,1.18,0,0,1-.46.15.76.76,0,0,1,.54.3.8.8,0,0,1,.17.48v.22a1.77,1.77,0,0,0,0,.23.28.28,0,0,0,0,.16l0,0h-.52V4.62l0-.1V4.27a.75.75,0,0,0-.29-.7,1.31,1.31,0,0,0-.62-.1h-.43V4.68H196V1.6Z"/>
            </g>
          </svg>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 12, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Insights</span>
        </div>

        {/* Tabs */}
        <nav style={{ display: 'flex', gap: 2, flex: '1 1 0', minWidth: 0, flexWrap: 'wrap', alignItems: 'center' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px 14px', borderRadius: 5, whiteSpace: 'nowrap',
              fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: active === t.id ? 600 : 400,
              color: active === t.id ? 'var(--teal)' : 'var(--text-3)',
              transition: 'color 0.15s',
              position: 'relative',
            }}>
              {t.label}
              {active === t.id && (
                <div style={{ position: 'absolute', bottom: -1, left: 8, right: 8, height: 2, background: 'var(--teal)', borderRadius: 1 }}/>
              )}
            </button>
          ))}
        </nav>

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span className="dot dot-green" style={{ boxShadow: '0 0 6px #22a85a' }}/>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>Live · Synced 2h ago</span>
        </div>
      </div>
    </header>
  );
}

// ── Metric card ───────────────────────────────────────────────────────────────
function MetricCard({ label, value, delta, deltaLabel, teal, suffix = '' }) {
  const pos = delta > 0;
  return (
    <div className="card card-sm" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div className="label">{label}</div>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 700, color: teal ? 'var(--teal)' : 'var(--text)', lineHeight: 1.1 }}>
        {value}{suffix}
      </div>
      {delta !== undefined && (
        <div style={{ fontSize: 11, color: pos ? 'var(--teal)' : 'var(--red)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
          {pos ? '↑' : '↓'} {Math.abs(delta)}{deltaLabel}
          <span style={{ color: 'var(--text-3)', fontWeight: 400, marginLeft: 2 }}>vs prior qtr</span>
        </div>
      )}
    </div>
  );
}

// ── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 160, strokeWidth = 10 }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - score / 100);
  const color = score >= 75 ? '#22a85a' : score >= 55 ? 'var(--amber)' : 'var(--red)';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={fill} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s' }}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: size === 160 ? 42 : 32, fontWeight: 700, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>/ 100</div>
      </div>
    </div>
  );
}

// ── Module scorecard ──────────────────────────────────────────────────────────
function ModuleCard({ label, score, delta, keyMetric, topInsight, onClick }) {
  const color = score >= 75 ? '#22a85a' : score >= 55 ? 'var(--amber)' : 'var(--red)';
  return (
    <div className="card" style={{ cursor: 'pointer', transition: 'border-color 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
      onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div className="label">{label}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color }}>{score}</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>/100</span>
        </div>
      </div>
      <div style={{ height: 3, background: 'rgba(0,0,0,0.07)', borderRadius: 2, marginBottom: 14 }}>
        <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 2, transition: 'width 0.8s ease' }}/>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>{keyMetric}</div>
      <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, textWrap: 'pretty' }}>{topInsight}</div>
      <div style={{ marginTop: 14, fontSize: 11, color, fontWeight: 600 }}>
        {delta > 0 ? `↑ ${delta} pts` : `↓ ${Math.abs(delta)} pts`} this quarter →
      </div>
    </div>
  );
}

// ── Inline horizontal bar chart ───────────────────────────────────────────────
function BarRow({ label, value, max, format, color }) {
  const pct = (value / max) * 100;
  const c = color || 'var(--teal)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <div style={{ width: 160, fontSize: 12, color: 'var(--text-2)', flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
      <div style={{ flex: 1, height: 5, background: 'rgba(0,0,0,0.07)', borderRadius: 3 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: c, borderRadius: 3, transition: 'width 0.8s ease' }}/>
      </div>
      <div style={{ width: 60, fontSize: 12, fontWeight: 600, color: c, textAlign: 'right', flexShrink: 0 }}>{format ? format(value) : value}</div>
    </div>
  );
}

// ── Tag / badge ───────────────────────────────────────────────────────────────
function Tag({ children, color }) {
  const bg = color === 'teal' ? 'var(--teal-dim)' : color === 'red' ? 'rgba(229,57,53,0.1)' : color === 'amber' ? 'rgba(232,144,10,0.1)' : 'rgba(0,0,0,0.05)';
  const fg = color === 'teal' ? '#b81c21' : color === 'red' ? 'var(--red)' : color === 'amber' ? 'var(--amber)' : 'var(--text-3)';
  return (
    <span style={{ background: bg, color: fg, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4 }}>{children}</span>
  );
}

// ── Chart wrapper ─────────────────────────────────────────────────────────────
function ChartBox({ title, subtitle, children, height = 240 }) {
  return (
    <div className="card" style={{ padding: '20px 24px' }}>
      {title && <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: subtitle ? 2 : 14 }}>{title}</div>}
      {subtitle && <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 14 }}>{subtitle}</div>}
      <div style={{ height }}>{children}</div>
    </div>
  );
}

// ── Consultant note ───────────────────────────────────────────────────────────
function ConsultantNote({ author, date, children }) {
  return (
    <div style={{ borderLeft: '2px solid var(--teal-mid)', paddingLeft: 16, marginBottom: 20 }}>
      <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 6, display: 'flex', gap: 8 }}>
        <span style={{ color: 'var(--teal)', fontWeight: 600 }}>{author}</span>
        <span>·</span>
        <span>{date}</span>
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.65, textWrap: 'pretty' }}>{children}</div>
    </div>
  );
}

Object.assign(window, { PhloNav, MetricCard, ScoreRing, ModuleCard, BarRow, Tag, ChartBox, ConsultantNote });
