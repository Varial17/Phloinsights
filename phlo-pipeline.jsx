// Sales Pipeline screen — Build Sales + Rental Sales

const { useState, useEffect, useRef } = React;

// ── Data ─────────────────────────────────────────────────────────────────────

const BUILD_PIPELINE = [
  // Quoting
  { id: 'Q-2601', stage: 'Quoting', product: 'P18000 Service Truck', customer: 'BHP Billiton', value: 498000, submitted: '08 Apr 2026', expectedClose: '02 May 2026', site: 'Newman', margin: 22, probability: 65 },
  { id: 'Q-2602', stage: 'Quoting', product: 'Water Truck 18KL 6×6', customer: 'Rio Tinto', value: 334000, submitted: '11 Apr 2026', expectedClose: '09 May 2026', site: 'Tom Price', margin: 20, probability: 50 },
  { id: 'Q-2603', stage: 'Quoting', product: 'Diesel Tanker 15KL', customer: 'Monadelphous', value: 278000, submitted: '14 Apr 2026', expectedClose: '14 May 2026', site: 'Perth', margin: 24, probability: 70 },
  { id: 'Q-2604', stage: 'Quoting', product: 'P5000 Service Truck', customer: 'NRW Holdings', value: 224000, submitted: '16 Apr 2026', expectedClose: '20 May 2026', site: 'Kalgoorlie', margin: 18, probability: 40 },
  { id: 'Q-2605', stage: 'Quoting', product: 'Mine Bus 22-seat', customer: 'CIMIC Group', value: 198000, submitted: '17 Apr 2026', expectedClose: '22 May 2026', site: 'Darwin', margin: 21, probability: 55 },
  // Confirmed
  { id: 'C-2598', stage: 'Confirmed', product: 'P18000 Service Truck', customer: 'Fortescue Metals', value: 512000, submitted: '18 Mar 2026', expectedClose: '28 Jun 2026', site: 'Port Hedland', margin: 23, probability: 100 },
  { id: 'C-2599', stage: 'Confirmed', product: 'P5000 Service Truck ×2', customer: 'BHP Billiton', value: 448000, submitted: '22 Mar 2026', expectedClose: '15 Jul 2026', site: 'Newman', margin: 19, probability: 100 },
  { id: 'C-2600', stage: 'Confirmed', product: 'Vacuum Truck 10KL', customer: 'Monadelphous', value: 312000, submitted: '01 Apr 2026', expectedClose: '30 Jun 2026', site: 'Perth', margin: 25, probability: 100 },
  // In Production — aligns with 18 active builds on Overview (4 P18000, 7 P5000, 7 other)
  { id: 'P-2580', stage: 'In Production', product: 'P18000 Service Truck', customer: 'Rio Tinto', value: 501000, submitted: '10 Jan 2026', expectedClose: '30 Apr 2026', site: 'Karratha', margin: 21, probability: 100 },
  { id: 'P-2581', stage: 'In Production', product: 'P18000 Service Truck', customer: 'BHP Billiton', value: 498000, submitted: '14 Jan 2026', expectedClose: '05 May 2026', site: 'Port Hedland', margin: 22, probability: 100 },
  { id: 'P-2582', stage: 'In Production', product: 'P18000 Service Truck', customer: 'Fortescue Metals', value: 511000, submitted: '20 Jan 2026', expectedClose: '12 May 2026', site: 'Newman', margin: 23, probability: 100 },
  { id: 'P-2583', stage: 'In Production', product: 'P18000 Service Truck', customer: 'CIMIC Group', value: 495000, submitted: '28 Jan 2026', expectedClose: '20 May 2026', site: 'Darwin', margin: 20, probability: 100 },
  { id: 'P-2584', stage: 'In Production', product: 'P5000 Service Truck', customer: 'Monadelphous', value: 244000, submitted: '02 Feb 2026', expectedClose: '02 May 2026', site: 'Perth', margin: 18, probability: 100 },
  { id: 'P-2585', stage: 'In Production', product: 'P5000 Service Truck', customer: 'NRW Holdings', value: 238000, submitted: '06 Feb 2026', expectedClose: '08 May 2026', site: 'Kalgoorlie', margin: 17, probability: 100 },
  { id: 'P-2586', stage: 'In Production', product: 'P5000 Service Truck', customer: 'Rio Tinto', value: 241000, submitted: '10 Feb 2026', expectedClose: '14 May 2026', site: 'Tom Price', margin: 19, probability: 100 },
  { id: 'P-2587', stage: 'In Production', product: 'P5000 Service Truck', customer: 'BHP Billiton', value: 246000, submitted: '14 Feb 2026', expectedClose: '20 May 2026', site: 'Newman', margin: 20, probability: 100 },
  { id: 'P-2588', stage: 'In Production', product: 'P5000 Service Truck', customer: 'Fortescue Metals', value: 243000, submitted: '18 Feb 2026', expectedClose: '26 May 2026', site: 'Port Hedland', margin: 21, probability: 100 },
  { id: 'P-2589', stage: 'In Production', product: 'P5000 Service Truck ×2', customer: 'Monadelphous', value: 482000, submitted: '22 Feb 2026', expectedClose: '30 May 2026', site: 'Perth', margin: 18, probability: 100 },
  { id: 'P-2590', stage: 'In Production', product: 'Water Truck 18KL', customer: 'BHP Billiton', value: 330000, submitted: '28 Feb 2026', expectedClose: '10 May 2026', site: 'Newman', margin: 21, probability: 100 },
  { id: 'P-2591', stage: 'In Production', product: 'Diesel Tanker 15KL', customer: 'Rio Tinto', value: 287000, submitted: '04 Mar 2026', expectedClose: '16 May 2026', site: 'Karratha', margin: 22, probability: 100 },
  { id: 'P-2592', stage: 'In Production', product: 'Mine Bus 22-seat', customer: 'Fortescue Metals', value: 202000, submitted: '08 Mar 2026', expectedClose: '22 May 2026', site: 'Port Hedland', margin: 20, probability: 100 },
  { id: 'P-2593', stage: 'In Production', product: 'Vacuum Truck 8KL', customer: 'CIMIC Group', value: 224000, submitted: '12 Mar 2026', expectedClose: '28 May 2026', site: 'Darwin', margin: 19, probability: 100 },
  { id: 'P-2594', stage: 'In Production', product: 'Tilt Tray Truck', customer: 'NRW Holdings', value: 168000, submitted: '15 Mar 2026', expectedClose: '02 Jun 2026', site: 'Perth', margin: 23, probability: 100 },
  // Completing
  { id: 'D-2575', stage: 'Completing', product: 'P18000 Service Truck', customer: 'BHP Billiton', value: 501000, submitted: '10 Nov 2025', expectedClose: '25 Apr 2026', site: 'Newman', margin: 22, probability: 100 },
  { id: 'D-2576', stage: 'Completing', product: 'P5000 Service Truck ×3', customer: 'Monadelphous', value: 726000, submitted: '20 Nov 2025', expectedClose: '28 Apr 2026', site: 'Perth', margin: 17, probability: 100 },
  { id: 'D-2577', stage: 'Completing', product: 'Water Truck 10KL', customer: 'Rio Tinto', value: 221000, submitted: '01 Dec 2025', expectedClose: '30 Apr 2026', site: 'Tom Price', margin: 20, probability: 100 },
  { id: 'D-2578', stage: 'Completing', product: 'Diesel Tanker 12KL', customer: 'Fortescue Metals', value: 265000, submitted: '05 Dec 2025', expectedClose: '01 May 2026', site: 'Port Hedland', margin: 21, probability: 100 },
];

