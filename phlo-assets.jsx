// Asset Utilisation screen

const { useEffect, useRef } = React;

function AssetsScreen() {
  const utilChartRef = useRef(null);
  const tcoChartRef = useRef(null);
  const utilChart = useRef(null);
  const tcoChart = useRef(null);

  useEffect(() => {
    const ctx1 = utilChartRef.current.getContext('2d');
    const labels = ['Water Trucks', 'Service Trucks', 'Diesel Tankers', 'Crane Trucks', 'Mine Buses', 'Trailers', 'Generators', 'Light Vehicles'];
    const values = [61, 84, 72, 91, 55, 47, 68, 79];
    const colors = values.map(v => v >= 75 ? 'rgba(212,32,39,0.7)' : v >= 55 ? 'rgba(232,144,10,0.65)' : 'rgba(229,57,53,0.35)');
    const borders = values.map(v => v >= 75 ? '#D42027' : v >= 55 ? '#E8900A' : '#E53935');

    utilChart.current = new Chart(ctx1, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Utilisation %',
          data: values,
          backgroundColor: colors,
          borderColor: borders,
          borderWidth: 1,
          borderRadius: 3,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, titleColor: '#111', bodyColor: '#555',
            callbacks: { label: ctx => ` ${ctx.parsed.y}% utilisation` },
          },
          annotation: {},
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#777', font: { size: 11 } } },
          y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#999', callback: v => `${v}%` }, max: 100,
            afterDraw: chart => {
              const ctx = chart.ctx;
              const yScale = chart.scales.y;
              const xScale = chart.scales.x;
              ctx.save();
              ctx.setLineDash([4, 4]);
              ctx.strokeStyle = 'rgba(245,166,35,0.4)';
              ctx.lineWidth = 1;
              const y55 = yScale.getPixelForValue(55);
              ctx.beginPath(); ctx.moveTo(xScale.left, y55); ctx.lineTo(xScale.right, y55); ctx.stroke();
              ctx.restore();
            },
          },
        },
      },
    });

    // TCO comparison chart
    const ctx2 = tcoChartRef.current.getContext('2d');
    tcoChart.current = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Water\n6×6 18KL', 'Water\n4×4 10KL', 'Service\nP18000', 'Service\nP5000', 'Diesel\nTanker'],
        datasets: [
          { label: 'Depreciation', data: [3800, 2400, 4200, 2800, 3100], backgroundColor: 'rgba(212,32,39,0.55)', stack: 'tco' },
          { label: 'Maintenance', data: [1200, 900, 1800, 1100, 1400], backgroundColor: 'rgba(245,166,35,0.5)', stack: 'tco' },
          { label: 'Insurance & Rego', data: [420, 310, 480, 360, 400], backgroundColor: 'rgba(123,140,222,0.5)', stack: 'tco' },
          { label: 'Transport / Rebalancing', data: [280, 180, 320, 220, 260], backgroundColor: 'rgba(255,90,90,0.4)', stack: 'tco' },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#777', font: { family: 'Manrope', size: 11 }, boxWidth: 10 } },
          tooltip: {
            backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, titleColor: '#111', bodyColor: '#555',
            callbacks: { label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}/mo` },
          },
        },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: '#777', font: { size: 11 } } },
          y: { stacked: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#999', callback: v => `$${(v/1000).toFixed(0)}K` } },
        },
      },
    });

    return () => { utilChart.current?.destroy(); tcoChart.current?.destroy(); };
  }, []);

  const fleetLocations = [
    { city: 'Perth', x: 12, y: 68, count: 14, active: 11 },
    { city: 'Karratha', x: 14, y: 30, count: 9, active: 4 },
    { city: 'Port Hedland', x: 20, y: 23, count: 7, active: 6 },
    { city: 'Kalgoorlie', x: 25, y: 62, count: 6, active: 5 },
    { city: 'Newman', x: 22, y: 40, count: 5, active: 4 },
    { city: 'Brisbane', x: 85, y: 55, count: 4, active: 4 },
    { city: 'Sydney', x: 82, y: 72, count: 3, active: 3 },
    { city: 'Darwin', x: 38, y: 10, count: 2, active: 2 },
    { city: 'Adelaide', x: 58, y: 75, count: 2, active: 2 },
  ];

  const rentVsOwn = [
    { assetClass: 'Water Truck 18KL', breakEven: 55, current: 61, verdict: 'own', saving: null },
    { assetClass: 'Water Truck 10KL (Karratha)', breakEven: 55, current: 31, verdict: 'divest', saving: '$44K/yr' },
    { assetClass: 'Service Truck P18000', breakEven: 48, current: 84, verdict: 'own', saving: null },
    { assetClass: 'Mine Bus 22-seat', breakEven: 60, current: 55, verdict: 'watch', saving: null },
    { assetClass: 'Generator 200kVA', breakEven: 45, current: 47, verdict: 'own', saving: null },
    { assetClass: 'Trailer — Tilt Tray', breakEven: 40, current: 38, verdict: 'divest', saving: '$18K/yr' },
  ];

  const verdictColor = v => v === 'own' ? 'teal' : v === 'divest' ? 'red' : 'amber';

  return (
    <div className="page-content">
      <div style={{ marginBottom: 32 }}>
        <div className="section-eyebrow">Module 02 · Asset Utilisation</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>
          Asset Utilisation & Lifecycle Analyser
        </h1>
        <p className="narrative">
          Plantman's rental fleet of <strong>52 assets</strong> is operating at an average utilisation of <span className="hl">61%</span> across all classes — 
          below the break-even threshold for several asset categories. <strong>12 assets</strong> are running below 40% utilisation, 
          with the most acute concentration in <strong>Karratha (5 water trucks)</strong> where mine site demand has contracted. 
          Geographic rebalancing and selective divestment could generate <span className="hl">$220K in annual savings</span>.
        </p>
      </div>

      <div className="insight-box">
        <p>
          <strong>Headline finding:</strong> 12 of Plantman's 47 rental water trucks had utilisation below 40% over the past 6 months.
          At current depreciation and maintenance costs, <strong>5 of these would be more profitable as short-term dry hires</strong> from a 
          third party when demand spikes, saving <strong>$220K annually</strong>. A further 2 units should be considered for immediate divestment.
        </p>
      </div>

      {/* Fleet map + utilisation by class */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Fleet map */}
        <div className="card">
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Fleet location map</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 16 }}>52 assets across 9 depots · dot size = fleet count · color = utilisation</div>
          <div style={{ position: 'relative', background: '#eaecee', borderRadius: 6, height: 260, overflow: 'hidden' }}>
            {/* Australia outline placeholder */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.05 }}>
              <svg viewBox="0 0 100 80" width="90%" height="90%">
                <path d="M15,45 Q18,20 30,15 Q45,8 55,12 Q65,10 72,18 Q80,22 82,35 Q85,48 80,58 Q75,68 65,70 Q52,75 40,70 Q28,68 20,60 Q13,54 15,45Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8"/>
              </svg>
            </div>
            {/* Australia simplified outline */}
            <svg viewBox="0 0 100 85" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <path d="M14,42 Q13,30 18,22 Q24,14 32,12 Q42,8 52,11 Q62,9 70,16 Q78,20 82,32 Q86,44 82,55 Q78,65 70,70 Q58,76 46,73 Q34,70 24,62 Q15,55 14,42Z" 
                fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.12)" strokeWidth="0.5"/>
              {/* Northern Territory nub */}
              <path d="M37,12 Q38,8 42,7 Q46,6 48,9 Q46,11 42,12Z" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.12)" strokeWidth="0.5"/>
            </svg>
            {fleetLocations.map((loc, i) => {
              const util = Math.round((loc.active / loc.count) * 100);
              const color = util >= 75 ? '#11EDC5' : util >= 50 ? '#F5A623' : '#FF5A5A';
              const size = Math.max(12, loc.count * 3);
              return (
                <div key={i} title={`${loc.city}: ${loc.active}/${loc.count} active`} style={{
                  position: 'absolute', left: `${loc.x}%`, top: `${loc.y}%`,
                  transform: 'translate(-50%,-50%)',
                  width: size, height: size, borderRadius: '50%',
                  background: color + '30', border: `2px solid ${color}`,
                  boxShadow: `0 0 8px ${color}50`,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: size - 6, height: size - 6, borderRadius: '50%', background: color + '60' }}/>
                </div>
              );
            })}
            {fleetLocations.map((loc, i) => (
              <div key={`lbl-${i}`} style={{
                position: 'absolute', left: `${loc.x}%`, top: `${loc.y + 5}%`,
                transform: 'translateX(-50%)',
                fontSize: 9, color: 'rgba(0,0,0,0.35)', whiteSpace: 'nowrap',
              }}>{loc.city} ({loc.active}/{loc.count})</div>
            ))}
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 10, color: 'var(--text-3)' }}>
            {[['#11EDC5','≥75% util'],['#F5A623','50–74%'],['#FF5A5A','< 50%']].map(([c,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }}/>
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* Utilisation by class */}
        <ChartBox title="Utilisation by asset class" subtitle="Dashed line = 55% break-even threshold" height={280}>
          <canvas ref={utilChartRef}/>
        </ChartBox>
      </div>

      {/* TCO + rent vs own */}
      <div className="grid-2" style={{ marginBottom: 20 }}>
        <ChartBox title="Total cost of ownership per asset class" subtitle="Monthly cost stack: depreciation + maintenance + insurance + transport ($)" height={260}>
          <canvas ref={tcoChartRef}/>
        </ChartBox>

        <div className="card">
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Rent vs. own decision matrix</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 16 }}>Verdict updates dynamically as utilisation and market rates change</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset Class</th>
                <th>Break-even</th>
                <th>Current util.</th>
                <th>Verdict</th>
                <th>Saving</th>
              </tr>
            </thead>
            <tbody>
              {rentVsOwn.map((r, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text)', fontWeight: 500, fontSize: 12 }}>{r.assetClass}</td>
                  <td style={{ color: 'var(--text-3)' }}>{r.breakEven}%</td>
                  <td style={{ color: r.current >= r.breakEven ? 'var(--teal)' : 'var(--red)', fontWeight: 600 }}>{r.current}%</td>
                  <td><Tag color={verdictColor(r.verdict)}>{r.verdict}</Tag></td>
                  <td style={{ color: 'var(--teal)', fontWeight: 600 }}>{r.saving || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="divider"/>
      <div className="section-eyebrow" style={{ marginBottom: 12 }}>Consultant Notes</div>
      <ConsultantNote author="Daniel — Phlo" date="18 April 2026">
        The Karratha situation is structural. I've spoken to two contacts at Fortescue and the Cloudbreak ramp-down looks like it's running 18+ months. 
        The 5 idle water trucks sitting up there are costing ~$27K/month in TCO with almost no revenue offset. My recommendation is to 
        bring 3 units south to Perth immediately and list the other 2 on the used market at current replacement-cycle value before depreciation erodes the position further.
      </ConsultantNote>
    </div>
  );
}

Object.assign(window, { AssetsScreen });
