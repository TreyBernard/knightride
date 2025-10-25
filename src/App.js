import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Settings from "./Settings";
import logo from "./knight-logo.png";
import homeImage from "./house-image.png";
import historyimage from "./history.png";
import accountImage from "./account.png";
import knightMarker from "./knight-marker.png";

//map marker
const knightIcon = new L.Icon({
  iconUrl: knightMarker,
  iconSize: [40, 45],
  iconAnchor: [20, 45],
    popupAnchor: [0, -45],
});

const UCF = [28.6024, -81.2001];

// Click handler for pickup/dropoff
function LocationMarker({ setPickup, setDropoff }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPickup((prev) => (prev ? prev : [lat, lng]));
      setDropoff((prev) => (prev && prev.length ? null : [lat, lng]));
    },
  });
  return null;
}

function GasShare({ distance }) {
  const ratePerMile = 0.25;
  const cost = distance * ratePerMile || 0;

    return (
        <div className="gas-card">
            <h3>Gas Share Estimate</h3>
            <p>Distance: {distance.toFixed(2)} miles</p>
            <p>Rate: ${ratePerMile.toFixed(2)} per mile</p>
            <strong>Total: ${cost.toFixed(2)}</strong>
        </div>
    );

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
      const url = `https://router.project-osrm.org/route/v1/driving/${pickup[1]},${pickup[0]};${dropoff[1]},${dropoff[0]}?overview=full&geometries=geojson`;
      const res = await axios.get(url);

      const coords = res.data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
      setRoute(coords);

      const meters = res.data.routes[0].distance;
      const miles = meters / 1609.34;
      setDistance(miles);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch route.");
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
      <Router>
         <div className="App">
           <header className="header">
              <h1>KnightsRide</h1>
                 <p>Welcome User...</p>
                 <img src={logo} alt="KnightsRide Logo" />
           </header>
      <Routes>
      <Route
        path="/"
          element={
            <>
            <p style={{ color: "#fff" }}>
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
                  {pickup && <Marker position={pickup} icon={knightIcon} />}
                  {dropoff && <Marker position={dropoff} icon={knightIcon} />}
                 {route.length > 0 && <Polyline positions={route} color="blue" />}
             </MapContainer>

                <div className="button-group">
                 <button onClick={getRoute} disabled={loading}>
                    {loading ? "Calculating..." : "Get Route"}
                 </button>
                 <button style={{ marginLeft: 8 }} onClick={resetAll}>
                    Reset
                 </button>
                 </div>
                    {distance > 0 && (
                    <p style={{ marginTop: 8 }}>
                       <strong>Distance:</strong> {distance.toFixed(2)} miles
                    </p>
                     )}
                 </div>

                  <GasShare distance={distance} />
                    </div>
                    </>
                        }
                    />

                    {/* Settings Page */}
                    <Route path="/settings" element={<Settings />} />
                </Routes>


                <footer className="footer">
                    <Link to="/" className="footer-link">
                        <img src={homeImage} alt="Home" />
                    </Link>
                    <button className="footer-link">
                        <img src={historyimage} alt="History" />
                    </button>
                    <Link to="/settings" className="footer-link">
                        <img src={accountImage} alt="Settings" />
                    </Link>
                </footer>

            </div>
        </Router>
    );

}
