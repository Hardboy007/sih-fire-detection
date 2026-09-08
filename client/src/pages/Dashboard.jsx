import Map from "../components/Map";
import AlertPanel from "../components/AlertPanel";

function Dashboard() {
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
        fontFamily: "monospace",
      }}
    >
      {/* TOP NAVBAR */}
      <div
        style={{
          height: "52px",
          background: "#0f1623",
          borderBottom: "1px solid #1e2d3d",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          zIndex: 1000,
          flexShrink: 0,
        }}
      >
        {/* Left - Logo + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "radial-gradient(circle, #ff4500, #ff0000)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              boxShadow: "0 0 12px #ff450088",
            }}
          >
            🔥
          </div>
          <div>
            <div
              style={{
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              AGNI DRISHTI
            </div>
            <div
              style={{
                color: "#4a6080",
                fontSize: "9px",
                letterSpacing: "0.8px",
              }}
            >
              INDUSTRIAL FIRE DETECTION SYSTEM — POWERED BY NASA FIRMS
            </div>
          </div>
        </div>

        {/* Center - Status */}
        <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
          {[
            { label: "SYSTEM", value: "ONLINE", color: "#22c55e" },
            { label: "DATA SOURCE", value: "NASA FIRMS", color: "#38bdf8" },
            { label: "COVERAGE", value: "INDIA", color: "#ffffff" },
            { label: "MODE", value: "LIVE", color: "#ef4444", pulse: true },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#4a6080",
                  fontSize: "8px",
                  letterSpacing: "1px",
                  marginBottom: "2px",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  color: item.color,
                  fontSize: "11px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {item.pulse && (
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
                )}
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Right - Time */}
        <div style={{ textAlign: "right" }}>
          <div
            style={{ color: "#4a6080", fontSize: "8px", letterSpacing: "1px" }}
          >
            IST
          </div>
          <div
            style={{ color: "#22c55e", fontSize: "12px", fontWeight: "600" }}
          >
            {now}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Map */}
        <div style={{ flex: 1, position: "relative" }}>
          <Map />
        </div>

        {/* Alert Panel */}
        <div
          style={{
            width: "320px",
            background: "#0d0d1a",
            borderLeft: "1px solid #ff450033",
            overflowY: "auto",
          }}
        >
          <AlertPanel />
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
