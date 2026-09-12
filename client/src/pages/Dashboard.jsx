import Map from "../components/Map";
import AlertPanel from "../components/AlertPanel";
import StatsBar from "../components/StatsBar";
import EventDetail from "../components/EventDetail";
import { fetchHotspots, fetchIndustrialZones } from "../services/api";
import { useState, useEffect } from "react";

function LoadingLine({ text, delay }) {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), delay);
    const t2 = setTimeout(() => setDone(true), delay + 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [delay]);

  if (!visible) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        animation: "fadeIn 0.3s ease",
        fontSize: "12px",
      }}
    >
      {done ? (
        <span style={{ color: "#22c55e", fontSize: "14px" }}>✓</span>
      ) : (
        <span
          style={{
            width: "10px",
            height: "10px",
            border: "2px solid #38bdf8",
            borderTopColor: "transparent",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin 0.8s linear infinite",
            flexShrink: 0,
          }}
        />
      )}
      <span style={{ color: done ? "#6a8aaa" : "#38bdf8" }}>{text}</span>
    </div>
  );
}

function Dashboard() {
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [realHotspots, setRealHotspots] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const handleHotspotSelect = (hotspot) => {
    console.log("hotspot:", hotspot);
    setSelectedHotspot(hotspot);
  };
  const [nowStr, setNowStr] = useState("");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const time = d.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const date = d.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      setNowStr({ time, date });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const fetchCityNames = async (hotspotsData) => {
    const top10 = hotspotsData.slice(0, 10);
    const withCities = await Promise.all(
      top10.map(async (h) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${h.latitude}&longitude=${h.longitude}&localityLanguage=en`,
          );
          if (!res.ok) throw new Error("API error");
          const data = await res.json();
          const city =
            data?.city || data?.locality || data?.principalSubdivision || null;
          const country = data?.countryName || null;
          return {
            ...h,
            cityName: city
              ? `${city}${country ? ", " + country : ""}`
              : `${parseFloat(h.latitude).toFixed(2)}°N, ${parseFloat(h.longitude).toFixed(2)}°E`,
          };
        } catch {
          return {
            ...h,
            cityName: `${parseFloat(h.latitude).toFixed(2)}°N, ${parseFloat(h.longitude).toFixed(2)}°E`,
          };
        }
      }),
    );
    return withCities;
  };
  
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchHotspots();
      if (data) {
        const withCities = await fetchCityNames(data);
        const mockCritical = {
          latitude: "21.1458",
          longitude: "79.0882",
          brightness: "425.5",
          frp: "142.5",
          confidence: "95",
          acq_date: new Date().toISOString().split("T")[0],
          acq_time: "0742",
          satellite: "Terra",
          instrument: "MODIS",
          scan: "1.2",
          track: "1.1",
          cityName: "Nagpur, Maharashtra",
          country: "India",
        };
        setRealHotspots([mockCritical, ...withCities]);
        setLastUpdated(new Date());
      }
    };

    loadData();
    const interval = setInterval(loadData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const indiaHotspots = realHotspots
    ? realHotspots.filter((h) => {
        const lat = parseFloat(h.latitude);
        const lng = parseFloat(h.longitude);
        return lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97;
      })
    : null;

  /* ── LOADING SCREEN ── */
  if (!realHotspots) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#060d16",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', sans-serif",
          gap: "28px",
        }}
      >
        <style>{`
          @keyframes pulseGlow { 0%,100%{box-shadow:0 0 30px #ff450055} 50%{box-shadow:0 0 56px #ff450099} }
          @keyframes fadeIn { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
          @keyframes spin { to{transform:rotate(360deg)} }
        `}</style>

        <div
          style={{
            width: "64px",
            height: "64px",
            background: "radial-gradient(circle, #ff4500, #cc0000)",
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px",
            animation: "pulseGlow 1.4s infinite",
          }}
        >
          🔥
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: "#f1f5f9",
              fontSize: "22px",
              fontWeight: "800",
              letterSpacing: "-0.3px",
              marginBottom: "6px",
            }}
          >
            AGNI DRISHTI
          </div>
          <div
            style={{ color: "#3a5570", fontSize: "11px", letterSpacing: "3px" }}
          >
            INDUSTRIAL FIRE DETECTION SYSTEM
          </div>
        </div>

        <div
          style={{
            background: "#0f1623",
            border: "1px solid #1e2d3d",
            borderRadius: "14px",
            padding: "20px 28px",
            width: "340px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {[
            { text: "Connecting to NASA FIRMS API...", delay: 0 },
            { text: "Fetching MODIS satellite hotspot data...", delay: 800 },
            { text: "Filtering India region (8°N–37°N)...", delay: 1600 },
            { text: "Running classification model...", delay: 2400 },
            {
              text: "Fetching city names via reverse geocoding...",
              delay: 3200,
            },
          ].map((item, i) => (
            <LoadingLine key={i} text={item.text} delay={item.delay} />
          ))}
        </div>

        <div
          style={{ color: "#1e3a52", fontSize: "10px", letterSpacing: "1.5px" }}
        >
          INDIA · SATELLITE · FIRMS OVERLAY
        </div>
      </div>
    );
  }

  /* ── MAIN DASHBOARD ── */
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        background: "#0a1020",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes spin { to{transform:rotate(360deg)} }

        .nav-pill {
          display: flex; align-items: center; gap: 5px;
          border-radius: 20px; padding: 4px 11px;
          font-family: 'Inter', sans-serif;
          transition: background 0.15s;
        }
        .nav-pill-label { font-size: 10px; color: #4a6080; font-weight: 500; }
        .nav-pill-value { font-size: 10px; font-weight: 700; }
      `}</style>

      {/* ── NAVBAR ── */}
      <div
        style={{
          height: "52px",
          background: "#0c1422",
          borderBottom: "1px solid #1a2a3a",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          zIndex: 1000,
          flexShrink: 0,
        }}
      >
        {/* Logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: "11px" }}>
          <div
            style={{
              width: "34px",
              height: "34px",
              background:
                "radial-gradient(circle at 40% 40%, #ff5500, #bb1100)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "17px",
              flexShrink: 0,
            }}
          >
            🔥
          </div>
          <div>
            <div
              style={{
                color: "#f1f5f9",
                fontSize: "15px",
                fontWeight: "800",
                letterSpacing: "-0.2px",
                lineHeight: 1,
              }}
            >
              Agni Drishti
            </div>
            <div
              style={{ color: "#3a5570", fontSize: "10px", marginTop: "2px" }}
            >
              Industrial Fire Detection · NASA FIRMS
            </div>
          </div>
        </div>

        {/* Status pills */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {[
            {
              label: "System",
              value: "Online",
              color: "#22c55e",
              bg: "rgba(34,197,94,0.09)",
              border: "rgba(34,197,94,0.2)",
            },
            {
              label: "Source",
              value: "NASA FIRMS",
              color: "#38bdf8",
              bg: "rgba(56,189,248,0.09)",
              border: "rgba(56,189,248,0.2)",
            },
            {
              label: "Coverage",
              value: "India",
              color: "#94a3b8",
              bg: "rgba(148,163,184,0.06)",
              border: "rgba(148,163,184,0.14)",
            },
            {
              label: "Mode",
              value: "Live",
              color: "#ef4444",
              bg: "rgba(239,68,68,0.09)",
              border: "rgba(239,68,68,0.2)",
              pulse: true,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="nav-pill"
              style={{
                background: item.bg,
                border: `1px solid ${item.border}`,
              }}
            >
              {item.pulse && (
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "#ef4444",
                    display: "inline-block",
                    animation: "livePulse 1.4s infinite",
                    flexShrink: 0,
                  }}
                />
              )}
              <span className="nav-pill-label">{item.label}:</span>
              <span className="nav-pill-value" style={{ color: item.color }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Clock */}
        {nowStr && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              background: "rgba(34,197,94,0.07)",
              border: "1px solid rgba(34,197,94,0.14)",
              borderRadius: "10px",
              padding: "5px 13px",
            }}
          >
            <div
              style={{
                color: "#3a5570",
                fontSize: "9px",
                fontWeight: "600",
                letterSpacing: "1px",
              }}
            >
              IST
            </div>
            <div
              style={{
                color: "#22c55e",
                fontSize: "13px",
                fontWeight: "700",
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1.2,
              }}
            >
              {nowStr.time}
            </div>
            <div
              style={{ color: "#2a4a30", fontSize: "9px", marginTop: "1px" }}
            >
              {nowStr.date}
            </div>
            {lastUpdated && (
              <div
                style={{
                  color: "#2a4060",
                  fontSize: "8px",
                  marginTop: "2px",
                  letterSpacing: "0.3px",
                }}
              >
                Updated:{" "}
                {lastUpdated.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── STATS BAR ── */}
      <StatsBar hotspots={indiaHotspots} />

      {/* ── MAIN CONTENT ── */}
      <div
        style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}
      >
        {/* Map area */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <Map selectedHotspot={selectedHotspot} realHotspots={realHotspots} />
          {selectedHotspot && (
            <EventDetail
              hotspot={selectedHotspot}
              onClose={() => setSelectedHotspot(null)}
            />
          )}
        </div>

        {/* Alert panel — fixed width, no overflowY here, AlertPanel handles its own scroll */}
        <div
          style={{
            width: "330px",
            flexShrink: 0,
            background: "#0f1623",
            borderLeft: "1px solid #1a2a3a",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <AlertPanel
            onHotspotSelect={handleHotspotSelect}
            selectedHotspot={selectedHotspot}
            realHotspots={indiaHotspots}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
