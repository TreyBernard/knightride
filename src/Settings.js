import React from "react";
import "./Settings.css";
import logo from "./knight-logo.png";
import homeImage from "./house-image.png";
import historyimage from "./history.png";
import accountImage from "./account.png";
import knightMarker from "./knight-marker.png";

export default function Settings() {
    return (
        <div className="settings-page">
            <header className="settings-header">
                <h1>Settings</h1>
            </header>

            <div className="settings-card">
                <img
                    src={accountImage}
                    alt="User"
                    style={{ width: "80px", borderRadius: "50%", marginTop: "20px" }}
                />
                <p style={{ marginTop: "10px", fontWeight: "bold" }}>User</p>
                <p>sample@ucf.edu</p>

                <ul className="settings-links">
                    <li>Account &gt;</li>
                    <li>Accessibility &gt;</li>
                    <li>Help &gt;</li>
                </ul>

                <button className="logout-btn">Log Out</button>
            </div>
        </div>
    );
}
