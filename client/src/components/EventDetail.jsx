function EventDetail({ hotspot, onClose }) {
  if (!hotspot) return null

  const getColor = (type) => {
    switch(type) {
      case 'Wildfire': return '#ef4444'
      case 'Industrial Fire': return '#f97316'
      case 'Persistent Thermal Source': return '#eab308'
      case 'Low Risk': return '#22c55e'
      default: return '#888'
    }
  }

  const classifications = {
    'Wildfire': [
      { label: 'Forest Fire', value: 72, color: '#ef4444' },
      { label: 'Agricultural Burning', value: 18, color: '#f97316' },
      { label: 'Industrial Fire', value: 7, color: '#eab308' },
      { label: 'False Positive', value: 3, color: '#22c55e' },
    ],
    'Industrial Fire': [
      { label: 'Industrial Fire', value: 78, color: '#f97316' },
      { label: 'Flare Stack', value: 14, color: '#eab308' },
      { label: 'Forest Fire', value: 5, color: '#ef4444' },
      { label: 'False Positive', value: 3, color: '#22c55e' },
    ],
    'Persistent Thermal Source': [
      { label: 'Flare Stack', value: 65, color: '#eab308' },
      { label: 'Industrial Furnace', value: 22, color: '#f97316' },
      { label: 'Industrial Fire', value: 10, color: '#ef4444' },
      { label: 'False Positive', value: 3, color: '#22c55e' },
    ],
    'Low Risk': [
      { label: 'Agricultural Burning', value: 55, color: '#22c55e' },
      { label: 'False Positive', value: 30, color: '#94a3b8' },
      { label: 'Industrial Fire', value: 10, color: '#f97316' },
      { label: 'Forest Fire', value: 5, color: '#ef4444' },
    ],
  }

  const getRiskScore = (frp) => {
    if (frp > 150) return { score: 85, label: 'CRITICAL' }
    if (frp > 80) return { score: 60, label: 'HIGH' }
    if (frp > 40) return { score: 35, label: 'MEDIUM' }
    return { score: 15, label: 'LOW' }
  }

  const risk = getRiskScore(hotspot.frp)
  const classData = classifications[hotspot.type] || classifications['Low Risk']

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      width: '280px',
      background: '#0f1623',
      border: '1px solid #1e2d3d',
      borderRadius: '10px',
      padding: '16px',
      zIndex: 1000,
      fontFamily: 'monospace',
      color: 'white',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ fontSize: '9px', color: '#4a6080', letterSpacing: '1px', marginBottom: '4px' }}>
            SELECTED EVENT
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: getColor(hotspot.type) }}>
            {hotspot.city}
          </div>
          <div style={{ fontSize: '10px', color: '#4a6080', marginTop: '2px' }}>
            {hotspot.lat}, {hotspot.lng}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#1e2d3d',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '12px'
          }}
        >✕</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '14px' }}>
        {[
          { label: 'FRP', value: `${hotspot.frp}`, unit: 'MW' },
          { label: 'Confidence', value: hotspot.confidence === 'high' ? '92%' : hotspot.confidence === 'nominal' ? '65%' : '38%', unit: '' },
          { label: 'Source', value: 'VIIRS', unit: '' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#131f2e',
            borderRadius: '6px',
            padding: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>{s.value}</div>
            {s.unit && <div style={{ fontSize: '9px', color: '#4a6080' }}>{s.unit}</div>}
            <div style={{ fontSize: '9px', color: '#4a6080', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Classification Breakdown */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '9px', color: '#4a6080', letterSpacing: '1px', marginBottom: '8px' }}>
          SOURCE CLASSIFICATION
        </div>
        {classData.map(c => (
          <div key={c.label} style={{ marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>{c.label}</span>
              <span style={{ fontSize: '10px', color: c.color, fontWeight: '600' }}>{c.value}%</span>
            </div>
            <div style={{ background: '#1e2d3d', borderRadius: '2px', height: '4px' }}>
              <div style={{
                width: `${c.value}%`,
                height: '100%',
                background: c.color,
                borderRadius: '2px',
                transition: 'width 0.5s ease'
              }}/>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Score */}
      <div style={{
        background: '#131f2e',
        borderRadius: '6px',
        padding: '10px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <div>
          <div style={{ fontSize: '9px', color: '#4a6080', marginBottom: '2px' }}>RISK SCORE</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: getColor(hotspot.type) }}>
            {risk.score}<span style={{ fontSize: '12px', color: '#4a6080' }}>/100</span>
          </div>
          <div style={{ fontSize: '9px', color: getColor(hotspot.type) }}>{risk.label}</div>
        </div>
        <div style={{
          width: '50px', height: '50px',
          borderRadius: '50%',
          border: `3px solid ${getColor(hotspot.type)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', fontWeight: '700',
          color: getColor(hotspot.type)
        }}>
          {risk.score}
        </div>
      </div>

      {/* Generate Report Button */}
      <button style={{
        width: '100%',
        padding: '10px',
        background: getColor(hotspot.type),
        border: 'none',
        borderRadius: '6px',
        color: '#000',
        fontWeight: '700',
        fontSize: '11px',
        cursor: 'pointer',
        letterSpacing: '1px'
      }}>
        📄 GENERATE REPORT
      </button>

    </div>
  )
}

export default EventDetail