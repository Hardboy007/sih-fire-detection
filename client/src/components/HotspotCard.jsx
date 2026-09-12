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

const getIcon = (type) => {
  switch (type) {
    case "Wildfire":
      return "🔥";
    case "Industrial Fire":
      return "🏭";
    case "Persistent Thermal Source":
      return "♨️";
    case "Low Risk":
      return "📍";
    default:
      return "•";
  }
};

const getFRPBar = (frp) => Math.min((frp / 300) * 100, 100);

function HotspotCard({ hotspot, isSelected, onClick }) {
  const color = getColor(hotspot.type);
  const frpPct = getFRPBar(hotspot.frp);

  return (
    <div
      onClick={() => onClick && onClick(hotspot)}
      style={{
        background: isSelected ? "#1a2a3e" : "#131f2e",
        borderRadius: "12px",
        padding: "13px 14px",
        borderTop: `1px solid ${isSelected ? color + "50" : "#1e2d3d"}`,
        borderRight: `1px solid ${isSelected ? color + "50" : "#1e2d3d"}`,
        borderBottom: `1px solid ${isSelected ? color + "50" : "#1e2d3d"}`,
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
          ? color + "55"
          : "#1e2d3d";
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "4px",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            minWidth: 0,
          }}
        >
          <span style={{ fontSize: "15px", lineHeight: 1, flexShrink: 0 }}>
            {getIcon(hotspot.type)}
          </span>
          <span
            style={{
              fontWeight: "700",
              fontSize: "14px",
              color: "#f1f5f9",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {hotspot.city}
          </span>
        </div>
        <span
          style={{
            fontSize: "10px",
            padding: "3px 9px",
            borderRadius: "20px",
            background: `${color}18`,
            border: `1px solid ${color}35`,
            color: color,
            fontWeight: "700",
            letterSpacing: "0.5px",
            flexShrink: 0,
          }}
        >
          {getRiskLabel(hotspot.type)}
        </span>
      </div>

      {/* Type */}
      <div
        style={{
          fontSize: "12px",
          color: color,
          fontWeight: "500",
          opacity: 0.9,
          marginBottom: "3px",
        }}
      >
        {hotspot.type}
      </div>

      {/* Coordinates */}
      <div style={{ fontSize: "11px", color: "#4a6080", marginBottom: "10px" }}>
        {Number(hotspot.lat).toFixed(4)}°N,&nbsp;
        {Number(hotspot.lng).toFixed(4)}°E
      </div>

      {/* FRP bar */}
      <div style={{ marginBottom: "10px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "5px",
          }}
        >
          <span
            style={{ fontSize: "11px", color: "#6a8aaa", fontWeight: "500" }}
          >
            Fire Radiative Power
          </span>
          <span style={{ fontSize: "12px", color: color, fontWeight: "700" }}>
            {hotspot.frp} MW
          </span>
        </div>
        <div
          style={{
            height: "5px",
            borderRadius: "4px",
            background: "#0f1623",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${frpPct}%`,
              borderRadius: "4px",
              background: color,
              opacity: 0.85,
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      {/* Data grid — same fields as original */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px",
          background: "#0f1623",
          borderRadius: "8px",
          padding: "10px 12px",
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
          <div key={d.label}>
            <div
              style={{
                fontSize: "10px",
                color: "#3a5570",
                fontWeight: "500",
                marginBottom: "1px",
              }}
            >
              {d.label}
            </div>
            <div
              style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}
            >
              {d.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HotspotCard;
