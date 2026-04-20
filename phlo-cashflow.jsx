// Cashflow Intelligence screen

const { useEffect, useRef } = React;

function CashflowScreen() {
  const forecastRef = useRef(null);
  const cccRef = useRef(null);
  const dsoDpoRef = useRef(null);
  const forecastChart = useRef(null);
  const cccChart = useRef(null);
  const dsoDpoChart = useRef(null);

  useEffect(() => {
    // 13-week cashflow forecast
    const ctx1 = forecastRef.current.getContext('2d');
    const weeks = ['Wk1','Wk2','Wk3','Wk4','Wk5','Wk6','Wk7','Wk8','Wk9','Wk10','Wk11','Wk12','Wk13'];
    const committed = [2100,1980,2250,1850,2420,2680,2300,1950,2100,2450,2800,2600,2900];
    const forecast  = [null,null,null,null,2500,2750,2400,2050,2200,2550,2950,2700,3100];
    const lower     = [null,null,null,null,2200,2400,2100,1800,1900,2200,2600,2350,2700];
    const upper     = [null,null,null,null,2800,3100,2700,2300,2500,2900,3300,3050,3500];

    forecastChart.current = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: weeks,
        datasets: [
          { label: 'Committed', data: committed, borderColor: '#D42027', backgroundColor: 'rgba(212,32,39,0.07)',
            borderWidth: 2, fill: true, tension: 0.3, pointRadius: 3, pointBackgroundColor: '#D42027' },
          { label: 'Forecast', data: forecast, borderColor: '#D42027', borderDash: [5,4],
            borderWidth: 1.5, fill: false, tension: 0.3, pointRadius: 3, pointBackgroundColor: '#D42027', pointBorderColor: '#f7f7f5' },
          { label: 'Upper bound', data: upper, borderColor: 'rgba(212,32,39,0.12)', borderWidth: 0,
            fill: '+1', tension: 0.3, pointRadius: 0 },
          { label: 'Lower bound', data: lower, borderColor: 'rgba(212,32,39,0.12)', borderWidth: 0,
            backgroundColor: 'rgba(212,32,39,0.05)', fill: false, tension: 0.3, pointRadius: 0 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#777', font: { family: 'Manrope', size: 11 }, boxWidth: 12, filter: item => item.text !== 'Upper bound' && item.text !== 'Lower bound' } },
          tooltip: { backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, titleColor: '#111', bodyColor: '#555',
            callbacks: { label: ctx => ctx.parsed.y ? ` $${ctx.parsed.y.toLocaleString()}K` : null } },
        },
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#999', font: { size: 11 } } },
          y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#999', callback: v => `$${v}K` } },
        },
      },
    });

    // CCC trend (quarterly)
    const ctx2 = cccRef.current.getContext('2d');
    cccChart.current = new Chart(ctx2, {
      type: 'line',
      data: {
        labels: ['Q1 25','Q2 25','Q3 25','Q4 25','Q1 26'],
        datasets: [{
          label: 'CCC (days)',
          data: [62, 65, 70, 78, 84],
          borderColor: '#FF5A5A', backgroundColor: 'rgba(255,90,90,0.08)',
          borderWidth: 2, fill: true, tension: 0.4, pointRadius: 5,
          pointBackgroundColor: ['#FF5A5A','#FF5A5A','#FF5A5A','#FF5A5A','#FF5A5A'],
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, titleColor: '#111', bodyColor: '#555',
            callbacks: { label: ctx => ` CCC: ${ctx.parsed.y} days` } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#777', font: { size: 12 } } },
          y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#999', callback: v => `${v}d` }, min: 50 },
        },
      },
    });

    // DSO / DPO comparison
    const ctx3 = dsoDpoRef.current.getContext('2d');
    dsoDpoChart.current = new Chart(ctx3, {
      type: 'bar',
      data: {
        labels: ['Q1 25','Q2 25','Q3 25','Q4 25','Q1 26'],
        datasets: [
          { label: 'DSO', data: [41, 44, 47, 50, 52], backgroundColor: 'rgba(212,32,39,0.6)', borderColor: '#D42027', borderWidth: 1, borderRadius: 3 },
          { label: 'DPO', data: [16, 14, 13, 11, 9], backgroundColor: 'rgba(34,168,90,0.5)', borderColor: '#22a85a', borderWidth: 1, borderRadius: 3 },
        ],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#777', font: { family: 'Manrope', size: 11 }, boxWidth: 10 } },
          tooltip: { backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, titleColor: '#111', bodyColor: '#555',
            callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} days` } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#777', font: { size: 11 } } },
          y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#999', callback: v => `${v}d` } },
        },
      },
    });

    return () => { forecastChart.current?.destroy(); cccChart.current?.destroy(); dsoDpoChart.current?.destroy(); };
  }, []);

  const customers = [
    { name: 'BHP Billiton', segment: 'Mining', terms: 60, avgPayment: 67, score: 72, risk: 'amber' },
    { name: 'Fortescue Metals', segment: 'Mining', terms: 60, avgPayment: 58, score: 91, risk: 'teal' },
    { name: 'Monadelphous', segment: 'Contractor', terms: 30, avgPayment: 35, score: 83, risk: 'teal' },
    { name: 'NRW Holdings', segment: 'Contractor', terms: 30, avgPayment: 44, score: 61, risk: 'amber' },
    { name: 'Rio Tinto', segment: 'Mining', terms: 45, avgPayment: 51, score: 78, risk: 'teal' },
    { name: 'CIMIC Group', segment: 'Contractor', terms: 30, avgPayment: 52, score: 44, risk: 'red' },
  ];

  const [scenario, setScenario] = React.useState('base');
  const scenarioImpact = {
    base: { label: 'Base case', cash13: '$2.9M', note: 'Current trajectory with no changes to payment terms or collections.' },
    late: { label: 'Top 3 customers delay 2 weeks', cash13: '$1.6M', note: 'BHP, FMG and Monadelphous delay payment by 2 weeks simultaneously.' },
    early: { label: 'Implement early payment discounts', cash13: '$3.4M', note: '2/10 net 30 offered to eligible customers. Estimated 40% uptake.' },
  };

  return (
    <div className="page-content">
      <div style={{ marginBottom: 32 }}>
        <div className="section-eyebrow">Module 03 · Cashflow Intelligence</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>
          Cashflow Intelligence Engine
        </h1>
        <p className="narrative">
          Plantman's <strong>cash conversion cycle has extended from 68 to 84 days</strong> over the past 12 months — a 24% deterioration that is 
          outpacing revenue growth. The primary drivers are <span className="hl">slower customer payments on rental invoices</span> (DSO up 11 days) and 
          <span className="hl"> earlier supplier payments on chassis orders</span> (DPO down 7 days). 
          Addressing these two levers would unlock an estimated <span className="hl">$1.2M in working capital</span>.
        </p>
      </div>

      <div className="insight-box">
        <p>
          <strong>Headline finding:</strong> Plantman's cash conversion cycle has extended from 68 to 84 days over the past 12 months, driven primarily 
          by slower customer payments on rental invoices (DSO up 11 days) and earlier supplier payments on chassis orders (DPO down 5 days). 
          Addressing these two factors would unlock <strong>$1.2M in working capital</strong>.
        </p>
      </div>

      {/* Key CCC metrics */}
      <div className="grid-4" style={{ marginBottom: 20 }}>
        {[
          { label: 'Cash Conversion Cycle', value: '84 days', sub: '↑ from 68 days', color: 'var(--red)' },
          { label: 'Days Sales Outstanding', value: '52 days', sub: '↑ from 41 days', color: 'var(--red)' },
          { label: 'Days Payable Outstanding', value: '9 days', sub: '↓ from 16 days', color: 'var(--red)' },
          { label: 'Working Capital Locked', value: '$1.2M', sub: 'Recoverable opportunity', color: 'var(--teal)' },
        ].map(m => (
          <div key={m.label} className="card card-sm">
            <div className="label" style={{ marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: 26, fontWeight: 700, color: m.color }}>{m.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Forecast */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14 }}>13-week rolling cashflow forecast</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Solid = committed · Dashed = AI forecast · Band = confidence interval</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {Object.entries(scenarioImpact).map(([key, s]) => (
              <button key={key} onClick={() => setScenario(key)} style={{
                padding: '5px 12px', borderRadius: 5, border: '1px solid',
                borderColor: scenario === key ? 'var(--teal)' : 'var(--border2)',
                background: scenario === key ? 'var(--teal-dim)' : 'transparent',
                color: scenario === key ? 'var(--teal)' : 'var(--text-3)',
                fontSize: 11, fontFamily: 'var(--font-body)', cursor: 'pointer', fontWeight: scenario === key ? 600 : 400,
              }}>{s.label}</button>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: '20px 24px 16px' }}>
          <div style={{ height: 260 }}><canvas ref={forecastRef}/></div>
          <div style={{ marginTop: 12, padding: '10px 14px', background: scenario === 'base' ? 'var(--teal-dim)' : scenario === 'late' ? 'rgba(255,90,90,0.1)' : 'var(--teal-dim)', borderRadius: 5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{scenarioImpact[scenario].note}</span>
              <span style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, color: scenario === 'late' ? 'var(--red)' : 'var(--teal)', flexShrink: 0, marginLeft: 16 }}>
                Wk 13 cash: {scenarioImpact[scenario].cash13}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <ChartBox title="Cash conversion cycle trend" subtitle="Quarterly CCC in days — target: &lt;70 days" height={200}>
          <canvas ref={cccRef}/>
        </ChartBox>
        <ChartBox title="DSO vs DPO trend" subtitle="DSO rising while DPO falls — double compression on working capital" height={200}>
          <canvas ref={dsoDpoRef}/>
        </ChartBox>
      </div>

      {/* Customer payment scoring */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Customer payment behaviour scoring</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 16 }}>Score = 100 − (avg days late × 4). Customers scoring below 60 are flagged for collections review.</div>
        <table className="data-table">
          <thead><tr><th>Customer</th><th>Segment</th><th>Payment terms</th><th>Avg actual (days)</th><th>Payment score</th><th>Risk</th></tr></thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--text)', fontWeight: 500 }}>{c.name}</td>
                <td><Tag>{c.segment}</Tag></td>
                <td style={{ color: 'var(--text-2)' }}>{c.terms}d net</td>
                <td style={{ color: c.avgPayment > c.terms ? 'var(--red)' : 'var(--teal)', fontWeight: 600 }}>{c.avgPayment}d</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="spark-bar" style={{ width: 60 }}>
                      <div className="spark-bar-fill" style={{ width: `${c.score}%`, background: c.score >= 80 ? '#22a85a' : c.score >= 60 ? 'var(--amber)' : 'var(--red)' }}/>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: c.score >= 80 ? '#22a85a' : c.score >= 60 ? 'var(--amber)' : 'var(--red)' }}>{c.score}</span>
                  </div>
                </td>
                <td><Tag color={c.risk}>{c.risk === 'teal' ? 'Good' : c.risk === 'amber' ? 'Watch' : 'Action'}</Tag></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divider"/>
      <div className="section-eyebrow" style={{ marginBottom: 12 }}>Consultant Notes</div>
      <ConsultantNote author="Daniel — Phlo" date="18 April 2026">
        CIMIC is the most urgent issue here. 52-day average payment on 30-day terms is not acceptable, especially given the volume they represent. 
        I'd recommend escalating to director level and putting the account on credit hold for new hire agreements until they clear their outstanding balance. 
        The early payment discount program is a smart parallel move — at 8.5% cost of capital, 2/10 net 30 is genuinely attractive to customers who are cash-positive.
      </ConsultantNote>
    </div>
  );
}

Object.assign(window, { CashflowScreen });
