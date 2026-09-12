import { useState, useEffect } from "react";
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
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hotspots = realHotspots
    ? realHotspots
        .map((h, i) => ({
          id: i,
          lat: parseFloat(h.latitude),
          lng: parseFloat(h.longitude),
          frp: parseFloat(h.frp) || 0,
          latitude: h.latitude,
          longitude: h.longitude,
          confidence: h.confidence,
          type:
            parseFloat(h.frp) > 100
              ? "Wildfire"
              : parseFloat(h.frp) > 50
                ? "Industrial Fire"
                : parseFloat(h.frp) > 20
                  ? "Persistent Thermal Source"
                  : "Low Risk",
          city:
            h.cityName || h.city
              ? `${h.cityName || h.city}${h.country ? ", " + h.country : ""}`
              : `${parseFloat(h.latitude).toFixed(2)}°N, ${parseFloat(h.longitude).toFixed(2)}°E`,
          time: new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }))
        .filter((h) => !isNaN(h.lat) && !isNaN(h.lng) && h.frp > 0)
        .slice(0, 100)
    : [];

  const filtered =
    activeFilter === "ALL"
      ? hotspots
      : hotspots.filter((h) => h.type === activeFilter);

  const critical = hotspots.filter((h) => h.frp > 100).length;
  const thermal = hotspots.filter(
    (h) => h.type === "Persistent Thermal Source",
  ).length;
  const low = hotspots.filter((h) => h.type === "Low Risk").length;

  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .alert-scroll::-webkit-scrollbar { width: 4px; }
        .alert-scroll::-webkit-scrollbar-track { background: transparent; }
        .alert-scroll::-webkit-scrollbar-thumb { background: #2e4a63; border-radius: 10px; }
        .alert-scroll::-webkit-scrollbar-thumb:hover { background: #3d6080; }

        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .live-dot { animation: livePulse 1.6s ease-in-out infinite; }

        .filter-btn {
          cursor: pointer;
          border: none;
          border-radius: 20px;
          padding: 5px 13px;
          font-size: 11px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.3px;
          transition: all 0.15s;
        }

        .stat-card {
          background: #1a2535;
          border-radius: 10px;
          padding: 16px 8px 12px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hotspot-wrapper {
          border-radius: 10px;
          border: 1px solid transparent;
          transition: border-color 0.2s, background 0.2s;
        }
        .hotspot-wrapper.selected {
          border-color: rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.03);
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          padding: "18px 18px 14px",
          borderBottom: "1px solid #1e2d3d",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "17px",
                fontWeight: "700",
                letterSpacing: "-0.2px",
              }}
            >
              Fire Alert System
            </div>
            <div
              style={{ fontSize: "12px", color: "#4a6080", marginTop: "3px" }}
            >
              NASA FIRMS — Live Data
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                justifyContent: "flex-end",
              }}
            >
              <span
                className="live-dot"
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "#ef4444",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                }}
              >
                LIVE
              </span>
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#4a6080",
                marginTop: "4px",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {timeStr}
            </div>
            <div
              style={{ fontSize: "11px", color: "#2a4060", marginTop: "1px" }}
            >
              {dateStr}
            </div>
          </div>
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
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: s.color,
                opacity: 0.7,
              }}
            />
            <div
              style={{
                fontSize: "32px",
                fontWeight: "800",
                color: s.color,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#6a8aaa",
                letterSpacing: "0.8px",
                marginTop: "5px",
                fontWeight: "500",
              }}
            >
              {s.label}
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
        {filters.map((f) => {
          const isActive = activeFilter === f;
          const col = f === "ALL" ? "#38bdf8" : getColor(f);
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="filter-btn"
              style={{
                background: isActive ? col : "#1e2d3d",
                color: isActive ? "#000" : "#6a8aaa",
              }}
            >
              {f === "ALL"
                ? "All"
                : f === "Persistent Thermal Source"
                  ? "Thermal"
                  : f}
            </button>
          );
        })}
      </div>

      {/* Section label */}
      <div
        style={{
          padding: "12px 16px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: "600", color: "#8aaac8" }}>
          Active Incidents
        </span>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#8aaac8",
            background: "#1e2d3d",
            borderRadius: "10px",
            padding: "2px 10px",
          }}
        >
          {filtered.length}
        </span>
      </div>

      {/* Cards */}
      <div
        className="alert-scroll"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0 10px 10px",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        {filtered.map((h) => (
          <div
            key={h.id}
            className={`hotspot-wrapper${selectedHotspot?.id === h.id ? " selected" : ""}`}
            style={{
              borderLeftWidth: "3px",
              borderLeftStyle: "solid",
              borderLeftColor:
                selectedHotspot?.id === h.id ? getColor(h.type) : "transparent",
            }}
          >
            <HotspotCard
              hotspot={h}
              isSelected={selectedHotspot?.id === h.id}
              onClick={onHotspotSelect}
            />
          </div>
        ))}
        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: "#4a6080",
              fontSize: "13px",
              marginTop: "24px",
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
          gap: "8px",
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
            style={{ display: "flex", alignItems: "center", gap: "7px" }}
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
            <span style={{ fontSize: "11px", color: "#6a8aaa" }}>
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
          fontSize: "10px",
          color: "#2a4060",
          letterSpacing: "1px",
          textAlign: "center",
        }}
      >
        INDIA · SATELLITE · FIRMS OVERLAY
      </div>
    </div>
  );
}

export default AlertPanel;
