// Spaceship.js
import React from "react";
import "./App.css";

function Spaceship({ ship, logSpeed }) {
    return (
        <div className="spaceship">
            <h2>{ship.name}</h2>
            <p>Hastighet: {ship.speed} km/h</p>
            <button onClick={() => logSpeed(ship)}>Logga hastighet</button>
        </div>
    );
}

export default Spaceship;