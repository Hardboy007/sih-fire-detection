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

const getRiskLabel = (type) => {
  switch (type) {
    case "Wildfire":
      return "CRITICAL";
    case "Industrial Fire":
      return "HIGH";
    case "Persistent Thermal Source":
      return "MEDIUM";
    case "Low Risk":
      return "LOW";
    default:
      return "UNKNOWN";
  }
};

function HotspotCard({ hotspot, isSelected, onClick }) {
  const color = getColor(hotspot.type);

  return (
    <div
      onClick={() => onClick(hotspot)}
      style={{
        background: isSelected ? "#1a2a3e" : "#131f2e",
        borderRadius: "12px",
        padding: "13px 14px",
        border: `1px solid ${isSelected ? color + "50" : "#1e2d3d"}`,
        borderLeft: `3px solid ${color}`,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#1a2a3e";
        e.currentTarget.style.borderColor = color + "40";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = isSelected ? "#1a2a3e" : "#131f2e";
        e.currentTarget.style.borderColor = isSelected
          ? color + "50"
          : "#1e2d3d";
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "4px",
        }}
      >
        <span style={{ fontWeight: "700", fontSize: "13px", color: "#f1f5f9" }}>
          {hotspot.city}
        </span>
        <span
          style={{
            fontSize: "9px",
            padding: "3px 8px",
            borderRadius: "20px",
            background: `${color}18`,
            border: `1px solid ${color}30`,
            color: color,
            letterSpacing: "0.5px",
            fontWeight: "600",
          }}
        >
          {getRiskLabel(hotspot.type)}
        </span>
      </div>

      {/* Type */}
      <div
        style={{
          fontSize: "11px",
          color: color,
          marginBottom: "4px",
          fontWeight: "500",
          opacity: 0.85,
        }}
      >
        {hotspot.type}
      </div>

      {/* Coordinates */}
      <div style={{ fontSize: "10px", color: "#4a6080", marginBottom: "8px" }}>
        {Number(hotspot.lat).toFixed(4)}°N, {Number(hotspot.lng).toFixed(4)}°E
      </div>

      {/* Data grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5px",
          background: "#0f1623",
          borderRadius: "8px",
          padding: "8px 10px",
        }}
      >
        {[
          { label: "FRP", value: `${hotspot.frp} MW` },
          { label: "Conf", value: hotspot.confidence },
          {
            label: "Coords",
            value: `${Number(hotspot.lat).toFixed(2)}°N, ${Number(hotspot.lng).toFixed(2)}°E`,
          },
          { label: "Time", value: hotspot.time },
        ].map((d) => (
          <div key={d.label} style={{ fontSize: "10px" }}>
            <span style={{ color: "#4a6080" }}>{d.label}: </span>
            <span style={{ color: "#94a3b8" }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HotspotCard;
