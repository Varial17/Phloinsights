// Main App — routing between screens

const { useState } = React;

function App() {
  const savedTab = localStorage.getItem('phlo-active-tab') || 'overview';
  const [active, setActiveRaw] = useState(savedTab);
  const [score, setScoreRaw] = useState(parseInt(localStorage.getItem('phlo-score') || '72'));

  const setActive = tab => {
    setActiveRaw(tab);
    localStorage.setItem('phlo-active-tab', tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setScore = v => {
    setScoreRaw(v);
    localStorage.setItem('phlo-score', v);
  };

  const screens = {
    overview:    <OverviewScreen score={score} setScore={setScore} setActive={setActive} />,
    procurement: <ProcurementScreen />,
    assets:      <AssetsScreen />,
    cashflow:    <CashflowScreen />,
    jobs:        <JobsScreen />,
    pipeline:    <PipelineScreen />,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PhloNav active={active} setActive={setActive} />

      {/* Page transition wrapper */}
      <main key={active} style={{
        flex: 1,
        animation: 'fadeIn 0.25s ease',
      }}>
        {screens[active]}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '16px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: 1280,
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
          © 2026 Plantman Equipment · Confidential · Powered by Phlo Insights
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
          Data sourced from Epicor Kinetic · Last extract: <span style={{ color: 'var(--text-2)' }}>18 Apr 2026 06:14 AWST</span>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
window.__appReady && window.__appReady();
