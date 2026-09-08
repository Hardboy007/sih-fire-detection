import { useState } from "react";
import HotspotCard from "./HotspotCard";
const filters = [
  "ALL",
  "Wildfire",
  "Industrial Fire",
  "Persistent Thermal Source",
  "Low Risk",
];

const getColor = (type) => {
  switch (type) {
    case "Wildfire":
      return "#ef4444";
    case "Industrial Fire":
      return "#f97316";
    case "Persistent Thermal Source":
      return "#eab308";
    case "Low Risk":
      return "#22c55e";
    default:
      return "#888";
  }
};

function AlertPanel({ onHotspotSelect, selectedHotspot, realHotspots }) {
  const hotspots = realHotspots
    ? realHotspots
        .map((h, i) => ({
          id: i,
          lat: parseFloat(h.latitude),
          lng: parseFloat(h.longitude),
          frp: parseFloat(h.frp) || 0,
          confidence: h.confidence,
          type:
            parseFloat(h.frp) > 100
              ? "Wildfire"
              : parseFloat(h.frp) > 50
                ? "Industrial Fire"
                : parseFloat(h.frp) > 20
                  ? "Persistent Thermal Source"
                  : "Low Risk",
          city: h.cityName || `${parseFloat(h.latitude).toFixed(2)}°N, ${parseFloat(h.longitude).toFixed(2)}°E`,
          time: new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }))
        .filter((h) => !isNaN(h.lat) && !isNaN(h.lng) && h.frp > 0)
    : [];
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filtered =
    activeFilter === "ALL"
      ? hotspots
      : hotspots.filter((h) => h.type === activeFilter);

  const critical = hotspots.filter((h) => h.frp > 100).length;
  const thermal = hotspots.filter(
    (h) => h.type === "Persistent Thermal Source",
  ).length;
  const low = hotspots.filter((h) => h.type === "Low Risk").length;

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#0f1623",
        fontFamily: "'Inter', sans-serif",
        color: "white",
        overflow: "hidden",
      }}
    >
      <style>{`
  .alert-scroll::-webkit-scrollbar {
    width: 4px;
  }
  .alert-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .alert-scroll::-webkit-scrollbar-thumb {
    background: #2e4a63;
    border-radius: 10px;
  }
  .alert-scroll::-webkit-scrollbar-thumb:hover {
    background: #3d6080;
  }
`}</style>

      {/* Header */}
      <div
        style={{ padding: "20px 16px 14px", borderBottom: "1px solid #1e2d3d" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "4px",
          }}
        >
          <span style={{ fontSize: "15px", fontWeight: "600" }}>
            Fire Alert System
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              fontSize: "11px",
              color: "#ef4444",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#ef4444",
                display: "inline-block",
                animation: "pulse 1s infinite",
              }}
            />
            LIVE
          </span>
        </div>
        <div style={{ fontSize: "11px", color: "#4a6080" }}>
          NASA FIRMS — Live Data
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          padding: "12px",
          borderBottom: "1px solid #1e2d3d",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "8px",
        }}
      >
        {[
          { label: "CRITICAL", value: critical, color: "#ef4444" },
          { label: "THERMAL", value: thermal, color: "#eab308" },
          { label: "LOW RISK", value: low, color: "#22c55e" },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#1a2535",
              borderRadius: "10px",
              padding: "14px 8px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "26px",
                fontWeight: "700",
                color: stat.color,
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "9px",
                color: "#4a6080",
                letterSpacing: "1px",
                marginTop: "4px",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          padding: "10px 12px",
          borderBottom: "1px solid #1e2d3d",
          display: "flex",
          gap: "6px",
          flexWrap: "wrap",
        }}
      >
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: "3px 8px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontSize: "9px",
              fontWeight: "600",
              letterSpacing: "0.5px",
              background:
                activeFilter === f
                  ? f === "ALL"
                    ? "#38bdf8"
                    : getColor(f)
                  : "#1e2d3d",
              color: activeFilter === f ? "#000" : "#4a6080",
              transition: "all 0.15s",
            }}
          >
            {f === "ALL"
              ? "ALL"
              : f === "Persistent Thermal Source"
                ? "THERMAL"
                : f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Section Label */}
      <div style={{ padding: "10px 16px 6px" }}>
        <span
          style={{ fontSize: "9px", color: "#4a6080", letterSpacing: "2px" }}
        >
          CURRENT INCIDENTS ({filtered.length})
        </span>
      </div>

      {/* Cards */}
      <div
        className="alert-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 12px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        {filtered.map((h) => (
          <HotspotCard
            key={h.id}
            hotspot={h}
            isSelected={selectedHotspot?.id === h.id}
            onClick={onHotspotSelect}
          />
        ))}
        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#4a6080",
              fontSize: "12px",
              marginTop: "20px",
            }}
          >
            No incidents found
          </div>
        )}
      </div>

      {/* Legend */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #1e2d3d",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px",
        }}
      >
        {[
          { label: "Wildfire", color: "#ef4444" },
          { label: "Industrial Fire", color: "#f97316" },
          { label: "Persistent Thermal", color: "#eab308" },
          { label: "Low Risk", color: "#22c55e" },
        ].map((l) => (
          <div
            key={l.label}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: l.color,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: "10px", color: "#4a6080" }}>
              {l.label}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          padding: "8px 16px",
          borderTop: "1px solid #1e2d3d",
          fontSize: "9px",
          color: "#2a4060",
          letterSpacing: "1.5px",
          textAlign: "center",
        }}
      >
        INDIA · SATELLITE · FIRMS OVERLAY
      </div>
    </div>
  );
}

export default AlertPanel;
