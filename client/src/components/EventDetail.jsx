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
  const color = getColor(hotspot.type)

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      width: '290px',
      background: '#0f1623',
      border: `1px solid ${color}30`,
      borderRadius: '16px',
      padding: '18px',
      zIndex: 1000,
      fontFamily: "'Inter', sans-serif",
      color: 'white',
      boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${color}15`,
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: `${color}18`, border: `1px solid ${color}30`,
            borderRadius: '20px', padding: '2px 8px', marginBottom: '8px'
          }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: color }} />
            <span style={{ fontSize: '9px', color: color, fontWeight: '600', letterSpacing: '0.5px' }}>
              {hotspot.type.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#f1f5f9', letterSpacing: '-0.3px' }}>
            {hotspot.city}
          </div>
          <div style={{ fontSize: '10px', color: '#4a6080', marginTop: '3px' }}>
            {hotspot.lat}, {hotspot.lng}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#1a2535',
            border: '1px solid #1e2d3d',
            color: '#64748b',
            cursor: 'pointer',
            borderRadius: '8px',
            padding: '5px 9px',
            fontSize: '12px',
            lineHeight: 1,
            transition: 'all 0.15s',
          }}
        >✕</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        {[
          { label: 'FRP', value: `${hotspot.frp}`, unit: 'MW' },
          { label: 'Confidence', value: hotspot.confidence === 'high' ? '92%' : hotspot.confidence === 'nominal' ? '65%' : '38%', unit: '' },
          { label: 'Source', value: 'VIIRS', unit: '' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#1a2535',
            borderRadius: '10px',
            padding: '10px 8px',
            textAlign: 'center',
            border: '1px solid #1e2d3d',
          }}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#f1f5f9' }}>{s.value}</div>
            {s.unit && <div style={{ fontSize: '9px', color: '#4a6080', marginTop: '1px' }}>{s.unit}</div>}
            <div style={{ fontSize: '9px', color: '#4a6080', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#1e2d3d', marginBottom: '14px' }} />

      {/* Classification Breakdown */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '10px' }}>
          Source Classification
        </div>
        {classData.map(c => (
          <div key={c.label} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{c.label}</span>
              <span style={{ fontSize: '11px', color: c.color, fontWeight: '600' }}>{c.value}%</span>
            </div>
            <div style={{ background: '#1a2535', borderRadius: '10px', height: '5px' }}>
              <div style={{
                width: `${c.value}%`,
                height: '100%',
                background: c.color,
                borderRadius: '10px',
                transition: 'width 0.5s ease',
                opacity: 0.85,
              }}/>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#1e2d3d', marginBottom: '14px' }} />

      {/* Risk Score */}
      <div style={{
        background: '#1a2535',
        borderRadius: '12px',
        padding: '12px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '14px',
        border: '1px solid #1e2d3d',
      }}>
        <div>
          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Risk Score</div>
          <div style={{ fontSize: '26px', fontWeight: '700', color, lineHeight: 1 }}>
            {risk.score}<span style={{ fontSize: '13px', color: '#4a6080', fontWeight: '400' }}>/100</span>
          </div>
          <div style={{
            fontSize: '10px', color, fontWeight: '600', marginTop: '3px',
            background: `${color}18`, display: 'inline-block',
            padding: '1px 7px', borderRadius: '10px', border: `1px solid ${color}25`
          }}>
            {risk.label}
          </div>
        </div>
        <div style={{
          width: '52px', height: '52px',
          borderRadius: '50%',
          border: `2.5px solid ${color}`,
          background: `${color}12`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '17px', fontWeight: '700',
          color,
        }}>
          {risk.score}
        </div>
      </div>

      {/* Generate Report Button */}
      <button style={{
        width: '100%',
        padding: '11px',
        background: `${color}18`,
        border: `1px solid ${color}40`,
        borderRadius: '10px',
        color,
        fontWeight: '700',
        fontSize: '11px',
        cursor: 'pointer',
        letterSpacing: '0.5px',
        transition: 'all 0.15s',
      }}>
        📄 Generate Report
      </button>

    </div>
  )
}

export default EventDetail