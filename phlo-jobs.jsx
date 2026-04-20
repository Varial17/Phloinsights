// Job Profitability screen

const { useEffect, useRef } = React;

function JobsScreen() {
  const waterfallRef = useRef(null);
  const overrunRef = useRef(null);
  const labourRef = useRef(null);
  const waterfallChart = useRef(null);
  const overrunChart = useRef(null);
  const labourChart = useRef(null);

  useEffect(() => {
    // Waterfall: margin by product line
    const ctx1 = waterfallRef.current.getContext('2d');
    const wfLabels = ['Revenue base', 'P18000 builds', 'P5000 builds', 'Water trucks', 'Service (field)', 'Rental margin', 'Overhead alloc.', 'Net margin'];
    const wfValues =  [100, 18, -4, 14, 8, 22, -15, 0];
    const wfColors = wfValues.map((v, i) => {
      if (i === 0 || i === wfLabels.length - 1) return 'rgba(212,32,39,0.65)';
      return v >= 0 ? 'rgba(212,32,39,0.45)' : 'rgba(255,90,90,0.55)';
    });
    // Compute running totals for waterfall
    let running = 0;
    const starts = wfValues.map((v, i) => {
      if (i === 0 || i === wfLabels.length - 1) return 0;
      const s = running;
      running += v;
      return s;
    });
    starts[wfLabels.length - 1] = 0;
    const netValue = wfValues.slice(1, -1).reduce((a, b) => a + b, wfValues[0]);

    waterfallChart.current = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: wfLabels,
        datasets: [
          { label: 'Base', data: starts.map((s, i) => i === 0 || i === wfLabels.length - 1 ? 0 : s), backgroundColor: 'transparent', borderWidth: 0 },
          { label: 'Value', data: wfValues.map((v, i) => i === wfLabels.length - 1 ? netValue : Math.abs(v)), backgroundColor: wfColors, borderColor: wfColors.map(c => c.replace('0.', '0.9')), borderWidth: 1, borderRadius: 2 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, titleColor: '#111', bodyColor: '#555',
            callbacks: { label: (ctx) => ctx.datasetIndex === 1 ? ` ${wfValues[ctx.dataIndex] >= 0 ? '+' : ''}${wfValues[ctx.dataIndex]}pp margin` : null } },
        },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: '#777', font: { size: 10 }, maxRotation: 30 } },
          y: { stacked: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#999', callback: v => `${v}pp` } },
        },
      },
    });

    // Cost overrun heatmap as grouped bars
    const ctx2 = overrunRef.current.getContext('2d');
    overrunChart.current = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Electrical harness', 'Welding labour', 'Hydraulic install', 'Paint & finish', 'Subframe steel', 'Assembly labour'],
        datasets: [
          { label: 'P5000 overrun %', data: [4.2, 3.8, 2.1, 1.4, 0.8, 1.2], backgroundColor: 'rgba(255,90,90,0.6)', borderColor: '#FF5A5A', borderWidth: 1, borderRadius: 3 },
          { label: 'P18000 overrun %', data: [1.8, 2.4, 3.5, 0.9, 1.1, 2.2], backgroundColor: 'rgba(245,166,35,0.55)', borderColor: '#F5A623', borderWidth: 1, borderRadius: 3 },
        ],
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#777', font: { family: 'Manrope', size: 11 }, boxWidth: 10 } },
          tooltip: { backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, titleColor: '#111', bodyColor: '#555',
            callbacks: { label: ctx => ` ${ctx.parsed.x}% cost overrun` } },
        },
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#999', callback: v => `${v}%` } },
          y: { grid: { display: false }, ticks: { color: '#777', font: { size: 11 } } },
        },
      },
    });

    // Labour efficiency by team
    const ctx3 = labourRef.current.getContext('2d');
    labourChart.current = new Chart(ctx3, {
      type: 'radar',
      data: {
        labels: ['Electrical', 'Welding', 'Hydraulics', 'Assembly', 'Paint', 'QA'],
        datasets: [
          { label: 'Team A (Day shift)', data: [78, 91, 85, 88, 94, 96], borderColor: '#D42027', backgroundColor: 'rgba(212,32,39,0.08)', pointBackgroundColor: '#D42027', borderWidth: 2 },
          { label: 'Team B (Night shift)', data: [62, 74, 80, 71, 88, 82], borderColor: '#F5A623', backgroundColor: 'rgba(245,166,35,0.08)', pointBackgroundColor: '#F5A623', borderWidth: 2 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#777', font: { family: 'Manrope', size: 11 }, boxWidth: 10 } },
          tooltip: { backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, titleColor: '#111', bodyColor: '#555' } },
        scales: {
          r: { grid: { color: 'rgba(0,0,0,0.06)' }, pointLabels: { color: '#777', font: { size: 11 } },
            ticks: { color: 'transparent', backdropColor: 'transparent', stepSize: 25 }, angleLines: { color: 'rgba(0,0,0,0.06)' }, min: 0, max: 100 },
        },
      },
    });

    return () => { waterfallChart.current?.destroy(); overrunChart.current?.destroy(); labourChart.current?.destroy(); };
  }, []);

  const quotingAccuracy = [
    { product: 'P18000 Service Truck', quoted: 485000, actual: 501200, variance: 3.3, trend: 'improving' },
    { product: 'P5000 Service Truck', quoted: 218000, actual: 244160, variance: 12.0, trend: 'worsening' },
    { product: 'Water Truck 18KL', quoted: 312000, actual: 328560, variance: 5.3, trend: 'stable' },
    { product: 'Diesel Tanker 15KL', quoted: 275000, actual: 288750, variance: 5.0, trend: 'stable' },
    { product: 'Mine Bus 22-seat', quoted: 195000, actual: 209350, variance: 7.4, trend: 'worsening' },
  ];

  const trendColor = t => t === 'improving' ? 'teal' : t === 'worsening' ? 'red' : '';
  const trendArrow = t => t === 'improving' ? '↓' : t === 'worsening' ? '↑' : '→';

  return (
    <div className="page-content">
      <div style={{ marginBottom: 32 }}>
        <div className="section-eyebrow">Module 04 · Job Profitability</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>
          Job Costing & Profitability Analyser
        </h1>
        <p className="narrative">
          Analysis of <strong>38 completed builds in Q1 2026</strong> reveals systematic cost overruns concentrated in two cost categories: 
          <span className="hl"> electrical harness rework (4.2% of build cost)</span> and <span className="hl">unplanned welding labour (3.8%)</span>. 
          P5000 service truck builds are averaging <strong>12% cost overrun</strong> against estimate — a pattern that has persisted across 
          8 consecutive builds and is now statistically significant. Standardising the harness routing template 
          could recover <span className="hl">$14K per build</span>.
        </p>
      </div>

      <div className="insight-box">
        <p>
          <strong>Headline finding:</strong> Plantman's P5000 service truck builds have averaged 12% cost overrun over the past 8 builds, 
          primarily driven by electrical harness rework (4.2% of total cost) and unplanned welding labour (3.8%). 
          Standardising the harness routing template could save <strong>$14K per build</strong> — representing <strong>$168K annually</strong> at current build volume.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <ChartBox title="Gross margin waterfall by product line" subtitle="Contribution to overall gross margin in percentage points (pp)" height={260}>
          <canvas ref={waterfallRef}/>
        </ChartBox>
        <ChartBox title="Cost overrun by category — P5000 vs P18000" subtitle="% of total build cost overrun, averaged across recent builds" height={260}>
          <canvas ref={overrunRef}/>
        </ChartBox>
      </div>

      <div className="grid-2-1" style={{ marginBottom: 20 }}>
        {/* Quoting accuracy */}
        <div className="card">
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Quoting accuracy scorecard</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 16 }}>Variance = (actual − quoted) / quoted. Trend = last 3 builds vs prior 3.</div>
          <table className="data-table">
            <thead><tr><th>Product</th><th>Quoted</th><th>Actual (avg)</th><th>Variance</th><th>Trend</th></tr></thead>
            <tbody>
              {quotingAccuracy.map((q, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text)', fontWeight: 500, fontSize: 12 }}>{q.product}</td>
                  <td style={{ color: 'var(--text-2)' }}>${(q.quoted / 1000).toFixed(0)}K</td>
                  <td style={{ color: 'var(--text-2)' }}>${(q.actual / 1000).toFixed(0)}K</td>
                  <td style={{ color: q.variance > 8 ? 'var(--red)' : q.variance > 4 ? 'var(--amber)' : 'var(--teal)', fontWeight: 700 }}>
                    +{q.variance}%
                  </td>
                  <td><span style={{ fontSize: 13, color: trendColor(q.trend) === 'teal' ? 'var(--teal)' : trendColor(q.trend) === 'red' ? 'var(--red)' : 'var(--text-3)', fontWeight: 700 }}>{trendArrow(q.trend)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 13, marginBottom: 12, color: 'var(--text)' }}>P5000 cost breakdown — estimated vs actual</div>
            {[
              { label: 'Materials', est: 58, act: 61 },
              { label: 'Labour', est: 24, act: 29 },
              { label: 'Subcontract', est: 8, act: 7 },
              { label: 'Overhead', est: 10, act: 9 },
            ].map(r => (
              <div key={r.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', marginBottom: 5 }}>
                  <span>{r.label}</span>
                  <span>Est {r.est}% · Act <span style={{ color: r.act > r.est ? 'var(--red)' : 'var(--teal)', fontWeight: 600 }}>{r.act}%</span></span>
                </div>
                <div style={{ position: 'relative', height: 6, background: 'rgba(0,0,0,0.07)', borderRadius: 3 }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${r.est}%`, background: 'rgba(255,90,90,0.15)', borderRadius: 3 }}/>
                  <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${r.act}%`, background: r.act > r.est ? 'rgba(212,32,39,0.6)' : 'rgba(34,168,90,0.5)', borderRadius: 3 }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Labour radar */}
        <div>
          <ChartBox title="Labour efficiency by team & discipline" subtitle="Score = actual hours / standard hours × 100. Higher = more efficient." height={260}>
            <canvas ref={labourRef}/>
          </ChartBox>
          <div className="card card-sm" style={{ marginTop: 12 }}>
            <div className="label" style={{ marginBottom: 8 }}>Key finding</div>
            <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
              Night shift electrical efficiency is <span style={{ color: 'var(--red)', fontWeight: 600 }}>16 points below day shift</span>. 
              This accounts for approximately 60% of harness rework cost. A targeted training investment in 2 night-shift electricians 
              would have a <span style={{ color: 'var(--teal)', fontWeight: 600 }}>12-week payback period</span>.
            </div>
          </div>
        </div>
      </div>

      <div className="divider"/>
      <div className="section-eyebrow" style={{ marginBottom: 12 }}>Consultant Notes</div>
      <ConsultantNote author="Daniel — Phlo" date="18 April 2026">
        The P5000 overrun pattern is now undeniable. 8 builds, all in the same direction, all with the same root causes. 
        This isn't a one-off — it's a quoting and process issue. I'd recommend a dedicated process review session with the production 
        and estimating teams before the next P5000 is quoted. In the interim, add a 12% contingency buffer to all P5000 quotes to 
        protect margin while the underlying issues are resolved. The harness routing template is a quick win — I can have a draft 
        spec to you within 2 weeks if you give me access to the last 3 approved shop drawings.
      </ConsultantNote>
    </div>
  );
}

Object.assign(window, { JobsScreen });
