import { useState } from "react";
import Map from "../components/Map";
import AlertPanel from "../components/AlertPanel";
import StatsBar from "../components/StatsBar";
import EventDetail from "../components/EventDetail";

function Dashboard() {
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  const now = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        background: "#0a0a0f",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* NAVBAR */}
      <div
        style={{
          height: "56px",
          background: "#0f1623",
          borderBottom: "1px solid #1e2d3d",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          zIndex: 1000,
          flexShrink: 0,
        }}
      >
        {/* Left - Logo + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              background: "radial-gradient(circle, #ff4500, #cc0000)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              boxShadow: "0 0 14px #ff450055",
              flexShrink: 0,
            }}
          >
            🔥
          </div>
          <div>
            <div
              style={{
                color: "#f1f5f9",
                fontSize: "14px",
                fontWeight: "700",
                letterSpacing: "0.3px",
              }}
            >
              Agni Drishti
            </div>
            <div
              style={{
                color: "#4a6080",
                fontSize: "10px",
                fontWeight: "500",
              }}
            >
              Industrial Fire Detection · NASA FIRMS
            </div>
          </div>
        </div>

        {/* Center - Status pills */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {[
            { label: "System", value: "Online", color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)" },
            { label: "Source", value: "NASA FIRMS", color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.2)" },
            { label: "Coverage", value: "India", color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.15)" },
            { label: "Mode", value: "Live", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", pulse: true },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: item.bg,
                border: `1px solid ${item.border}`,
                borderRadius: "20px",
                padding: "4px 10px",
              }}
            >
              {item.pulse && (
                <span style={{
                  width: "5px", height: "5px",
                  borderRadius: "50%",
                  background: "#ef4444",
                  display: "inline-block",
                  animation: "pulse 1.4s infinite",
                  flexShrink: 0,
                }} />
              )}
              <span style={{ fontSize: "10px", color: "#4a6080", fontWeight: "500" }}>
                {item.label}:
              </span>
              <span style={{ fontSize: "10px", color: item.color, fontWeight: "600" }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Right - Time */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "flex-end",
          background: "rgba(34,197,94,0.08)",
          border: "1px solid rgba(34,197,94,0.15)",
          borderRadius: "10px",
          padding: "5px 12px",
        }}>
          <div style={{ color: "#4a6080", fontSize: "9px", fontWeight: "600", letterSpacing: "0.5px" }}>
            IST
          </div>
          <div style={{ color: "#22c55e", fontSize: "12px", fontWeight: "600" }}>
            {now}
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <StatsBar />

      {/* MAIN CONTENT */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Map selectedHotspot={selectedHotspot} />
          {selectedHotspot && (
            <EventDetail
              hotspot={selectedHotspot}
              onClose={() => setSelectedHotspot(null)}
            />
          )}
        </div>
        <div
          style={{
            width: "320px",
            background: "#0f1623",
            borderLeft: "1px solid #1e2d3d",
            overflowY: "auto",
          }}
        >
          <AlertPanel
            onHotspotSelect={setSelectedHotspot}
            selectedHotspot={selectedHotspot}
          />
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;