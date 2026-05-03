import React from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

/**
 * NotFound.js - 404 sidan
 *
 * Denna komponent visas när användaren försöker gå till en URL
 * som inte finns i vår routing-konfiguration
 *
 * I App.js har vi lagt denna route SIST:
 * <Route path="*" element={<NotFound />} />
 *
 * Asterisken (*) matchar ALLA routes som inte matchade tidigare
 */

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Sidan hittades inte</h2>
      <p>Vi kunde inte hitta sidan du letar efter.</p>
      <Link to="/" className="btn">
        Gå tillbaka till startsidan
      </Link>
    </div>
  );
}

export default NotFound;
