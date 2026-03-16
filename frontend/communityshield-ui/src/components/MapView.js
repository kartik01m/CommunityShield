import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import axios from "axios";

/* Fix Leaflet marker icon issue */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function MapView({ alerts }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (alerts) {
      setData(alerts);
    } else {
      axios
        .get("http://127.0.0.1:8000/alerts")
        .then((res) => setData(res.data))
        .catch((err) => console.error(err));
    }
  }, [alerts]);

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {data.map((alert) => (
        <Marker
          key={alert.id}
          position={[alert.latitude, alert.longitude]}
        >
          <Popup>
            <b>{alert.disaster_type}</b>
            <br />
            {alert.description}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;