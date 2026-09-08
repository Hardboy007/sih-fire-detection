import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";

const dummyHotspots = [
  {
    lat: 22.5726,
    lng: 88.3639,
    frp: 120,
    confidence: "high",
    type: "Industrial Fire",
    city: "Kolkata",
  },
  {
    lat: 19.076,
    lng: 72.8777,
    frp: 45,
    confidence: "nominal",
    type: "Persistent Thermal Source",
    city: "Mumbai",
  },
  {
    lat: 28.7041,
    lng: 77.1025,
    frp: 200,
    confidence: "high",
    type: "Wildfire",
    city: "Delhi",
  },
  {
    lat: 13.0827,
    lng: 80.2707,
    frp: 30,
    confidence: "low",
    type: "Low Risk",
    city: "Chennai",
  },
  {
    lat: 23.0225,
    lng: 72.5714,
    frp: 80,
    confidence: "nominal",
    type: "Industrial Fire",
    city: "Ahmedabad",
  },
  {
    lat: 12.9716,
    lng: 77.5946,
    frp: 55,
    confidence: "nominal",
    type: "Persistent Thermal Source",
    city: "Bangalore",
  },
];

const getColor = (type) => {
  switch (type) {
    case "Industrial Fire":
      return "#ff4500";
    case "Persistent Thermal Source":
      return "#ffa500";
    case "Wildfire":
      return "#ff0000";
    case "Low Risk":
      return "#ffd700";
    default:
      return "#888";
  }
};

function PulseLayer() {
  const map = useMap();

  useEffect(() => {
    const markers = [];

    dummyHotspots.forEach((h) => {
      if (h.frp > 100) {
        const pulseIcon = L.divIcon({
          className: "",
          html: `
            <div style="
              position: relative;
              width: 20px;
              height: 20px;
            ">
              <div style="
                position: absolute;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: ${getColor(h.type)};
                opacity: 0.4;
                animation: pulseRing 1.5s ease-out infinite;
              "></div>
              <div style="
                position: absolute;
                top: 5px; left: 5px;
                width: 10px;
                height: 10px;
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

function Map() {
  return (
    <MapContainer
      center={[22.5, 82.0]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      scrollWheelZoom={true}
    >
      {/* Dark Satellite */}
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg"
        attribution="&copy; Stadia Maps"
      />

      {/* Clean Dark Labels */}
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/stadia_osm_bright/{z}/{x}/{y}{r}.png"
        attribution=""
        opacity={0.4}
      />

      <PulseLayer />

      {dummyHotspots.map((h, i) => (
        <CircleMarker
          key={i}
          center={[h.lat, h.lng]}
          radius={h.frp / 15}
          color={getColor(h.type)}
          fillColor={getColor(h.type)}
          fillOpacity={0.85}
          weight={2}
        >
          <Popup>
            <div style={{ fontFamily: "monospace", minWidth: "160px" }}>
              <b style={{ fontSize: "14px" }}>📍 {h.city}</b>
              <hr style={{ border: "1px solid #333", margin: "6px 0" }} />
              <div>
                Type: <span style={{ color: getColor(h.type) }}>{h.type}</span>
              </div>
              <div>
                FRP: <b>{h.frp} MW</b>
              </div>
              <div>Confidence: {h.confidence}</div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default Map;
