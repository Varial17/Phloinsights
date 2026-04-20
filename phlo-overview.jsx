// Executive Overview screen

const { useState, useEffect, useRef } = React;

function OverviewScreen({ score, setScore, setActive }) {

  // Allow external tweak to set score
  useEffect(() => {
    window.__setScore = setScore;
    return () => { delete window.__setScore; };
  }, [setScore]);

  const actions = [
    {
      rank: '01',
      title: 'Shift chassis-adjacent components to staggered PO schedule',
      module: 'Procurement',
      impact: '$85K',
      effort: 'Low',
      owner: 'Procurement Manager',
      status: 'teal',
      desc: 'Components ordered 4.2 weeks early on average. Realigning PO dates to production need-dates frees working capital immediately.',
    },
    {
      rank: '02',
      title: 'Rebalance 5 underutilised water trucks from Karratha to Brisbane',
      module: 'Asset Utilisation',
      impact: '$220K',
      effort: 'Medium',
      owner: 'Fleet Manager',
      status: 'amber',
      desc: '12 water trucks running below 40% utilisation. Brisbane depot shows unmet demand. Rebalancing avoids third-party dry hire costs.',
    },
    {
      rank: '03',
      title: 'Standardise P5000 electrical harness routing template',
      module: 'Job Profitability',
      impact: '$112K',
      effort: 'Medium',
      owner: 'Production Supervisor',
      status: 'teal',
      desc: 'Electrical harness rework accounts for 4.2% of build cost across 8 recent P5000 builds. A standardised template eliminates systematic rework.',
    },
  ];

  const financials = [
    { label: 'Revenue', value: '$8.4M', delta: '+6.2%', pos: true },
    { label: 'Gross Margin', value: '23.4%', delta: '-1.1pp', pos: false },
    { label: 'Cash on Hand', value: '$2.1M', delta: '-$340K', pos: false },
    { label: 'Working Capital', value: '$4.7M', delta: '+$180K', pos: true },
  ];

  return (
    <div className="page-content">

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div className="section-eyebrow">Q1 2026 · Executive Overview</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 36, fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 12, letterSpacing: '-0.02em' }}>
          Business Health Report
        </h1>
        <p className="narrative">
          Plantman Equipment's overall business health <strong>improved 5 points this quarter</strong>, driven by stronger procurement discipline and increased build volume. 
          Key risks remain in <strong>fleet utilisation</strong> and a widening <strong>cash conversion cycle</strong>. 
          The three actions below represent a combined <span className="hl">$417K annualised opportunity</span>.
        </p>
      </div>

      {/* Health score + financials */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, marginBottom: 32 }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 28 }}>
          <div className="label" style={{ letterSpacing: '0.14em' }}>Health Score</div>
          <ScoreRing score={score} size={160}/>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--teal)', fontWeight: 700 }}>↑ 5 pts vs Q4 2025</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 3 }}>Last validated Apr 18</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {financials.map(f => (
            <div key={f.label} className="card card-sm">
              <div className="label" style={{ marginBottom: 8 }}>{f.label}</div>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{f.value}</div>
              <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600, color: f.pos ? 'var(--teal)' : 'var(--red)' }}>
                {f.pos ? '↑' : '↓'} {f.delta} <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>vs prior qtr</span>
              </div>
            </div>
          ))}
          {/* Cash conversion cycle */}
          <div className="card card-sm" style={{ gridColumn: 'span 2' }}>
            <div className="label" style={{ marginBottom: 8 }}>Cash Conversion Cycle</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color: 'var(--red)' }}>84 days</div>
              <div style={{ fontSize: 12, color: 'var(--red)' }}>↑ from 68 days</div>
            </div>
            <div style={{ marginTop: 10 }}>
              <BarRow label="DSO (receivables)" value={52} max={90} format={v => `${v}d`} color="var(--amber)"/>
              <BarRow label="DIO (inventory)" value={41} max={90} format={v => `${v}d`} color="var(--amber)"/>
              <BarRow label="DPO (payables)" value={9} max={90} format={v => `${v}d`} color="var(--teal)"/>
            </div>
          </div>
          {/* Active builds */}
          <div className="card card-sm">
            <div className="label" style={{ marginBottom: 8 }}>Active Builds</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color: 'var(--text)' }}>18</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>4 P18000 · 7 P5000 · 7 other</div>
          </div>
          {/* Fleet utilisation */}
          <div className="card card-sm">
            <div className="label" style={{ marginBottom: 8 }}>Fleet Utilisation</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color: 'var(--amber)' }}>61%</div>
            <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 6 }}>↓ 3pp · 12 assets idle</div>
          </div>
        </div>
      </div>

      <div className="divider"/>

      {/* Top 3 Actions */}
      <div style={{ marginBottom: 40 }}>
        <div className="section-eyebrow">Priority Actions</div>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
          Top 3 recommendations this quarter
        </div>

        {actions.map((a, i) => (
          <div key={i} className="action-item" style={{ cursor: 'pointer' }}
            onClick={() => setActive(a.module === 'Procurement' ? 'procurement' : a.module === 'Asset Utilisation' ? 'assets' : 'jobs')}>
            <div className="action-rank">{a.rank}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>{a.title}</span>
                <Tag color={a.status}>{a.module}</Tag>
                <Tag color="amber">Effort: {a.effort}</Tag>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 6 }}>{a.desc}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Owner: {a.owner}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 16 }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 24, fontWeight: 700, color: 'var(--teal)' }}>{a.impact}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Est. annual</div>
            </div>
          </div>
        ))}
      </div>

      <div className="divider"/>

      {/* Module scorecards */}
      <div style={{ marginBottom: 40 }}>
        <div className="section-eyebrow">Module Performance</div>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Insight module scorecards</div>
        <div className="grid-4">
          <ModuleCard label="Procurement" score={78} delta={8}
            keyMetric="Avg early order: 4.2 weeks"
            topInsight="Axle assemblies ordered 4.2 weeks ahead of production need-date. $85K cashflow opportunity."
            onClick={() => setActive('procurement')}/>
          <ModuleCard label="Asset Utilisation" score={61} delta={-3}
            keyMetric="Fleet utilisation: 61%"
            topInsight="12 water trucks below 40% utilisation. Geographic rebalancing could save $220K annually."
            onClick={() => setActive('assets')}/>
          <ModuleCard label="Cashflow" score={69} delta={2}
            keyMetric="CCC: 84 days (↑ from 68)"
            topInsight="DSO extended 11 days on rental invoices. $1.2M working capital locked in receivables."
            onClick={() => setActive('cashflow')}/>
          <ModuleCard label="Job Profitability" score={74} delta={4}
            keyMetric="P5000 overrun: 12% avg"
            topInsight="Electrical harness rework systematic across 8 recent builds. $14K per build recoverable."
            onClick={() => setActive('jobs')}/>
        </div>
      </div>

      <div className="divider"/>

      {/* Consultant notes */}
      <div>
        <div className="section-eyebrow">Consultant Notes</div>
        <div style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Plantman advisory notes</div>
        <ConsultantNote author="Daniel — Phlo" date="18 April 2026">
          Strong quarter operationally — build volume is up and the procurement team has genuinely tightened their ordering discipline since our Q4 review. 
          The score improvement is real, not just statistical noise. That said, the CCC trend is the thing keeping me up at night. 
          An 84-day cycle for a business with Plantman's working capital base is unsustainable if you're heading into a $3M+ build pipeline in Q2. 
          We need to have a direct conversation with BHP and FMG about payment terms — I don't think this is being pushed hard enough at the account level.
        </ConsultantNote>
        <ConsultantNote author="Daniel — Phlo" date="18 April 2026">
          On the fleet side — the Karratha issue isn't going away. Demand signals we're seeing suggest that site ramp-down is structural, not seasonal. 
          I'd recommend treating the 5 idle water trucks as surplus and modelling the sell vs. redeploy decision before Q2 review. 
          I've flagged this for the asset utilisation module but wanted to call it explicitly here given the dollar magnitude.
        </ConsultantNote>
        <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border2)', borderRadius: 6 }}>
          <div style={{ fontSize: 12, color: 'var(--text-3)', marginBottom: 8, fontWeight: 600 }}>Next review</div>
          <div style={{ fontSize: 13, color: 'var(--text-2)' }}>Scheduled for <strong style={{ color: 'var(--text)' }}>16 July 2026</strong> — Q2 2026 report. Please ensure ERP data extract is run by 14 July.</div>
        </div>
      </div>

    </div>
  );
}

Object.assign(window, { OverviewScreen });
