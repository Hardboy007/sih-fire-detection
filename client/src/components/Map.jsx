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

function PulseLayer() {
  const map = useMap();

  useEffect(() => {
    const markers = [];

    hotspots.forEach((h) => {
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

function ZoomToSelected({ selectedHotspot }) {
  const map = useMap();

  useEffect(() => {
    if (selectedHotspot) {
      // hotspots array se actual lat/lng lenge string se nahi
      const h = hotspots.find((h) => h.id === selectedHotspot.id);
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

function Map({ selectedHotspot }) {
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
  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
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

        <PulseLayer />
        <ZoomToSelected selectedHotspot={selectedHotspot} />

        {isActive("hotspots") &&
          hotspots.map((h) => (
            <CircleMarker
              key={h.id}
              center={[h.lat, h.lng]}
              radius={h.frp / 15}
              color={
                selectedHotspot?.id === h.id ? "#ffffff" : getColor(h.type)
              }
              fillColor={getColor(h.type)}
              fillOpacity={0.85}
              weight={selectedHotspot?.id === h.id ? 3 : 2}
            >
              <Popup>
                <div style={{ fontFamily: "monospace", minWidth: "160px" }}>
                  <b style={{ fontSize: "14px" }}>📍 {h.city}</b>
                  <hr style={{ border: "1px solid #333", margin: "6px 0" }} />
                  <div>
                    Type:{" "}
                    <span style={{ color: getColor(h.type) }}>{h.type}</span>
                  </div>
                  <div>
                    FRP: <b>{h.frp} MW</b>
                  </div>
                  <div>Confidence: {h.confidence}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        {isActive("industrial") && (
          <GeoJSON
            data={industrialZones}
            style={{
              color: "#00ff88",
              weight: 2,
              opacity: 1,
              fillColor: "#00ff88",
              fillOpacity: 0.04,
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
