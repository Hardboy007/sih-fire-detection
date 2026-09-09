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
    const t2 = setTimeout(() => setDone(true), delay + 1900)
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
        fontSize: "11px",
      }}
    >
      {done ? (
        <span style={{ color: "#22c55e", fontSize: "13px" }}>✓</span>
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
      <span style={{ color: done ? "#94a3b8" : "#38bdf8" }}>{text}</span>
    </div>
  );
}

function Dashboard() {
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [realHotspots, setRealHotspots] = useState(null);
  // const [realZones, setRealZones] = useState(null);
  fetchHotspots().then(async (data) => {
  if (data) {
    const withCities = await fetchCityNames(data)
    
    // Demo ke liye ek critical alert add karo
    const mockCritical = {
      latitude: "21.1458",
      longitude: "79.0882",
      brightness: "425.5",
      frp: "142.5",
      confidence: "95",
      acq_date: new Date().toISOString().split('T')[0],
      acq_time: new Date().toTimeString().slice(0,5).replace(':',''),
      satellite: "Terra",
      instrument: "MODIS",
      scan: "1.2",
      track: "1.1",
      city: "Nagpur",
      cityName: "Nagpur, Maharashtra",
      country: "India"
    }
    
    setRealHotspots([mockCritical, ...withCities])
  }
})

  const fetchCityNames = async (hotspotsData) => {
    const top10 = hotspotsData.slice(0, 10);
    const withCities = await Promise.all(
      top10.map(async (h) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${h.latitude}&lon=${h.longitude}&format=json`,
          );
          const data = await res.json();
          return {
            ...h,
            cityName:
              [
                data.address?.city ||
                  data.address?.town ||
                  data.address?.village,
                data.address?.state,
              ]
                .filter(Boolean)
                .join(", ") || "Unknown",
          };
        } catch {
          return { ...h, cityName: `${parseFloat(h.latitude).toFixed(2)}°N` };
        }
      }),
    );
    return withCities;
  };

  useEffect(() => {
    fetchHotspots().then(async (data) => {
      if (data) {
        console.log("FIRMS raw sample:", data[0]);
        const withCities = await fetchCityNames(data);
        setRealHotspots(withCities);
      }
    });

    // fetchIndustrialZones().then((data) => {
    //   if (data) setRealZones(data);
    // });
  }, []);
  const indiaHotspots = realHotspots
    ? realHotspots.filter((h) => {
        const lat = parseFloat(h.latitude);
        const lng = parseFloat(h.longitude);
        return lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97;
      })
    : null;
  const now = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
          gap: "24px",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            background: "radial-gradient(circle, #ff4500, #cc0000)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            boxShadow: "0 0 30px #ff450055",
            animation: "pulseGlow 1.4s infinite",
          }}
        >
          🔥
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              color: "#f1f5f9",
              fontSize: "20px",
              fontWeight: "700",
              marginBottom: "6px",
            }}
          >
            AGNI DRISHTI
          </div>
          <div
            style={{ color: "#4a6080", fontSize: "11px", letterSpacing: "2px" }}
          >
            INDUSTRIAL FIRE DETECTION SYSTEM
          </div>
        </div>

        {/* Status lines */}
        <div
          style={{
            background: "#0f1623",
            border: "1px solid #1e2d3d",
            borderRadius: "12px",
            padding: "16px 24px",
            width: "320px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
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
          style={{ color: "#2a4060", fontSize: "10px", letterSpacing: "1px" }}
        >
          INDIA · SATELLITE · FIRMS OVERLAY
        </div>

        <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 30px #ff450055; }
          50% { box-shadow: 0 0 50px #ff450099; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
          @keyframes spin {
  to { transform: rotate(360deg); }
}
      `}</style>
      </div>
    );
  }

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
            {
              label: "System",
              value: "Online",
              color: "#22c55e",
              bg: "rgba(34,197,94,0.1)",
              border: "rgba(34,197,94,0.2)",
            },
            {
              label: "Source",
              value: "NASA FIRMS",
              color: "#38bdf8",
              bg: "rgba(56,189,248,0.1)",
              border: "rgba(56,189,248,0.2)",
            },
            {
              label: "Coverage",
              value: "India",
              color: "#94a3b8",
              bg: "rgba(148,163,184,0.08)",
              border: "rgba(148,163,184,0.15)",
            },
            {
              label: "Mode",
              value: "Live",
              color: "#ef4444",
              bg: "rgba(239,68,68,0.1)",
              border: "rgba(239,68,68,0.2)",
              pulse: true,
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: item.bg,
                border: `1px solid ${item.border}`,
                borderRadius: "20px",
                padding: "4px 10px",
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
                    animation: "pulse 1.4s infinite",
                    flexShrink: 0,
                  }}
                />
              )}
              <span
                style={{
                  fontSize: "10px",
                  color: "#4a6080",
                  fontWeight: "500",
                }}
              >
                {item.label}:
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: item.color,
                  fontWeight: "600",
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Right - Time */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.15)",
            borderRadius: "10px",
            padding: "5px 12px",
          }}
        >
          <div
            style={{
              color: "#4a6080",
              fontSize: "9px",
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}
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

      {/* STATS BAR */}
      <StatsBar hotspots={indiaHotspots} />

      {/* MAIN CONTENT */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Map selectedHotspot={selectedHotspot} realHotspots={realHotspots} />
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
            realHotspots={realHotspots}
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
