import { useState } from "react";

function LayerPanel({ layers, onLayerToggle }) {
  const [isOpen, setIsOpen] = useState(true);

  const activeLayers = layers.filter((l) => l.active).length;

  return (
    <div
      style={{
        position: "absolute",
        top: "16px",
        left: "16px",
        zIndex: 1000,
        background: "#0f1623",
        border: "1px solid #1e2d3d",
        borderRadius: "14px",
        minWidth: "210px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "12px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          borderBottom: isOpen ? "1px solid #1e2d3d" : "none",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#131f2e";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "13px" }}>🗺️</span>
          <span
            style={{ fontSize: "13px", fontWeight: "600", color: "#c8d8e8" }}
          >
            Map Layers
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {/* active count badge */}
          <span
            style={{
              fontSize: "10px",
              fontWeight: "600",
              color: "#38bdf8",
              background: "rgba(56,189,248,0.12)",
              border: "1px solid rgba(56,189,248,0.2)",
              borderRadius: "10px",
              padding: "1px 7px",
            }}
          >
            {activeLayers}/{layers.length}
          </span>
          <span style={{ color: "#4a6080", fontSize: "10px" }}>
            {isOpen ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* Layer list */}
      {isOpen && (
        <div style={{ padding: "6px" }}>
          {layers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => onLayerToggle(layer.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 10px",
                cursor: "pointer",
                borderRadius: "8px",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1a2535";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Toggle */}
              <div
                style={{
                  width: "32px",
                  height: "18px",
                  borderRadius: "9px",
                  background: layer.active ? layer.color : "#1e2d3d",
                  border: `1px solid ${layer.active ? layer.color : "#2a3f55"}`,
                  position: "relative",
                  flexShrink: 0,
                  transition: "background 0.2s, border-color 0.2s",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: layer.active ? "15px" : "2px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: layer.active ? "#fff" : "#4a6080",
                    transition: "left 0.2s, background 0.2s",
                  }}
                />
              </div>

              {/* Icon + Label */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <span
                  style={{ fontSize: "14px", lineHeight: 1, flexShrink: 0 }}
                >
                  {layer.icon}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: layer.active ? "600" : "400",
                    color: layer.active ? "#e2e8f0" : "#4a6080",
                    transition: "color 0.15s",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {layer.label}
                </span>
              </div>

              {/* Active dot */}
              {layer.active && (
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: layer.color,
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          ))}

          {/* Footer */}
          <div
            style={{
              margin: "6px 4px 2px",
              padding: "8px 6px 2px",
              borderTop: "1px solid #1a2535",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "10px", color: "#2a4060" }}>
              {activeLayers} active
            </span>
            <span
              onClick={(e) => {
                e.stopPropagation();
                layers.forEach((l) => {
                  if (!l.active) onLayerToggle(l.id);
                });
              }}
              style={{
                fontSize: "10px",
                color: "#38bdf8",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Enable all
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default LayerPanel;
