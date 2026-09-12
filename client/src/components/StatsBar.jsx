import { useState, useEffect } from "react";

function AnimatedValue({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    setVal(0);
    if (target === 0) return;
    let start = 0;
    const step = () => {
      start += 1;
      setVal(start);
      if (start < target) requestAnimationFrame(step);
    };
    const t = setTimeout(() => requestAnimationFrame(step), 200);
    return () => clearTimeout(t);
  }, [target]);
  return <>{String(val).padStart(2, "0")}</>;
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
      sub: "Live feed",
      color: "#38bdf8",
      accent: "rgba(56,189,248,0.08)",
      border: "rgba(56,189,248,0.16)",
      icon: (
        <svg
          width="16"
          height="16"
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
      sub: "Immediate action",
      color: "#f87171",
      accent: "rgba(248,113,113,0.08)",
      border: "rgba(248,113,113,0.18)",
      pulse: high > 0,
      icon: (
        <svg
          width="16"
          height="16"
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
      accent: "rgba(251,146,60,0.08)",
      border: "rgba(251,146,60,0.16)",
      icon: (
        <svg
          width="16"
          height="16"
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
      accent: "rgba(74,222,128,0.08)",
      border: "rgba(74,222,128,0.14)",
      icon: (
        <svg
          width="16"
          height="16"
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
      accent: "rgba(192,132,252,0.08)",
      border: "rgba(192,132,252,0.16)",
      icon: (
        <svg
          width="16"
          height="16"
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

  const totalFrp = processed.reduce((sum, h) => sum + h.frp, 0).toFixed(0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .stats-bar {
          display: flex;
          align-items: stretch;
          gap: 0;
          padding: 0;
          background: #0a1020;
          border-bottom: 1px solid #1e2d3d;
          font-family: 'Inter', sans-serif;
        }

        .stat-card {
          flex: 1;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          cursor: default;
          border-right: 1px solid #1e2d3d;
          transition: background 0.15s;
          position: relative;
        }
        .stat-card:last-child { border-right: none; }
        .stat-card:hover { background: rgba(255,255,255,0.02); }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .stat-icon {
          width: 26px; height: 26px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-value {
          font-size: 26px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.5px;
          font-variant-numeric: tabular-nums;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 500;
          color: #6a8aaa;
          margin-top: 2px;
        }

        .stat-sub {
          font-size: 10px;
          font-weight: 400;
          color: #3a5570;
          margin-top: 1px;
        }

        .stat-top-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          opacity: 0.5;
        }

        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(248,113,113,0.4); }
          70%  { box-shadow: 0 0 0 5px rgba(248,113,113,0); }
          100% { box-shadow: 0 0 0 0 rgba(248,113,113,0); }
        }
        .pulse-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #f87171;
          animation: pulseRing 1.6s ease-out infinite;
          flex-shrink: 0;
        }

        .frp-pill {
          font-size: 10px;
          font-weight: 600;
          color: #38bdf8;
          background: rgba(56,189,248,0.1);
          border: 1px solid rgba(56,189,248,0.18);
          border-radius: 20px;
          padding: 2px 8px;
        }
      `}</style>

      <div className="stats-bar">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            {/* Top color strip */}
            <div className="stat-top-bar" style={{ background: s.color }} />

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
              {s.pulse && <div className="pulse-dot" />}
              {/* Total FRP shown only on first card */}
              {i === 0 && <span className="frp-pill">{totalFrp} MW</span>}
            </div>

            <div>
              <div className="stat-value" style={{ color: s.color }}>
                <AnimatedValue target={s.value} />
              </div>
              <div className="stat-label">{s.label}</div>
              {s.sub && <div className="stat-sub">{s.sub}</div>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
