import { useState, useEffect } from "react";

const getStats = (hotspots) => {
  if (!hotspots || hotspots.length === 0)
    return {
      total: 0,
      high: 0,
      medium: 0,
      low: 0,
      persistent: 0,
    };

  const total = hotspots.length;
  const high = hotspots.filter((h) => parseFloat(h.frp) > 100).length;
  const medium = hotspots.filter(
    (h) => parseFloat(h.frp) > 50 && parseFloat(h.frp) <= 100,
  ).length;
  const low = hotspots.filter(
    (h) => parseFloat(h.frp) <= 50 && h.confidence === "low",
  ).length;
  const persistent = hotspots.filter((h) => h.confidence === "nominal").length;

  return { total, high, medium, low, persistent };
};

function AnimatedValue({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    setVal(0)
    if (target === 0) return
    let start = 0;
    const step = () => {
      start += 1;
      setVal(start);
      if (start < target) requestAnimationFrame(step);
    };
    const t = setTimeout(() => requestAnimationFrame(step), 200);
    return () => clearTimeout(t);
  }, [target]);
  return <>{String(val).padStart(2, '0')}</>;
}

export default function StatsBar({ hotspots }) {
  const processed = hotspots
    ? hotspots
        .map((h) => ({
          frp: parseFloat(h.frp) || 0,
          type:
            parseFloat(h.frp) > 100
              ? "Wildfire"
              : parseFloat(h.frp) > 50
                ? "Industrial Fire"
                : parseFloat(h.frp) > 20
                  ? "Persistent Thermal Source"
                  : "Low Risk",
        }))
        .filter((h) => h.frp > 0)
    : [];

  const total = processed.length;
  const high = processed.filter((h) => h.frp > 50).length;
  const medium = processed.filter((h) => h.frp > 20 && h.frp <= 50).length;
  const low = processed.filter((h) => h.frp <= 20).length;
  const persistent = processed.filter(
    (h) => h.type === "Persistent Thermal Source",
  ).length;

  const stats = [
    {
      label: "Total Events",
      value: total,
      change: "Live",
      color: "#38bdf8",
      accent: "rgba(56,189,248,0.12)",
      border: "rgba(56,189,248,0.2)",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
        </svg>
      ),
    },
    {
      label: "High Risk",
      value: high,
      sub: "Critical · Immediate action",
      color: "#f87171",
      accent: "rgba(248,113,113,0.1)",
      border: "rgba(248,113,113,0.22)",
      pulse: high > 0,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
    },
    {
      label: "Medium Risk",
      value: medium,
      sub: "Review required",
      color: "#fb923c",
      accent: "rgba(251,146,60,0.1)",
      border: "rgba(251,146,60,0.2)",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    {
      label: "Low Risk",
      value: low,
      sub: "Under monitoring",
      color: "#4ade80",
      accent: "rgba(74,222,128,0.1)",
      border: "rgba(74,222,128,0.18)",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "Persistent Sources",
      value: persistent,
      sub: "Ongoing · Unresolved",
      color: "#c084fc",
      accent: "rgba(192,132,252,0.1)",
      border: "rgba(192,132,252,0.2)",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@600;700&display=swap');
        .stats-bar * { box-sizing: border-box; margin: 0; padding: 0; }
        .stats-bar { display: flex; gap: 10px; padding: 10px 16px; background: #060d16; border-bottom: 1px solid rgba(255,255,255,0.06); font-family: 'Inter', sans-serif; }
        .stat-card { flex: 1; position: relative; border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; transition: transform 0.18s ease; cursor: default; overflow: hidden; }
        .stat-card:hover { transform: translateY(-2px); }
        .stat-top { display: flex; align-items: center; justify-content: space-between; }
        .stat-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .stat-badge { font-size: 9.5px; font-weight: 600; letter-spacing: 0.4px; padding: 3px 7px; border-radius: 20px; background: rgba(34,197,94,0.14); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
        .stat-value { font-family: 'JetBrains Mono', monospace; font-size: 24px; font-weight: 700; line-height: 1; letter-spacing: -1px; }
        .stat-label { font-size: 10px; font-weight: 500; color: rgba(255,255,255,0.38); letter-spacing: 0.2px; margin-top: 2px; }
        .stat-sub { font-size: 9px; font-weight: 500; letter-spacing: 0.2px; margin-top: 1px; opacity: 0.75; }
        .divider-line { height: 1px; background: currentColor; opacity: 0.12; margin: 2px 0 2px; }
        @keyframes pulse-ring { 0% { box-shadow: 0 0 0 0 rgba(248,113,113,0.35); } 70% { box-shadow: 0 0 0 6px rgba(248,113,113,0); } 100% { box-shadow: 0 0 0 0 rgba(248,113,113,0); } }
        .pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: #f87171; animation: pulse-ring 1.6s ease-out infinite; flex-shrink: 0; }
      `}</style>

      <div className="stats-bar">
        {stats.map((s, i) => (
          <div
            key={i}
            className="stat-card"
            style={{ background: s.accent, border: `1px solid ${s.border}` }}
          >
            <div className="stat-top">
              <div
                className="stat-icon"
                style={{
                  background: s.accent,
                  color: s.color,
                  border: `1px solid ${s.border}`,
                }}
              >
                {s.icon}
              </div>
              {s.change && <span className="stat-badge">{s.change}</span>}
              {s.pulse && <div className="pulse-dot" />}
            </div>
            <div>
              <div className="stat-value" style={{ color: s.color }}>
                <AnimatedValue target={s.value} />
              </div>
              <div className="divider-line" style={{ color: s.color }} />
              <div className="stat-label">{s.label}</div>
              {s.sub && (
                <div className="stat-sub" style={{ color: s.color }}>
                  {s.sub}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
