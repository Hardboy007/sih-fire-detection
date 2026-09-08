import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
  GeoJSON,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { mapHotspots as hotspots } from "../data/hotspots";
import { industrialZones } from "../data/industrialZones";
import LayerPanel from "./LayerPanel";
import { useState } from "react";

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

function PulseLayer({ hotspots: data }) {
  const map = useMap();

  useEffect(() => {
    const markers = [];

    data.forEach((h) => {
      if (h.frp > 100) {
        const pulseIcon = L.divIcon({
          className: "",
          html: `
            <div style="position: relative; width: 20px; height: 20px;">
              <div style="
                position: absolute;
                width: 20px; height: 20px;
                border-radius: 50%;
                background: ${getColor(h.type)};
                opacity: 0.4;
                animation: pulseRing 1.5s ease-out infinite;
              "></div>
              <div style="
                position: absolute;
                top: 5px; left: 5px;
                width: 10px; height: 10px;
                border-radius: 50%;
                background: ${getColor(h.type)};
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
  }, [map]);

  return null;
}

function ZoomToSelected({ selectedHotspot, hotspots: data }) {
  const map = useMap();

  useEffect(() => {
    if (selectedHotspot) {
      const h = data.find((h) => h.id === selectedHotspot.id);
      if (h) {
        map.flyTo([h.lat, h.lng], 8, {
          animate: true,
          duration: 1.2,
        });
      }
    }
  }, [selectedHotspot, map]);

  return null;
}

// Map.jsx mein add karo — MapContainer ke baad
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
            width: "34px",
            height: "34px",
            background: "#0f1623",
            border: "1px solid #1e2d3d",
            borderRadius: "10px",
            color: "#94a3b8",
            fontSize: "18px",
            fontWeight: "300",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            lineHeight: 1,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#1a2535")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#0f1623")}
        >
          {btn.label}
        </button>
      ))}
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

  const toggleLayer = (id) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l)),
    );
  };

  const isActive = (id) => layers.find((l) => l.id === id)?.active;

  const displayHotspots = realHotspots
    ? realHotspots
        .map((h, i) => ({
          id: i,
          lat: parseFloat(h.latitude),
          lng: parseFloat(h.longitude),
          frp: parseFloat(h.frp) || 0,
          confidence: h.confidence,
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
    : hotspots;

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {/* Popup dark theme override */}
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
        .leaflet-popup-close-button:hover {
          color: #94a3b8 !important;
        }
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
        .industrial-tooltip::before {
          display: none !important;
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
          url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg"
          attribution="&copy; Stadia Maps"
        />
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/stadia_osm_bright/{z}/{x}/{y}{r}.png"
          attribution=""
          opacity={0.4}
        />
        <CustomZoomControl />
        <PulseLayer hotspots={displayHotspots} />
        <ZoomToSelected
          selectedHotspot={selectedHotspot}
          hotspots={displayHotspots}
        />

        {isActive("hotspots") &&
          displayHotspots.map((h) => (
            <CircleMarker
              key={h.id}
              center={[h.lat, h.lng]}
              radius={Math.max(h.frp / 15, 6)}
              color={
                selectedHotspot?.id === h.id ? "#ffffff" : getColor(h.type)
              }
              fillColor={getColor(h.type)}
              fillOpacity={0.85}
              weight={selectedHotspot?.id === h.id ? 3 : 2}
            >
              <Popup>
                <div style={{ padding: "14px 16px", minWidth: "170px" }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#f1f5f9",
                      marginBottom: "8px",
                    }}
                  >
                    📍 {h.city}
                  </div>
                  <div
                    style={{
                      height: "1px",
                      background: "#1e2d3d",
                      marginBottom: "8px",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "5px",
                    }}
                  >
                    <div style={{ fontSize: "11px" }}>
                      <span style={{ color: "#4a6080" }}>Type: </span>
                      <span
                        style={{ color: getColor(h.type), fontWeight: "600" }}
                      >
                        {h.type}
                      </span>
                    </div>
                    <div style={{ fontSize: "11px" }}>
                      <span style={{ color: "#4a6080" }}>FRP: </span>
                      <span style={{ color: "#e2e8f0", fontWeight: "600" }}>
                        {h.frp} MW
                      </span>
                    </div>
                    <div style={{ fontSize: "11px" }}>
                      <span style={{ color: "#4a6080" }}>Confidence: </span>
                      <span style={{ color: "#e2e8f0" }}>{h.confidence}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
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
    </div>
  );
}

export default Map;
