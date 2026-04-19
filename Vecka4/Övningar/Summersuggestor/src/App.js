import React, { useState } from "react";
import ActivityButton from "./ActivityButton";
import "./App.css";

export default function App() {
  const activities = [
    { id: 1, name: "Beach Visit", description: "A day at the beach with sun and breeze." },
    { id: 2, name: "Fishing", description: "Relaxing fishing at a beautiful lake." },
    { id: 3, name: "Hiking", description: "A scenic hiking trip in the mountains." },
    { id: 4, name: "Picnic", description: "A lovely picnic in the park." },
    { id: 5, name: "Cycling", description: "A bicycle ride through the countryside." },
    { id: 6, name: "Outdoor Yoga", description: "A session of yoga in a tranquil garden." },
    { id: 7, name: "Kayaking", description: "Paddling through serene waters." },
    { id: 8, name: "Star Gazing", description: "Observing the stars on a clear night." },
    { id: 9, name: "Bird Watching", description: "Discovering local bird species in nature." },
    { id: 10, name: "Gardening", description: "Spending the day tending to a garden." }
  ];


  function displayActivity(activity) {
    // Hittar elementet med id "activity-display" i DOM
    const display = document.querySelector("#activity-display");

    // Uppdaterar elementets innehåll med aktivitetens namn och beskrivning
    display.innerHTML = `<h3>${activity.name}</h3><p>${activity.description}</p>`;
  }

  return (
    <div className="app">
      {/* Rubrik för applikationen */}
      <h1>Summer Activities</h1>

      {/* Container för aktivitetsknappar */}
      <div className="button-container">
        {activities.map((activity) => (
          // Skapar en knapp för varje aktivitet och kopplar klickhändelse till displayActivity
          <button key={activity.id} onClick={() => displayActivity(activity)}>
            {activity.name}
          </button>
        ))}
      </div>

      {/* Visningsyta för vald aktivitet, uppdateras vid knapptryck */}
      <div id="activity-display">
        <p>Choose an activity to display information.</p>
      </div>
    </div>
  );
}


//BÄTTRE IMPLEMENTERING MED STATE
//const [selectedActivity, setSelectedActivity] = useState(null);


// return (
//   <div className="app">
//     <h1>Summer Activities</h1>
//     <div className="button-container">
//       {activities.map((activity) => (
//         <ActivityButton key={activity.id} activity={activity} onClick={setSelectedActivity} />
//       ))}
//     </div>
//     <div className="activity-display">
//       {selectedActivity ? (
//         <>
//           <h3>{selectedActivity.name}</h3>
//           <p>{selectedActivity.description}</p>
//         </>
//       ) : (
//         <p>Choose an activity to display information.</p>
//       )}
//     </div>
//   </div>
// );



// State selectedActivity används för att lagra den aktivitet som valts.
// När en knapp klickas, uppdateras selectedActivity via setSelectedActivity(activity)
// Om en aktivitet är vald, visas dess namn och beskrivning. Annars visas en standardtext