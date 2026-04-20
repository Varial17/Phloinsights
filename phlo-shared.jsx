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
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 48px', display: 'flex', alignItems: 'center', gap: 32, height: 56 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect width="22" height="22" rx="4" fill="var(--teal)"/>
            <text x="5" y="16" fontFamily="sans-serif" fontWeight="900" fontSize="14" fill="white">P</text>
          </svg>
          <span style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.01em' }}>Plantman Insights</span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'var(--border2)', flexShrink: 0 }}/>

        {/* Client + period */}
        <div style={{ flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>Plantman Equipment</span>
          <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 8 }}>Q1 2026</span>
        </div>

        {/* Tabs */}
        <nav style={{ display: 'flex', gap: 2, flex: 1, overflowX: 'auto' }}>
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
