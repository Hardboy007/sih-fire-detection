import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
  GeoJSON,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { mapHotspots as hotspots } from "../data/hotspots";
import { industrialZones } from "../data/industrialZones";
import LayerPanel from "./LayerPanel";
import { useState } from "react";
import React from "react";

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

function PulseLayer({ hotspots }) {
  const map = useMap();

  useEffect(() => {
    const markers = [];

    hotspots.forEach((h) => {
      if (h.frp > 10) {
        const pulseIcon = L.divIcon({
          className: "",
          html: `
            <div style="position:relative;width:20px;height:20px;">
              <div style="
                position:absolute;
                width:20px;height:20px;
                border-radius:50%;
                background:${getColor(h.type)};
                opacity:0.4;
                animation:pulseRing 1.5s ease-out infinite;
              "></div>
              <div style="
                position:absolute;
                top:5px;left:5px;
                width:10px;height:10px;
                border-radius:50%;
                background:${getColor(h.type)};
              "></div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([h.lat, h.lng], { icon: pulseIcon });
        marker.addTo(map);
        markers.push(marker);
      }
    });

    return () => markers.forEach((m) => map.removeLayer(m));
  }, [map, hotspots]);

  return null;
}

function ZoomToSelected({ selectedHotspot, hotspots: data }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedHotspot) return;

    // Direct lat/lng use karo
    const lat = parseFloat(
      selectedHotspot.lat ?? selectedHotspot.latitude
    );
    const lng = parseFloat(
      selectedHotspot.lng ?? selectedHotspot.longitude
    );

    if (!isNaN(lat) && !isNaN(lng)) {
      map.flyTo([lat, lng], 8, {
        animate: true,
        duration: 1.2,
      });
      return;
    }

    // Fallback — array mein dhundho
    const h = data.find((h) => h.id === selectedHotspot.id);
    if (h) {
      map.flyTo([h.lat, h.lng], 8, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [selectedHotspot, map]);

  return null;
}

function CustomZoomControl() {
  const map = useMap();

  return (
    <div
      style={{
        position: "absolute",
        top: "16px",
        right: "16px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      {[
        { label: "+", action: () => map.zoomIn() },
        { label: "−", action: () => map.zoomOut() },
      ].map((btn) => (
        <button
          key={btn.label}
          onClick={btn.action}
          style={{
            width: "36px",
            height: "36px",
            background: "#0f1623",
            border: "1px solid #1e2d3d",
            borderRadius: "10px",
            color: "#94a3b8",
            fontSize: "20px",
            fontWeight: "300",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            lineHeight: 1,
            fontFamily: "'Inter', sans-serif",
            transition: "background 0.15s, color 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#1a2535";
            e.currentTarget.style.color = "#f1f5f9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0f1623";
            e.currentTarget.style.color = "#94a3b8";
          }}
        >
          {btn.label}
        </button>
      ))}

      {/* Reset view button */}
      <button
        onClick={() =>
          map.flyTo([22.5, 82.0], 5, { animate: true, duration: 1 })
        }
        title="Reset view"
        style={{
          width: "36px",
          height: "36px",
          background: "#0f1623",
          border: "1px solid #1e2d3d",
          borderRadius: "10px",
          color: "#4a6080",
          fontSize: "14px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          marginTop: "4px",
          transition: "background 0.15s, color 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#1a2535";
          e.currentTarget.style.color = "#f1f5f9";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#0f1623";
          e.currentTarget.style.color = "#4a6080";
        }}
      >
        ⊙
      </button>
    </div>
  );
}

/* Live hotspot count overlay */
function StatsOverlay({ hotspots }) {
  const critical = hotspots.filter((h) => h.type === "Wildfire").length;
  const total = hotspots.length;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "24px",
        right: "16px",
        zIndex: 1000,
        background: "#0f1623",
        border: "1px solid #1e2d3d",
        borderRadius: "12px",
        padding: "10px 14px",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        gap: "16px",
        alignItems: "center",
        boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#f1f5f9",
            lineHeight: 1,
          }}
        >
          {total}
        </div>
        <div style={{ fontSize: "10px", color: "#4a6080", marginTop: "3px" }}>
          Total
        </div>
      </div>
      <div style={{ width: "1px", height: "28px", background: "#1e2d3d" }} />
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#ef4444",
            lineHeight: 1,
          }}
        >
          {critical}
        </div>
        <div style={{ fontSize: "10px", color: "#4a6080", marginTop: "3px" }}>
          Critical
        </div>
      </div>
    </div>
  );
}

function Map({ selectedHotspot, realHotspots }) {
  const [layers, setLayers] = useState([
    {
      id: "hotspots",
      label: "Thermal Events",
      icon: "🔥",
      color: "#ef4444",
      active: true,
    },
    {
      id: "industrial",
      label: "Industrial Zones",
      icon: "🏭",
      color: "#22c55e",
      active: true,
    },
    {
      id: "pipelines",
      label: "Pipelines",
      icon: "⚡",
      color: "#38bdf8",
      active: true,
    },
  ]);

  const toggleLayer = (id) =>
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l)),
    );

  const isActive = (id) => layers.find((l) => l.id === id)?.active;

  const displayHotspots = realHotspots
    ? realHotspots
        .map((h, i) => ({
          id: i,
          lat: parseFloat(h.latitude),
          lng: parseFloat(h.longitude),
          frp: parseFloat(h.frp) || 0,
          confidence: h.confidence,
          scan: h.scan,
          type:
            parseFloat(h.frp) > 100
              ? "Wildfire"
              : parseFloat(h.frp) > 50
                ? "Industrial Fire"
                : parseFloat(h.frp) > 20
                  ? "Persistent Thermal Source"
                  : "Low Risk",
          city:
            h.cityName ||
            `${parseFloat(h.latitude).toFixed(2)}°N, ${parseFloat(h.longitude).toFixed(2)}°E`,
        }))
        .filter((h) => !isNaN(h.lat) && !isNaN(h.lng) && h.frp > 0)
    : [];

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <style>{`
        .leaflet-popup-content-wrapper {
          background: #0f1623 !important;
          border: 1px solid #1e2d3d !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.5) !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          color: #e2e8f0 !important;
          font-family: 'Inter', sans-serif !important;
        }
        .leaflet-popup-tip {
          background: #1e2d3d !important;
        }
        .leaflet-popup-close-button {
          color: #4a6080 !important;
          font-size: 16px !important;
          top: 8px !important;
          right: 10px !important;
        }
        .leaflet-popup-close-button:hover { color: #94a3b8 !important; }

        .leaflet-control-attribution {
          background: rgba(15,22,35,0.85) !important;
          color: #2a4060 !important;
          font-size: 9px !important;
          border-radius: 6px 0 0 0 !important;
          padding: 2px 6px !important;
        }
        .leaflet-control-attribution a { color: #3a5570 !important; }

        .industrial-tooltip {
          background: #0f1623 !important;
          border: 1px solid #1e2d3d !important;
          border-radius: 8px !important;
          color: #94a3b8 !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 11px !important;
          padding: 4px 10px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
        }
        .industrial-tooltip::before { display: none !important; }

        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>

      <LayerPanel layers={layers} onLayerToggle={toggleLayer} />

      <MapContainer
        center={[22.5, 82.0]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="&copy; Esri"
        />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
          attribution="&copy; CartoDB"
          opacity={0.9}
        />

        <CustomZoomControl />
        <PulseLayer hotspots={displayHotspots} />
        <ZoomToSelected
          selectedHotspot={selectedHotspot}
          hotspots={displayHotspots}
        />

        {isActive("hotspots") &&
          displayHotspots.map((h) => (
            <React.Fragment key={h.id}>
              <Circle
                key={`area-${h.id}`}
                center={[h.lat, h.lng]}
                radius={Math.max(2000, (parseFloat(h.scan) || 1) * 1000)}
                color={getColor(h.type)}
                fillColor={getColor(h.type)}
                fillOpacity={0.1}
                weight={1}
              />
              <CircleMarker
                key={h.id}
                center={[h.lat, h.lng]}
                radius={selectedHotspot?.id === h.id ? 10 : 7}
                color={
                  selectedHotspot?.id === h.id ? "#ffffff" : getColor(h.type)
                }
                fillColor={getColor(h.type)}
                fillOpacity={0.9}
                weight={selectedHotspot?.id === h.id ? 2.5 : 1.5}
              >
                <Popup>
                  <div style={{ padding: "14px 16px", minWidth: "180px" }}>
                    {/* Popup header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: getColor(h.type),
                          flexShrink: 0,
                        }}
                      />
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "700",
                          color: "#f1f5f9",
                        }}
                      >
                        {h.city}
                      </div>
                    </div>

                    {/* Type badge */}
                    <div
                      style={{
                        display: "inline-block",
                        fontSize: "10px",
                        fontWeight: "600",
                        color: getColor(h.type),
                        background: `${getColor(h.type)}18`,
                        border: `1px solid ${getColor(h.type)}30`,
                        borderRadius: "20px",
                        padding: "2px 8px",
                        marginBottom: "10px",
                      }}
                    >
                      {h.type}
                    </div>

                    <div
                      style={{
                        height: "1px",
                        background: "#1e2d3d",
                        marginBottom: "10px",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      {[
                        {
                          label: "FRP",
                          value: `${h.frp} MW`,
                          color: getColor(h.type),
                        },
                        {
                          label: "Confidence",
                          value: h.confidence,
                          color: "#e2e8f0",
                        },
                        {
                          label: "Coords",
                          value: `${Number(h.lat).toFixed(3)}°N, ${Number(h.lng).toFixed(3)}°E`,
                          color: "#e2e8f0",
                        },
                      ].map((row) => (
                        <div
                          key={row.label}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ fontSize: "11px", color: "#4a6080" }}>
                            {row.label}
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "600",
                              color: row.color,
                            }}
                          >
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          ))}

        {isActive("industrial") && (
          <GeoJSON
            data={industrialZones}
            style={{
              color: "#00ff88",
              weight: 1.5,
              opacity: 0.8,
              fillColor: "#00ff88",
              fillOpacity: 0.08,
              dashArray: "4 4",
            }}
            onEachFeature={(feature, layer) => {
              layer.bindTooltip(feature.properties.name, {
                permanent: false,
                className: "industrial-tooltip",
              });
            }}
          />
        )}
      </MapContainer>

      {/* Stats overlay — outside MapContainer so z-index works cleanly */}
      <StatsOverlay hotspots={displayHotspots} />
    </div>
  );
}

export default Map;
