import React, {useState} from "react";
import { MapContainer,TileLayer,Marker,Polyline, useMapEvents } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
const UCF = [28.6024, -81.2001];

function LocationMarker({setPickup, setDropoff}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPickup((prev) => (prev ? prev : [lat, lng]));
      setDropoff((prev) => (prev && prev ? null : [lat, lng]));
    },
  });
  return null;
}

function gasShare({distanceMiles}){
  const ratePerMile = 0.25; 
  const cost = distanceMiles * ratePerMile;
  return (
    <div 
      style={{
        border: "1px solid black",
        borderRadius: 12,
        padding: 16,
        width: 280,
        backgroundColor: "#f9f9f9",
      }}
      >
      <h3>Gas Share Estimate</h3>
      <p>Distance: {distanceMiles.toFixed(2)} miles</p>
      <p> 
        Rate: ${ratePerMile.toFixed(2)} per mile
        <br />
        <strong>Total: ${cost.toFixed(2)}</strong>
      </p>
    </div>
  )
}

export default function App() {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);
  const [loading, setLoading] = useState(false);
  console.log("ORS Key Loaded:", process.env.REACT_APP_ORS_KEY);

  async function getRoute() {
    if (!pickup || !dropoff) return;
    setLoading(true);

    try {
      const body = {
        coordinates: [
          [pickup[1], pickup[0]],
          [dropoff[1], dropoff[0]],
        ],
      };

      const res = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        body,
        {
          headers: {
            Authorization: process.env.REACT_APP_ORS_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const geometry = res.data.features[0].geometry.coordinates;
      const coords = geometry.map((c) => [c[1], c[0]]);
      setRoute(coords);

      const meters = res.data.features[0].properties.summary.distance;
      const miles = meters / 1609.34;
      setDistance(miles);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch route. Check your API key or try again later.");
    } finally {
      setLoading(false);
    }
  }

  function resetAll() {
    setPickup(null);
    setDropoff(null);
    setRoute([]);
    setDistance(0);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>KnightRide Demo (Map + Simple Gas Estimate)</h2>
      <p style={{ color: "#555" }}>
        Click once for pickup, again for dropoff. Click “Get Route” to estimate.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "16px",
          alignItems: "start",
        }}
      >
        <div>
          <MapContainer
            center={UCF}
            zoom={13}
            style={{
              height: "70vh",
              width: "100%",
              borderRadius: 12,
              border: "1px solid #ddd",
            }}
          >
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker setPickup={setPickup} setDropoff={setDropoff} />
            {pickup && <Marker position={pickup} />}
            {dropoff && <Marker position={dropoff} />}
            {route.length > 0 && <Polyline positions={route} color="blue" />}
          </MapContainer>

          <div style={{ marginTop: 10 }}>
            <button onClick={getRoute} disabled={loading}>
              {loading ? "Calculating..." : "Get Route"}
            </button>
            <button style={{ marginLeft: 8 }} onClick={resetAll}>
              Reset
            </button>

            {distance > 0 && (
              <p style={{ marginTop: 8 }}>
                <strong>Distance:</strong> {distance.toFixed(2)} miles
              </p>
            )}
          </div>
        </div>

        <gasShare distance={distance} />
      </div>
    </div>
  );
}