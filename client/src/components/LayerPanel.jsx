import { useState } from 'react'

function LayerPanel({ layers, onLayerToggle }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      zIndex: 1000,
      background: '#0f1623',
      border: '1px solid #1e2d3d',
      borderRadius: '8px',
      minWidth: '200px',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          borderBottom: isOpen ? '1px solid #1e2d3d' : 'none',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', letterSpacing: '1px' }}>
          MAP LAYERS
        </span>
        <span style={{ color: '#4a6080', fontSize: '12px' }}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div style={{ padding: '8px 0' }}>
          {layers.map(layer => (
            <div
              key={layer.id}
              onClick={() => onLayerToggle(layer.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '7px 14px',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1e2d3d'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: '14px', height: '14px',
                borderRadius: '3px',
                border: `2px solid ${layer.color}`,
                background: layer.active ? layer.color : 'transparent',
                flexShrink: 0,
                transition: 'all 0.15s'
              }}/>
              <span style={{ fontSize: '11px', color: layer.active ? '#ffffff' : '#4a6080' }}>
                {layer.icon} {layer.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LayerPanel