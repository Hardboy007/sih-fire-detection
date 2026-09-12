import { jsPDF } from "jspdf";

function EventDetail({ hotspot, onClose }) {
  if (!hotspot) return null;

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

  const classifications = {
    Wildfire: [
      { label: "Forest Fire", value: 72, color: "#ef4444" },
      { label: "Agricultural Burning", value: 18, color: "#f97316" },
      { label: "Industrial Fire", value: 7, color: "#eab308" },
      { label: "False Positive", value: 3, color: "#22c55e" },
    ],
    "Industrial Fire": [
      { label: "Industrial Fire", value: 78, color: "#f97316" },
      { label: "Flare Stack", value: 14, color: "#eab308" },
      { label: "Forest Fire", value: 5, color: "#ef4444" },
      { label: "False Positive", value: 3, color: "#22c55e" },
    ],
    "Persistent Thermal Source": [
      { label: "Flare Stack", value: 65, color: "#eab308" },
      { label: "Industrial Furnace", value: 22, color: "#f97316" },
      { label: "Industrial Fire", value: 10, color: "#ef4444" },
      { label: "False Positive", value: 3, color: "#22c55e" },
    ],
    "Low Risk": [
      { label: "Agricultural Burning", value: 55, color: "#22c55e" },
      { label: "False Positive", value: 30, color: "#94a3b8" },
      { label: "Industrial Fire", value: 10, color: "#f97316" },
      { label: "Forest Fire", value: 5, color: "#ef4444" },
    ],
  };

  const getRiskScore = (frp) => {
    if (frp > 150) return { score: 85, label: "CRITICAL" };
    if (frp > 80) return { score: 60, label: "HIGH" };
    if (frp > 40) return { score: 35, label: "MEDIUM" };
    return { score: 15, label: "LOW" };
  };

  const risk = getRiskScore(hotspot.frp);
  const classData =
    classifications[hotspot.type] || classifications["Low Risk"];
  const color = getColor(hotspot.type);
  const icon = getIcon(hotspot.type);

  const confValue =
    hotspot.confidence === "high"
      ? "92%"
      : hotspot.confidence === "nominal"
        ? "65%"
        : "38%";

  // arc for risk dial
  const R = 22;
  const circ = 2 * Math.PI * R;
  const arc = (risk.score / 100) * circ * 0.75; // 270° sweep
  const gap = circ - arc;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        width: "296px",
        background: "#0f1623",
        border: `1px solid ${color}30`,
        borderRadius: "16px",
        padding: "18px",
        zIndex: 1000,
        fontFamily: "'Inter', sans-serif",
        color: "white",
        boxShadow: `0 12px 40px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "14px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Type badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              background: `${color}18`,
              border: `1px solid ${color}30`,
              borderRadius: "20px",
              padding: "3px 9px",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "12px", lineHeight: 1 }}>{icon}</span>
            <span
              style={{
                fontSize: "10px",
                color,
                fontWeight: "700",
                letterSpacing: "0.5px",
              }}
            >
              {(hotspot.type || "").toUpperCase()}
            </span>
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "#f1f5f9",
              letterSpacing: "-0.3px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {hotspot.city || hotspot.cityName || "Unknown"}
          </div>
          <div style={{ fontSize: "11px", color: "#4a6080", marginTop: "3px" }}>
            {hotspot.lat}, {hotspot.lng}
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "#1a2535",
            border: "1px solid #1e2d3d",
            color: "#64748b",
            cursor: "pointer",
            borderRadius: "8px",
            padding: "5px 9px",
            fontSize: "13px",
            lineHeight: 1,
            flexShrink: 0,
            marginLeft: "10px",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#f1f5f9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#64748b";
          }}
        >
          ✕
        </button>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        {[
          { label: "FRP", value: `${hotspot.frp}`, unit: "MW" },
          { label: "Confidence", value: confValue, unit: "" },
          { label: "Source", value: "VIIRS", unit: "" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#1a2535",
              borderRadius: "10px",
              padding: "10px 8px",
              textAlign: "center",
              border: "1px solid #1e2d3d",
            }}
          >
            <div
              style={{ fontSize: "16px", fontWeight: "700", color: "#f1f5f9" }}
            >
              {s.value}
            </div>
            {s.unit && (
              <div
                style={{ fontSize: "10px", color: "#4a6080", marginTop: "1px" }}
              >
                {s.unit}
              </div>
            )}
            <div
              style={{ fontSize: "10px", color: "#4a6080", marginTop: "2px" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{ height: "1px", background: "#1e2d3d", marginBottom: "14px" }}
      />

      {/* Classification */}
      <div style={{ marginBottom: "14px" }}>
        <div
          style={{
            fontSize: "11px",
            color: "#8aaac8",
            fontWeight: "600",
            marginBottom: "10px",
          }}
        >
          Source Classification
        </div>
        {classData.map((c) => (
          <div key={c.label} style={{ marginBottom: "8px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                {c.label}
              </span>
              <span
                style={{ fontSize: "12px", color: c.color, fontWeight: "600" }}
              >
                {c.value}%
              </span>
            </div>
            <div
              style={{
                background: "#1a2535",
                borderRadius: "10px",
                height: "5px",
              }}
            >
              <div
                style={{
                  width: `${c.value}%`,
                  height: "100%",
                  background: c.color,
                  borderRadius: "10px",
                  transition: "width 0.5s ease",
                  opacity: 0.85,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{ height: "1px", background: "#1e2d3d", marginBottom: "14px" }}
      />

      {/* Risk Score — SVG arc dial */}
      <div
        style={{
          background: "#1a2535",
          borderRadius: "12px",
          padding: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
          border: "1px solid #1e2d3d",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              color: "#64748b",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            Risk Score
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: "800",
              color,
              lineHeight: 1,
            }}
          >
            {risk.score}
            <span
              style={{ fontSize: "13px", color: "#4a6080", fontWeight: "400" }}
            >
              /100
            </span>
          </div>
          <div
            style={{
              fontSize: "10px",
              color,
              fontWeight: "700",
              marginTop: "5px",
              background: `${color}18`,
              display: "inline-block",
              padding: "2px 8px",
              borderRadius: "10px",
              border: `1px solid ${color}25`,
            }}
          >
            {risk.label}
          </div>
        </div>

        {/* Arc dial */}
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          style={{ transform: "rotate(135deg)" }}
        >
          {/* track */}
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke="#1e2d3d"
            strokeWidth="5"
            strokeDasharray={`${circ * 0.75} ${circ}`}
            strokeLinecap="round"
          />
          {/* fill */}
          <circle
            cx="32"
            cy="32"
            r={R}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={`${arc} ${circ}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
          {/* center score */}
          <text
            x="32"
            y="36"
            textAnchor="middle"
            style={{
              fill: color,
              fontSize: "13px",
              fontWeight: "800",
              fontFamily: "Inter, sans-serif",
              transform: "rotate(-135deg)",
              transformOrigin: "32px 32px",
            }}
          >
            {risk.score}
          </text>
        </svg>
      </div>

      {/* Generate Report */}
      <button
        onClick={() => {
          const doc = new jsPDF();

          // Header
          doc.setFillColor(15, 22, 35);
          doc.rect(0, 0, 210, 40, "F");
          doc.setTextColor(255, 69, 0);
          doc.setFontSize(20);
          doc.setFont("helvetica", "bold");
          doc.text("AGNI DRISHTI", 20, 20);
          doc.setTextColor(100, 120, 140);
          doc.setFontSize(10);
          doc.text("Industrial Fire Detection System — NASA FIRMS", 20, 30);

          // Incident Details
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          doc.text("Incident Report", 20, 55);

          doc.setDrawColor(200, 200, 200);
          doc.line(20, 58, 190, 58);

          doc.setFontSize(12);
          doc.setFont("helvetica", "normal");
          const details = [
            ["Location", hotspot.city || hotspot.cityName || "Unknown"],
            ["Classification", hotspot.type || "Unknown"],
            ["FRP", `${hotspot.frp} MW`],
            ["Confidence", hotspot.confidence || "N/A"],
            [
              "Coordinates",
              `${Number(hotspot.lat || hotspot.latitude).toFixed(4)}°N, ${Number(hotspot.lng || hotspot.longitude).toFixed(4)}°E`,
            ],
            ["Data Source", "NASA FIRMS — MODIS/VIIRS"],
            ["Satellite", hotspot.satellite || "Terra/Aqua"],
            [
              "Date",
              hotspot.acq_date || new Date().toISOString().split("T")[0],
            ],
            [
              "Report Generated",
              new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            ],
          ];

          let y = 70;
          details.forEach(([label, value]) => {
            doc.setFont("helvetica", "bold");
            doc.setTextColor(80, 80, 80);
            doc.text(`${label}:`, 20, y);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            doc.text(String(value), 80, y);
            y += 10;
          });

          // Risk Score
          y += 5;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(14);
          doc.setTextColor(255, 69, 0);
          doc.text(
            `Risk Score: ${hotspot.frp > 150 ? 85 : hotspot.frp > 80 ? 60 : hotspot.frp > 40 ? 35 : 15}/100`,
            20,
            y,
          );

          // Footer
          doc.setFontSize(9);
          doc.setTextColor(150, 150, 150);
          doc.text(
            "Generated by Agni Drishti — AI-Based Industrial Fire Detection System",
            20,
            280,
          );
          doc.text(
            "Data Source: NASA FIRMS | Classification: Rule-Based AI Model",
            20,
            286,
          );

          doc.save(
            `AgniDrishti_Report_${hotspot.city || "incident"}_${new Date().toISOString().split("T")[0]}.pdf`,
          );
        }}
        style={{
          width: "100%",
          padding: "12px",
          background: `${color}15`,
          border: `1px solid ${color}40`,
          borderRadius: "10px",
          color,
          fontWeight: "700",
          fontSize: "12px",
          cursor: "pointer",
          letterSpacing: "0.3px",
          transition: "all 0.15s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "7px",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = `${color}25`)}
        onMouseLeave={(e) => (e.currentTarget.style.background = `${color}15`)}
      >
        <span style={{ fontSize: "14px" }}>📄</span>
        Generate Report
      </button>
    </div>
  );
}

export default EventDetail;
