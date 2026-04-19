import React from "react";

function ActivityButton({ activity, onClick }) {
    return (
        <button className="activity-button" onClick={() => onClick(activity)}>
            {activity.name}
        </button>
    );
}

export default ActivityButton;


// Knappen tar emot activity - data och en onClick - funktion.
// När knappen klickas anropas onClick(activity) och skickar den valda aktiviteten till App.js.