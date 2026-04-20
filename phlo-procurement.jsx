// Procurement Timing screen

const { useEffect, useRef } = React;

function ProcurementScreen() {
  const scatterRef = useRef(null);
  const barRef = useRef(null);
  const scatterChart = useRef(null);
  const barChart = useRef(null);

  useEffect(() => {
    // Scatter: days early vs $ value per PO
    const ctx1 = scatterRef.current.getContext('2d');
    const categories = {
      'Hydraulics': { color: '#D42027', data: [{x:5,y:42},{x:8,y:78},{x:3,y:31},{x:12,y:95},{x:7,y:55},{x:4,y:28}] },
      'Chassis': { color: '#F5A623', data: [{x:2,y:180},{x:4,y:210},{x:6,y:195},{x:1,y:175}] },
      'Electrical': { color: '#FF5A5A', data: [{x:9,y:22},{x:14,y:35},{x:11,y:18},{x:16,y:41},{x:13,y:29}] },
      'Tanks': { color: '#7B8CDE', data: [{x:3,y:65},{x:5,y:80},{x:2,y:55},{x:6,y:72}] },
      'Pumps': { color: '#A0A0A0', data: [{x:6,y:38},{x:8,y:45},{x:5,y:32}] },
    };
    scatterChart.current = new Chart(ctx1, {
      type: 'scatter',
      data: {
        datasets: Object.entries(categories).map(([label, d]) => ({
          label, data: d.data, backgroundColor: d.color + 'bb', borderColor: d.color,
          pointRadius: 6, pointHoverRadius: 8, borderWidth: 1,
        })),
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#777', font: { family: 'Manrope', size: 11 }, boxWidth: 8 } },
          tooltip: {
            backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, titleColor: '#111', bodyColor: '#555',
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${ctx.parsed.x} weeks early · $${ctx.parsed.y}K`,
            },
          },
        },
        scales: {
          x: { title: { display: true, text: 'Weeks ordered before need-date', color: '#999', font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#999' } },
          y: { title: { display: true, text: 'PO Value ($K)', color: '#999', font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#999', callback: v => `$${v}K` } },
        },
      },
    });

    // Bar: avg weeks early by category
    const ctx2 = barRef.current.getContext('2d');
    barChart.current = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Axle Assemblies', 'Hydraulic Pumps', 'Electrical Harness', 'Tanks & Vessels', 'Chassis Rails', 'Fasteners'],
        datasets: [{
          label: 'Avg weeks ordered early',
          data: [4.2, 3.8, 5.1, 2.6, 1.4, 0.9],
          backgroundColor: [
            'rgba(212,32,39,0.75)', 'rgba(212,32,39,0.6)', 'rgba(255,90,90,0.7)',
            'rgba(212,32,39,0.45)', 'rgba(212,32,39,0.25)', 'rgba(0,0,0,0.08)',
          ],
          borderColor: ['#D42027','#D42027','#FF5A5A','#D42027','#D42027','#ccc'],
          borderWidth: 1, borderRadius: 3,
        }],
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, titleColor: '#111', bodyColor: '#555',
            callbacks: { label: ctx => ` ${ctx.parsed.x} weeks early avg` },
          },
        },
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#999', callback: v => `${v}w` } },
          y: { grid: { display: false }, ticks: { color: '#777', font: { size: 12 } } },
        },
      },
    });

    return () => { scatterChart.current?.destroy(); barChart.current?.destroy(); };
  }, []);

  const suppliers = [
    { name: 'Haulmark Chassis Co.', category: 'Chassis', avgLeadWeeks: 6.2, reliability: 94, earlyPct: 12 },
    { name: 'Pacific Hydraulics', category: 'Hydraulics', avgLeadWeeks: 3.8, reliability: 78, earlyPct: 34 },
    { name: 'Narva Electrical', category: 'Electrical', avgLeadWeeks: 2.1, reliability: 91, earlyPct: 8 },
    { name: 'WA Tank Solutions', category: 'Tanks', avgLeadWeeks: 4.5, reliability: 85, earlyPct: 22 },
    { name: 'Repco Industrial', category: 'Fasteners', avgLeadWeeks: 1.2, reliability: 96, earlyPct: 5 },
    { name: 'Bosch Rexroth AU', category: 'Hydraulics', avgLeadWeeks: 5.1, reliability: 71, earlyPct: 45 },
  ];

  const calendar = [
    { week: 'Kick-off', items: ['Chassis rails', 'Main tank vessels', 'Subframe steel'] },
    { week: 'Week 3', items: ['Hydraulic system', 'Pump assemblies', 'Axle components'] },
    { week: 'Week 5', items: ['Electrical harness', 'Control panels', 'Lighting systems'] },
    { week: 'Week 7', items: ['Fasteners & hardware', 'Decals', 'Final fit-out parts'] },
  ];

  return (
    <div className="page-content">
      <div style={{ marginBottom: 32 }}>
        <div className="section-eyebrow">Module 01 · Procurement Timing</div>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>
          Procurement Timing Optimiser
        </h1>
        <p className="narrative">
          Analysis of <strong>Q1 2026 purchase orders</strong> against production work order need-dates reveals a systematic pattern of early procurement across 
          five component categories. Components are being ordered an <span className="hl">average of 4.2 weeks before they are needed on the production floor</span>, 
          with hydraulic pumps and electrical harness components as the primary offenders. Realigning to just-in-time procurement on these categories 
          alone would <span className="hl">free $85K in working capital</span>.
        </p>
      </div>

      <div className="insight-box">
        <p>
          <strong>Headline finding:</strong> Plantman ordered $340K of axle assemblies an average of 4.2 weeks before they were needed on the production 
          floor in Q1. Shifting to just-in-time procurement on these components alone would free up <strong>$85K in working capital</strong> — at Plantman's 
          cost of capital (8.5%), money sitting in unnecessary inventory costs approximately <strong>$7,200 per month</strong>.
        </p>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <ChartBox title="PO date vs. production need-date by component" subtitle="Each point = one purchase order. X-axis = weeks ordered early." height={280}>
          <canvas ref={scatterRef}/>
        </ChartBox>
        <ChartBox title="Average weeks ordered early by category" subtitle="Components above 3 weeks represent cashflow optimisation targets." height={280}>
          <canvas ref={barRef}/>
        </ChartBox>
      </div>

      <div className="grid-2-1" style={{ marginBottom: 20 }}>
        {/* Supplier reliability */}
        <div className="card">
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Supplier lead time reliability</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 16 }}>Reliability = deliveries within ±2 days of quoted lead time</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Category</th>
                <th>Avg lead (wks)</th>
                <th>Reliability</th>
                <th>Orders early %</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text)', fontWeight: 500 }}>{s.name}</td>
                  <td><Tag>{s.category}</Tag></td>
                  <td className="teal" style={{ fontWeight: 600 }}>{s.avgLeadWeeks}w</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="spark-bar" style={{ width: 60 }}>
                        <div className="spark-bar-fill" style={{ width: `${s.reliability}%`, background: s.reliability >= 90 ? '#22a85a' : s.reliability >= 75 ? 'var(--amber)' : 'var(--red)' }}/>
                      </div>
                      <span style={{ fontSize: 12, color: s.reliability >= 90 ? '#22a85a' : s.reliability >= 75 ? 'var(--amber)' : 'var(--red)', fontWeight: 600 }}>{s.reliability}%</span>
                    </div>
                  </td>
                  <td style={{ color: s.earlyPct > 30 ? 'var(--red)' : s.earlyPct > 15 ? 'var(--amber)' : '#22a85a', fontWeight: 600 }}>{s.earlyPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommended calendar */}
        <div className="card">
          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Recommended PO calendar</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 16 }}>P5000 Service Truck build template</div>
          {calendar.map((c, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{c.week}</div>
              {c.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: 12, color: 'var(--text-2)' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--teal)', opacity: 0.6, flexShrink: 0 }}/>
                  {item}
                </div>
              ))}
            </div>
          ))}
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--teal-dim)', borderRadius: 5, fontSize: 12, color: 'var(--teal)' }}>
            <strong>Estimated saving:</strong> $85K/qtr working capital freed
          </div>
        </div>
      </div>

      <div className="divider"/>
      <div className="section-eyebrow" style={{ marginBottom: 12 }}>Consultant Notes</div>
      <ConsultantNote author="Daniel — Phlo" date="18 April 2026">
        The Pacific Hydraulics and Bosch Rexroth situation is worth a direct conversation. Their quoted lead times are inconsistent and the procurement team is 
        padding orders early as a hedge — which is understandable but expensive. I'd recommend a supplier review meeting with both before implementing the new 
        PO calendar to validate lead time commitments. Once we have their confirmed lead times in writing, we can tighten the ordering windows with confidence.
      </ConsultantNote>
    </div>
  );
}

Object.assign(window, { ProcurementScreen });
