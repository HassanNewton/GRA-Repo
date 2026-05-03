import React from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

/**
 * Home.js - Startsidan
 *
 * Denna komponent visar en välkomstsida med en introduktion till butiken.
 * Den använder Link-komponenten för att navigera till produktsidan.
 */
// pages/Home.js

function Home() {
  return (
    <div>
      <h1>Välkommen till vår butik!</h1>
      <p>Vi säljer högkvalitativa produkter till bästa pris.</p>

      <Link to="/products" className="btn">
        Börja handla
      </Link>
    </div>
  );
}

export default Home;
