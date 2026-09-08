const hotspots = [
  { id: 1, city: 'Delhi', type: 'Wildfire', frp: 200, confidence: 'high', time: '10:32 AM', lat: '28.70°N', lng: '77.10°E' },
  { id: 2, city: 'Kolkata', type: 'Industrial Fire', frp: 120, confidence: 'high', time: '10:15 AM', lat: '22.57°N', lng: '88.36°E' },
  { id: 3, city: 'Ahmedabad', type: 'Industrial Fire', frp: 80, confidence: 'nominal', time: '09:58 AM', lat: '23.02°N', lng: '72.57°E' },
  { id: 4, city: 'Bangalore', type: 'Persistent Thermal Source', frp: 55, confidence: 'nominal', time: '09:45 AM', lat: '12.97°N', lng: '77.59°E' },
  { id: 5, city: 'Mumbai', type: 'Persistent Thermal Source', frp: 45, confidence: 'nominal', time: '09:30 AM', lat: '19.07°N', lng: '72.87°E' },
  { id: 6, city: 'Chennai', type: 'Low Risk', frp: 30, confidence: 'low', time: '09:10 AM', lat: '13.08°N', lng: '80.27°E' },
]

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

function AlertPanel() {
  const critical = hotspots.filter(h => h.frp > 100).length
  const thermal = hotspots.filter(h => h.type === 'Persistent Thermal Source').length
  const low = hotspots.filter(h => h.type === 'Low Risk').length

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#0f1623',
      fontFamily: "'Inter', sans-serif",
      color: 'white',
    }}>

      {/* Header */}
      <div style={{
        padding: '20px 16px 14px',
        borderBottom: '1px solid #1e2d3d',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '15px', fontWeight: '600', letterSpacing: '0.3px' }}>
            Fire Alert System
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#ef4444' }}>
            <span style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: '#ef4444',
              display: 'inline-block',
              animation: 'pulse 1s infinite'
            }}/>
            LIVE
          </span>
        </div>
        <div style={{ fontSize: '11px', color: '#4a6080', letterSpacing: '0.5px' }}>
          NASA FIRMS — Live Data
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '1px',
        background: '#1e2d3d',
        borderBottom: '1px solid #1e2d3d',
      }}>
        {[
          { label: 'CRITICAL', value: critical, color: '#ef4444' },
          { label: 'THERMAL', value: thermal, color: '#eab308' },
          { label: 'LOW RISK', value: low, color: '#22c55e' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#0f1623',
            padding: '14px 8px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '26px', fontWeight: '700', color: stat.color, lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '9px', color: '#4a6080', letterSpacing: '1px', marginTop: '4px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Section Label */}
      <div style={{ padding: '12px 16px 6px' }}>
        <span style={{ fontSize: '9px', color: '#4a6080', letterSpacing: '2px' }}>
          CURRENT INCIDENTS
        </span>
      </div>

      {/* Alert Cards */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {hotspots.map((h) => (
          <div key={h.id}
            style={{
              background: '#131f2e',
              borderRadius: '6px',
              padding: '12px',
              borderLeft: `3px solid ${getColor(h.type)}`,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1a2a3e'}
            onMouseLeave={e => e.currentTarget.style.background = '#131f2e'}
          >
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontWeight: '600', fontSize: '13px' }}>{h.city}</span>
              <span style={{
                fontSize: '9px',
                padding: '2px 7px',
                borderRadius: '3px',
                background: `${getColor(h.type)}22`,
                color: getColor(h.type),
                letterSpacing: '0.8px',
                fontWeight: '600'
              }}>
                {getRiskLabel(h.type)}
              </span>
            </div>

            {/* Type */}
            <div style={{ fontSize: '11px', color: getColor(h.type), marginBottom: '8px', fontWeight: '500' }}>
              {h.type}
            </div>

            {/* Details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
              {[
                { label: 'FRP', value: `${h.frp} MW` },
                { label: 'Conf', value: h.confidence },
                { label: 'Coords', value: `${h.lat}` },
                { label: 'Time', value: h.time },
              ].map(d => (
                <div key={d.label} style={{ fontSize: '10px' }}>
                  <span style={{ color: '#4a6080' }}>{d.label}: </span>
                  <span style={{ color: '#94a3b8' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #1e2d3d',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '6px'
      }}>
        {[
          { label: 'Wildfire', color: '#ef4444' },
          { label: 'Industrial Fire', color: '#f97316' },
          { label: 'Persistent Thermal', color: '#eab308' },
          { label: 'Low Risk', color: '#22c55e' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '8px', height: '8px',
              borderRadius: '50%',
              background: l.color,
              flexShrink: 0
            }}/>
            <span style={{ fontSize: '10px', color: '#4a6080' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid #1e2d3d',
        fontSize: '9px',
        color: '#2a4060',
        letterSpacing: '1.5px',
        textAlign: 'center'
      }}>
        INDIA · SATELLITE · FIRMS OVERLAY
      </div>

    </div>
  )
}

export default AlertPanel