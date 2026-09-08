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
      borderRadius: '14px',
      minWidth: '200px',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
    }}>
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '11px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          borderBottom: isOpen ? '1px solid #1e2d3d' : 'none',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', letterSpacing: '0.5px' }}>
          Map Layers
        </span>
        <span style={{
          color: '#4a6080', fontSize: '10px',
          background: '#1a2535',
          border: '1px solid #1e2d3d',
          borderRadius: '6px',
          padding: '2px 6px',
          lineHeight: 1.4,
        }}>
          {isOpen ? '▲' : '▼'}
        </span>
      </div>

      {isOpen && (
        <div style={{ padding: '6px' }}>
          {layers.map(layer => (
            <div
              key={layer.id}
              onClick={() => onLayerToggle(layer.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a2535'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: '15px', height: '15px',
                borderRadius: '5px',
                border: `2px solid ${layer.color}`,
                background: layer.active ? layer.color : `${layer.color}18`,
                flexShrink: 0,
                transition: 'all 0.15s',
              }}/>
              <span style={{
                fontSize: '11px',
                fontWeight: layer.active ? '600' : '400',
                color: layer.active ? '#e2e8f0' : '#4a6080',
                transition: 'color 0.15s',
              }}>
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