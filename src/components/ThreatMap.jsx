import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import authFetch from "../utils/authFetch";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});



// force scroll zoom ON
function EnableScrollZoom() {
  const map = useMap();

  useEffect(() => {
    map.scrollWheelZoom.enable();
    return () => {
      map.scrollWheelZoom.disable();
    };
  }, [map]);

  return null;
}

// force clamping to a single world using maxBounds + panInsideBounds
function ClampToBounds() {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([-85, -180], [85, 180]);

    // set max bounds on map
    map.setMaxBounds(bounds);

    // on every drag, keep view inside bounds
    const onDrag = () => {
      map.panInsideBounds(bounds, { animate: false });
    };

    map.on("drag", onDrag);

    return () => {
      map.off("drag", onDrag);
    };
  }, [map]);

  return null;
}

export default function ThreatMap() {
  const [activeThreats, setActiveThreats] = useState([]);

 useEffect(() => {
  const loadThreats = async () => {
    try {
      const data = await authFetch("http://localhost:5000/api/threats");

      const mapped = data
        .filter(t => t.geoLat && t.geoLon)
        .map((t, index) => ({
          id: index,
           lat: Number(t.geoLat),   // 🔥 IMPORTANT
           lng: Number(t.geoLon),   // 🔥 IMPORTANT
          city: t.geoCountry || "Unknown",
          ip: t.src,
          threat: t.attack,
          severity: t.severity,
        }));

      setActiveThreats(mapped);
    } catch (err) {
      console.error("Map load error", err);
    }
  };

  loadThreats();

  const interval = setInterval(loadThreats, 5000);
  return () => clearInterval(interval);
}, []);
  const getSeverityColor = (severity) => {
    if (severity === "High") return "#ef4444";
    if (severity === "Medium") return "#f59e0b";
    return "#22c55e";
  };

 const customIcon = (severity) => {
  const color = getSeverityColor(severity);
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="marker-wrapper" style="position: relative; width: 20px; height: 20px;">
        
        <!-- Pulse ring -->
        <div class="pulse-ring" style="
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 2px solid ${color};
          animation: pulse-ring 3s ease-out infinite;
          opacity: 0.7;
        "></div>

        <!-- Solid dot -->
        <div style="
          width: 12px;
          height: 12px;
          background: ${color};
          border: 2px solid #fff;
          border-radius: 50%;
          box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
        "></div>

      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};





  const worldBounds = [
    [-85, -180],
    [85, 180],
  ];

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-cyan-500/20 relative">
      <MapContainer
        center={[20, 0]}
        zoom={3}
        minZoom={3}
        maxZoom={8}
        style={{ height: "100%", width: "100%", background: "#0a0f1a" }}
        zoomControl={false}
        scrollWheelZoom={true}
        maxBounds={worldBounds}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
      >
        <EnableScrollZoom />
        <ClampToBounds />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          className="map-tiles"
          noWrap={true}
          bounds={worldBounds}
        />

        {activeThreats.map((threat) => (
          <div key={threat.id}>
            <Circle
              center={[threat.lat, threat.lng]}
              radius={200000}
              pathOptions={{
                color: getSeverityColor(threat.severity),
                fillColor: getSeverityColor(threat.severity),
                fillOpacity: 0.15,
                weight: 1,
              }}
            />
            <Marker
              position={[threat.lat, threat.lng]}
              icon={customIcon(threat.severity)}
            >
              <Popup className="custom-popup">
                <div className="text-xs space-y-1 p-2">
                  <div className="font-bold text-gray-900">{threat.city}</div>
                  <div className="text-gray-700">IP: {threat.ip}</div>
                  <div className="text-gray-700">Threat: {threat.threat}</div>
                  <div
                    className={`font-semibold ${
                      threat.severity === "High"
                        ? "text-red-600"
                        : threat.severity === "Medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    Severity: {threat.severity}
                  </div>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>

      <style>{`
        .map-tiles {
          filter: grayscale(100%) brightness(0.4) contrast(1.2);
        }
        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.95);
        }
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-control-attribution {
          display: none !important;
        }
        .leaflet-control-zoom {
          display: none !important;
        }
                  .pulse-dot {
          animation: radar-pulse 1.6s ease-out infinite;
        }


                  @keyframes pulse-ring {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.7;
          }
          70% {
            transform: translate(-50%, -50%) scale(6);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
          }
        }


      `}</style>
    </div>
  );
}