const RENTAL_PIPELINE = [
  // Active — aligns with 52 fleet assets, 61% utilisation
  { id: 'R-4201', status: 'Active', asset: 'Water Truck 18KL 6×6', assetId: 'WT-18-012', customer: 'BHP Billiton', site: 'Newman', dailyRate: 1850, startDate: '01 Feb 2026', endDate: '31 Jul 2026', renewalProbability: 80 },
  { id: 'R-4202', status: 'Active', asset: 'P18000 Service Truck', assetId: 'ST-18-003', customer: 'Fortescue Metals', site: 'Port Hedland', dailyRate: 2100, startDate: '15 Jan 2026', endDate: '15 Jun 2026', renewalProbability: 90 },
  { id: 'R-4203', status: 'Active', asset: 'P5000 Service Truck', assetId: 'ST-50-007', customer: 'Rio Tinto', site: 'Tom Price', dailyRate: 1400, startDate: '01 Mar 2026', endDate: '30 Aug 2026', renewalProbability: 75 },
  { id: 'R-4204', status: 'Active', asset: 'Diesel Tanker 15KL', assetId: 'DT-15-002', customer: 'Monadelphous', site: 'Perth', dailyRate: 1200, startDate: '10 Feb 2026', endDate: '10 May 2026', renewalProbability: 60 },
  { id: 'R-4205', status: 'Active', asset: 'Mine Bus 22-seat', assetId: 'MB-22-001', customer: 'BHP Billiton', site: 'Newman', dailyRate: 980, startDate: '01 Jan 2026', endDate: '30 Jun 2026', renewalProbability: 85 },
  { id: 'R-4206', status: 'Active', asset: 'Water Truck 10KL 4×4', assetId: 'WT-10-019', customer: 'NRW Holdings', site: 'Kalgoorlie', dailyRate: 1100, startDate: '01 Apr 2026', endDate: '30 Sep 2026', renewalProbability: 55 },
  { id: 'R-4207', status: 'Active', asset: 'Generator 200kVA', assetId: 'GN-200-004', customer: 'CIMIC Group', site: 'Darwin', dailyRate: 620, startDate: '15 Mar 2026', endDate: '15 Jun 2026', renewalProbability: 40 },
  { id: 'R-4208', status: 'Active', asset: 'P18000 Service Truck', assetId: 'ST-18-008', customer: 'Rio Tinto', site: 'Karratha', dailyRate: 2100, startDate: '01 Feb 2026', endDate: '31 May 2026', renewalProbability: 70 },
  // Upcoming
  { id: 'R-4209', status: 'Upcoming', asset: 'Water Truck 18KL 6×6', assetId: 'WT-18-022', customer: 'BHP Billiton', site: 'Port Hedland', dailyRate: 1900, startDate: '01 May 2026', endDate: '31 Oct 2026', renewalProbability: null },
  { id: 'R-4210', status: 'Upcoming', asset: 'Vacuum Truck 10KL', assetId: 'VT-10-003', customer: 'Fortescue Metals', site: 'Newman', dailyRate: 1650, startDate: '15 May 2026', endDate: '15 Nov 2026', renewalProbability: null },
  { id: 'R-4211', status: 'Upcoming', asset: 'P5000 Service Truck', assetId: 'ST-50-011', customer: 'Monadelphous', site: 'Perth', dailyRate: 1350, startDate: '01 Jun 2026', endDate: '30 Nov 2026', renewalProbability: null },
  { id: 'R-4212', status: 'Upcoming', asset: 'Tilt Tray Truck', assetId: 'TT-001', customer: 'NRW Holdings', site: 'Brisbane', dailyRate: 880, startDate: '01 Jun 2026', endDate: '31 Aug 2026', renewalProbability: null },
  // Renewal Due
  { id: 'R-4190', status: 'Renewal Due', asset: 'Diesel Tanker 15KL', assetId: 'DT-15-002', customer: 'Monadelphous', site: 'Perth', dailyRate: 1200, startDate: '10 Feb 2026', endDate: '10 May 2026', renewalProbability: 60 },
  { id: 'R-4191', status: 'Renewal Due', asset: 'Generator 200kVA', assetId: 'GN-200-004', customer: 'CIMIC Group', site: 'Darwin', dailyRate: 620, startDate: '15 Mar 2026', endDate: '15 Jun 2026', renewalProbability: 40 },
  { id: 'R-4192', status: 'Renewal Due', asset: 'Water Truck 10KL 4×4', assetId: 'WT-10-008', customer: 'Rio Tinto', site: 'Tom Price', dailyRate: 1050, startDate: '01 Jan 2026', endDate: '30 Apr 2026', renewalProbability: 75 },
  { id: 'R-4193', status: 'Renewal Due', asset: 'Mine Bus 22-seat', assetId: 'MB-22-003', customer: 'BHP Billiton', site: 'Karratha', dailyRate: 980, startDate: '01 Oct 2025', endDate: '30 Apr 2026', renewalProbability: 65 },
];

