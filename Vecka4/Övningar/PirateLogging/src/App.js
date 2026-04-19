
import { useState } from "react";
import Spaceship from "./Spaceship";
import "./App.css";

export default function App() {
  const [spaceships, setSpaceships] = useState([
    { name: "Millennium Falcon", speed: 1050 },
    { name: "Naboo N-1 Starfighter", speed: 920 },
    { name: "TIE Interceptor", speed: 1200 }
  ]);

  // const logSpeed = (selectedShip) => {
  //   console.log(`${selectedShip.name} har en hastighet på ${selectedShip.speed} km/h`);
  //   setSpaceships([selectedShip, ...spaceships.filter((ship) => ship !== selectedShip)]);
  // };

  const logSpeed = (selectedShip) => {
    console.log(`${selectedShip.name} har en hastighet på ${selectedShip.speed} km/h`);

    // Skapa en kopia av listan
    let updatedList = spaceships.filter((ship) => ship !== selectedShip);

    // Flytta det valda skeppet till början av listan
    updatedList.unshift(selectedShip);

    // Uppdatera state
    setSpaceships(updatedList);
  };

  return (
    <div className="app">
      <h1>Intergalactic Pirate Logging</h1>
      {spaceships.map((ship) => (
        <Spaceship key={ship.name} ship={ship} logSpeed={logSpeed} />
      ))}
    </div>
  );
}