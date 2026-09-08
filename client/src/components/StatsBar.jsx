const stats = [
  { label: 'Total Thermal Events', value: 6, change: '+2', color: '#38bdf8', icon: '🌡️' },
  { label: 'High Risk Events', value: 2, sub: 'Critical Priority', color: '#ef4444', icon: '🔴' },
  { label: 'Medium Risk Events', value: 2, sub: 'Requires Review', color: '#f97316', icon: '⚠️' },
  { label: 'Low Risk Events', value: 1, sub: 'Monitored', color: '#22c55e', icon: '🟢' },
  { label: 'Persistent Sources', value: 2, sub: 'Ongoing', color: '#eab308', icon: '♨️' },
]

function StatsBar() {
  return (
    <div style={{
      display: 'flex',
      gap: '1px',
      background: '#1e2d3d',
      borderBottom: '1px solid #1e2d3d',
      flexShrink: 0,
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          flex: 1,
          background: '#0f1623',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderRight: i < stats.length - 1 ? '1px solid #1e2d3d' : 'none',
        }}>
          <div style={{ fontSize: '24px' }}>{s.icon}</div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '28px', fontWeight: '700', color: s.color, lineHeight: 1 }}>
                {String(s.value).padStart(2, '0')}
              </span>
              {s.change && (
                <span style={{ fontSize: '11px', color: '#22c55e' }}>{s.change}</span>
              )}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{s.label}</div>
            {s.sub && (
              <div style={{ fontSize: '9px', color: s.color, marginTop: '1px', letterSpacing: '0.5px' }}>{s.sub}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsBar