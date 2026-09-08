const getColor = (type) => {
  switch(type) {
    case 'Wildfire': return '#ef4444'
    case 'Industrial Fire': return '#f97316'
    case 'Persistent Thermal Source': return '#eab308'
    case 'Low Risk': return '#22c55e'
    default: return '#888'
  }
}

const getRiskLabel = (type) => {
  switch(type) {
    case 'Wildfire': return 'CRITICAL'
    case 'Industrial Fire': return 'HIGH'
    case 'Persistent Thermal Source': return 'MEDIUM'
    case 'Low Risk': return 'LOW'
    default: return 'UNKNOWN'
  }
}

function HotspotCard({ hotspot, isSelected, onClick }) {
  return (
    <div
      onClick={() => onClick(hotspot)}
      style={{
        background: isSelected ? '#1a2a3e' : '#131f2e',
        borderRadius: '6px',
        padding: '12px',
        borderLeft: `3px solid ${getColor(hotspot.type)}`,
        cursor: 'pointer',
        transition: 'all 0.15s',
        outline: isSelected ? `1px solid ${getColor(hotspot.type)}44` : 'none',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#1a2a3e'}
      onMouseLeave={e => e.currentTarget.style.background = isSelected ? '#1a2a3e' : '#131f2e'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontWeight: '600', fontSize: '13px', color: 'white' }}>{hotspot.city}</span>
        <span style={{
          fontSize: '9px',
          padding: '2px 7px',
          borderRadius: '3px',
          background: `${getColor(hotspot.type)}22`,
          color: getColor(hotspot.type),
          letterSpacing: '0.8px',
          fontWeight: '600'
        }}>
          {getRiskLabel(hotspot.type)}
        </span>
      </div>

      <div style={{ fontSize: '11px', color: getColor(hotspot.type), marginBottom: '8px', fontWeight: '500' }}>
        {hotspot.type}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
        {[
          { label: 'FRP', value: `${hotspot.frp} MW` },
          { label: 'Conf', value: hotspot.confidence },
          { label: 'Coords', value: hotspot.lat },
          { label: 'Time', value: hotspot.time },
        ].map(d => (
          <div key={d.label} style={{ fontSize: '10px' }}>
            <span style={{ color: '#4a6080' }}>{d.label}: </span>
            <span style={{ color: '#94a3b8' }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HotspotCard