const STAGES = ['Quoting', 'Confirmed', 'In Production', 'Completing'];
const STAGE_COLORS = { Quoting: '#999', Confirmed: '#E8900A', 'In Production': '#D42027', Completing: '#22a85a' };
const STATUS_COLORS = { Active: '#22a85a', Upcoming: '#D42027', 'Renewal Due': '#E8900A' };

const fmt = n => '$' + (n >= 1000000 ? (n/1000000).toFixed(2) + 'M' : (n/1000).toFixed(0) + 'K');
const fmtDay = n => '$' + n.toLocaleString();

// ── Build Pipeline ────────────────────────────────────────────────────────────
function BuildPipeline() {
  const [selectedStage, setSelectedStage] = useState(null);
  const pipelineRef = useRef(null);
  const pipelineChart = useRef(null);

  const filtered = selectedStage ? BUILD_PIPELINE.filter(b => b.stage === selectedStage) : BUILD_PIPELINE;

  const stageData = STAGES.map(s => ({
    stage: s,
    count: BUILD_PIPELINE.filter(b => b.stage === s).length,
    value: BUILD_PIPELINE.filter(b => b.stage === s).reduce((a, b) => a + b.value, 0),
  }));

  const totalValue = BUILD_PIPELINE.reduce((a, b) => a + b.value * b.probability / 100, 0);
  const totalConfirmed = BUILD_PIPELINE.filter(b => ['Confirmed','In Production','Completing'].includes(b.stage)).reduce((a, b) => a + b.value, 0);

  useEffect(() => {
    const ctx = pipelineRef.current.getContext('2d');
    pipelineChart.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: STAGES,
        datasets: [{
          label: 'Pipeline value',
          data: stageData.map(s => s.value / 1000),
          backgroundColor: STAGES.map(s => STAGE_COLORS[s] + 'aa'),
          borderColor: STAGES.map(s => STAGE_COLORS[s]),
          borderWidth: 1.5, borderRadius: 4,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#fff', borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, titleColor: '#111', bodyColor: '#555',
            callbacks: { label: ctx => ` $${ctx.parsed.y.toFixed(0)}K across ${stageData[ctx.dataIndex].count} builds` } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#777', font: { size: 12 } } },
          y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#999', callback: v => `$${v}K` } },
        },
        onClick: (e, elements) => {
          if (elements.length) {
            const s = STAGES[elements[0].index];
            setSelectedStage(prev => prev === s ? null : s);
          }
        },
      },
    });
    return () => pipelineChart.current?.destroy();
  }, []);

  return (
    <div>
      {/* Summary metrics */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="card card-sm">
          <div className="label" style={{ marginBottom: 8 }}>Weighted Pipeline</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color: 'var(--teal)' }}>{fmt(totalValue)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>Probability-adjusted</div>
        </div>
        <div className="card card-sm">
          <div className="label" style={{ marginBottom: 8 }}>Confirmed + Active</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color: 'var(--text)' }}>{fmt(totalConfirmed)}</div>
          <div style={{ fontSize: 11, color: '#22a85a', marginTop: 6, fontWeight: 600 }}>↑ Locked revenue</div>
        </div>
        <div className="card card-sm">
          <div className="label" style={{ marginBottom: 8 }}>Active Builds</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color: 'var(--text)' }}>18</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>4 P18000 · 7 P5000 · 7 other</div>
        </div>
        <div className="card card-sm">
          <div className="label" style={{ marginBottom: 8 }}>Avg Build Margin</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color: 'var(--amber)' }}>20.6%</div>
          <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 6, fontWeight: 600 }}>↓ 1.4pp · P5000 drag</div>
        </div>
      </div>

      <div className="grid-2-1" style={{ marginBottom: 20 }}>
        {/* Chart */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Pipeline value by stage</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 14 }}>Click a stage to filter the table below</div>
          <div style={{ height: 200 }}><canvas ref={pipelineRef}/></div>
        </div>
        {/* Stage cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {stageData.map(s => (
            <div key={s.stage} onClick={() => setSelectedStage(prev => prev === s.stage ? null : s.stage)}
              className="card card-sm" style={{ cursor: 'pointer', borderColor: selectedStage === s.stage ? STAGE_COLORS[s.stage] : 'var(--border)', transition: 'border-color 0.15s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: STAGE_COLORS[s.stage] }}/>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.stage}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{s.count} builds</span>
                </div>
                <span style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, color: STAGE_COLORS[s.stage] }}>{fmt(s.value)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Build table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14 }}>
            {selectedStage ? `${selectedStage} — ${filtered.length} builds` : `All builds — ${BUILD_PIPELINE.length} total`}
          </div>
          {selectedStage && (
            <button onClick={() => setSelectedStage(null)} style={{ fontSize: 11, color: 'var(--teal)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear filter ×</button>
          )}
        </div>
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Product</th><th>Customer</th><th>Site</th><th>Value</th><th>Margin</th><th>Expected delivery</th><th>Stage</th></tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td style={{ color: 'var(--text-3)', fontSize: 11, fontFamily: 'monospace' }}>{b.id}</td>
                <td style={{ color: 'var(--text)', fontWeight: 500 }}>{b.product}</td>
                <td style={{ color: 'var(--text-2)' }}>{b.customer}</td>
                <td style={{ color: 'var(--text-3)' }}>{b.site}</td>
                <td style={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-head)' }}>{fmt(b.value)}</td>
                <td style={{ color: b.margin < 19 ? 'var(--red)' : b.margin < 22 ? 'var(--amber)' : '#22a85a', fontWeight: 600 }}>{b.margin}%</td>
                <td style={{ color: 'var(--text-2)', fontSize: 12 }}>{b.expectedClose}</td>
                <td>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: STAGE_COLORS[b.stage], background: STAGE_COLORS[b.stage] + '18', padding: '3px 8px', borderRadius: 4 }}>
                    {b.stage}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Rental Pipeline ───────────────────────────────────────────────────────────
function RentalPipeline() {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const revenueRef = useRef(null);
  const revenueChart = useRef(null);

  const filtered = selectedStatus ? RENTAL_PIPELINE.filter(r => r.status === selectedStatus) : RENTAL_PIPELINE;
  const statuses = ['Active', 'Upcoming', 'Renewal Due'];

  const activeRevPerDay = RENTAL_PIPELINE.filter(r => r.status === 'Active').reduce((a, r) => a + r.dailyRate, 0);
  const upcomingRevPerDay = RENTAL_PIPELINE.filter(r => r.status === 'Upcoming').reduce((a, r) => a + r.dailyRate, 0);
  const renewalAtRisk = RENTAL_PIPELINE.filter(r => r.status === 'Renewal Due' && r.renewalProbability < 60).reduce((a, r) => a + r.dailyRate * 180, 0);

  useEffect(() => {
    const ctx = revenueRef.current.getContext('2d');
    // Monthly rental revenue forecast (aligns with cashflow 13-week)
    const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    revenueChart.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          { label: 'Confirmed rental', data: [312, 328, 341, 355, 298, 280, 290], backgroundColor: 'rgba(212,32,39,0.55)', borderColor: '#D42027', borderWidth: 1, borderRadius: 3, stack: 'r' },
          { label: 'Renewal (prob.)', data: [28, 22, 18, 42, 55, 38, 30], backgroundColor: 'rgba(232,144,10,0.45)', borderColor: '#E8900A', borderWidth: 1, borderRadius: 3, stack: 'r' },
          { label: 'Upcoming', data: [0, 0, 0, 82, 124, 118, 108], backgroundColor: 'rgba(34,168,90,0.4)', borderColor: '#22a85a', borderWidth: 1, borderRadius: 3, stack: 'r' },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#777', font: { family: 'Manrope', size: 11 }, boxWidth: 10 } },
          tooltip: { backgroundColor: '#fff', borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, titleColor: '#111', bodyColor: '#555',
            callbacks: { label: ctx => ` ${ctx.dataset.label}: $${ctx.parsed.y}K` } },
        },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { color: '#777', font: { size: 12 } } },
          y: { stacked: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#999', callback: v => `$${v}K` } },
        },
      },
    });
    return () => revenueChart.current?.destroy();
  }, []);

  return (
    <div>
      {/* Summary metrics */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="card card-sm">
          <div className="label" style={{ marginBottom: 8 }}>Active Daily Revenue</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color: 'var(--teal)' }}>{fmtDay(activeRevPerDay)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>Across {RENTAL_PIPELINE.filter(r=>r.status==='Active').length} active contracts</div>
        </div>
        <div className="card card-sm">
          <div className="label" style={{ marginBottom: 8 }}>Upcoming Contracts</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color: 'var(--text)' }}>{RENTAL_PIPELINE.filter(r=>r.status==='Upcoming').length}</div>
          <div style={{ fontSize: 11, color: '#22a85a', marginTop: 6, fontWeight: 600 }}>+{fmtDay(upcomingRevPerDay)}/day pipeline</div>
        </div>
        <div className="card card-sm">
          <div className="label" style={{ marginBottom: 8 }}>Renewals Due</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color: 'var(--amber)' }}>{RENTAL_PIPELINE.filter(r=>r.status==='Renewal Due').length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>Action required this month</div>
        </div>
        <div className="card card-sm">
          <div className="label" style={{ marginBottom: 8 }}>Revenue at Risk</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color: 'var(--red)' }}>{fmt(renewalAtRisk)}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>Low-probability renewals (6mo)</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        {/* Revenue forecast chart */}
        <div className="card" style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Monthly rental revenue forecast</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 14 }}>Confirmed + probability-weighted renewals + upcoming ($K)</div>
          <div style={{ height: 220 }}><canvas ref={revenueRef}/></div>
        </div>

        {/* Asset availability */}
        <div className="card">
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Fleet availability by class</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 16 }}>Available = idle units not currently contracted — aligns with utilisation module</div>
          {[
            { label: 'Water Trucks', total: 47, onHire: 29, idle: 18 },
            { label: 'Service Trucks', total: 18, onHire: 16, idle: 2 },
            { label: 'Diesel Tankers', total: 12, onHire: 9, idle: 3 },
            { label: 'Mine Buses', total: 8, onHire: 5, idle: 3 },
            { label: 'Generators', total: 6, onHire: 4, idle: 2 },
            { label: 'Trailers / Other', total: 9, onHire: 6, idle: 3 },
          ].map(a => (
            <div key={a.label} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>{a.label}</span>
                <span style={{ color: 'var(--text-3)', fontSize: 11 }}>{a.onHire} on hire · <span style={{ color: a.idle > 3 ? 'var(--red)' : a.idle > 1 ? 'var(--amber)' : '#22a85a', fontWeight: 600 }}>{a.idle} available</span></span>
              </div>
              <div style={{ height: 6, background: 'rgba(0,0,0,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(a.onHire / a.total) * 100}%`, background: 'var(--teal)', borderRadius: 3 }}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rental table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14 }}>
            {selectedStatus || 'All contracts'} — {filtered.length} records
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {statuses.map(s => (
              <button key={s} onClick={() => setSelectedStatus(prev => prev === s ? null : s)} style={{
                padding: '4px 12px', borderRadius: 5, border: '1px solid',
                borderColor: selectedStatus === s ? STATUS_COLORS[s] : 'var(--border2)',
                background: selectedStatus === s ? STATUS_COLORS[s] + '18' : 'transparent',
                color: selectedStatus === s ? STATUS_COLORS[s] : 'var(--text-3)',
                fontSize: 11, fontFamily: 'var(--font-body)', cursor: 'pointer', fontWeight: selectedStatus === s ? 700 : 400,
              }}>{s}</button>
            ))}
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Contract</th><th>Asset</th><th>Customer</th><th>Site</th><th>Daily rate</th><th>Period</th><th>Status</th><th>Renewal prob.</th></tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td style={{ color: 'var(--text-3)', fontSize: 11, fontFamily: 'monospace' }}>{r.id}</td>
                <td>
                  <div style={{ color: 'var(--text)', fontWeight: 500, fontSize: 13 }}>{r.asset}</div>
                  <div style={{ color: 'var(--text-3)', fontSize: 10, marginTop: 2 }}>{r.assetId}</div>
                </td>
                <td style={{ color: 'var(--text-2)' }}>{r.customer}</td>
                <td style={{ color: 'var(--text-3)' }}>{r.site}</td>
                <td style={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-head)' }}>{fmtDay(r.dailyRate)}</td>
                <td style={{ fontSize: 11, color: 'var(--text-2)' }}>{r.startDate} → {r.endDate}</td>
                <td>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: STATUS_COLORS[r.status], background: STATUS_COLORS[r.status] + '18', padding: '3px 8px', borderRadius: 4 }}>
                    {r.status}
                  </span>
                </td>
                <td>
                  {r.renewalProbability !== null ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="spark-bar" style={{ width: 50 }}>
                        <div className="spark-bar-fill" style={{ width: `${r.renewalProbability}%`, background: r.renewalProbability >= 70 ? '#22a85a' : r.renewalProbability >= 50 ? 'var(--amber)' : 'var(--red)' }}/>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: r.renewalProbability >= 70 ? '#22a85a' : r.renewalProbability >= 50 ? 'var(--amber)' : 'var(--red)' }}>{r.renewalProbability}%</span>
                    </div>
                  ) : <span style={{ color: 'var(--text-3)', fontSize: 11 }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
function PipelineScreen() {
  const [view, setView] = useState('builds');

  return (
    <div className="page-content">
      <div style={{ marginBottom: 32 }}>
        <div className="section-eyebrow">Sales Pipeline · Q1–Q2 2026</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>
            Sales Pipeline
          </h1>
          {/* Sub-nav toggle */}
          <div style={{ display: 'flex', background: 'var(--surface2)', borderRadius: 8, padding: 3, gap: 2, marginBottom: 12 }}>
            {[['builds','Truck Builds'],['rental','Rental Contracts']].map(([key, label]) => (
              <button key={key} onClick={() => setView(key)} style={{
                padding: '7px 20px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: view === key ? 700 : 400,
                background: view === key ? '#ffffff' : 'transparent',
                color: view === key ? 'var(--text)' : 'var(--text-3)',
                boxShadow: view === key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s',
              }}>{label}</button>
            ))}
          </div>
        </div>

        <p className="narrative">
          {view === 'builds'
            ? <>Plantman has <strong>18 builds in active production</strong> and a further <strong>8 confirmed or in-quote</strong> across P18000, P5000, water trucks and specialty vehicles. The weighted pipeline totals <span className="hl">$11.4M</span> with P5000 margin drag the key risk to profitability.</>
            : <>The rental fleet is generating <strong>{fmtDay(11700)}/day</strong> in active contract revenue across 8 current contracts. <strong>4 upcoming contracts</strong> add $10,630/day from May–June. <span className="hl">2 low-probability renewals</span> need account manager follow-up this week.</>
          }
        </p>
      </div>

      {view === 'builds' ? <BuildPipeline /> : <RentalPipeline />}

      <div className="divider"/>
      <div className="section-eyebrow" style={{ marginBottom: 12 }}>Consultant Notes</div>
      {view === 'builds' ? (
        <ConsultantNote author="Daniel — Phlo" date="18 April 2026">
          The Q-2604 (NRW P5000 quote) is worth watching carefully. At 40% probability and an 18% margin estimate, it's borderline — especially given the systematic P5000 cost overruns we've identified in the profitability module. I'd recommend either pricing in a 12% contingency before submission or having a frank conversation with the estimating team before this goes out. Winning it at the wrong price makes the problem worse.
        </ConsultantNote>
      ) : (
        <ConsultantNote author="Daniel — Phlo" date="18 April 2026">
          The CIMIC generator renewal (R-4191) and Monadelphous tanker (R-4190) are both at risk. CIMIC's payment history (52-day average on 30-day terms, flagged in the cashflow module) means a renewal conversation needs to include a security deposit or revised terms. I'd get in front of both accounts this week before the contracts lapse and the assets go uncontracted.
        </ConsultantNote>
      )}
    </div>
  );
}

Object.assign(window, { PipelineScreen });
