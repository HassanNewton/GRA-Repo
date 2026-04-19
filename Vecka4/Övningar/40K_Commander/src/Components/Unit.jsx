import React, { useState } from 'react';

// Komponent för att representera en enhet
function Unit({ unit, onDeploy, onRecall, onRemove, onDecimate, onEdit }) {
    // State för att lagra mängden enheter som ska decimeras
    const [decimateVal, setDecimateVal] = useState(0);

    // Funktion för att decimera en enhet (minska dess antal)
    const handleDecimate = () => {
        onDecimate(unit.id, decimateVal); // Anropar förälderkomponentens decimeringsfunktion
        setDecimateVal(0); // Återställer inputfältet efter knapptryckning
    };

    return (
        <div className={`unit-card ${unit.deployed ? 'deployed' : 'not-deployed'}`}>
            {/* Visar enhetens namn och typ */}
            <h3>{unit.name} ({unit.type})</h3>
            <p>{unit.description}</p> {/* Visar beskrivning */}
            <p>Antal: {unit.count}</p> {/* Visar hur många enheter det finns */}

            {/* Knapp för att antingen deploya eller återkalla en enhet */}
            {unit.deployed ? (
                <button onClick={() => onRecall(unit)}>Recall</button>  // Återkalla enhet
            ) : (
                <button onClick={() => onDeploy(unit)}>Deploy</button>  // Sätt ut enhet
            )}

            {/* Knapp för att ta bort enheten från listan */}
            <button onClick={() => onRemove(unit)}>Remove</button>

            {/* Knapp för att redigera enheten */}
            <button onClick={() => onEdit(unit.id)}>Edit</button>

            {/* Inputfält för att ange hur många enheter som ska decimeras */}
            <input
                type="number"
                value={decimateVal}
                onChange={(e) => setDecimateVal(e.target.value)}
                min="0"
            />

            {/* Knapp för att decimera enheten */}
            <button onClick={handleDecimate}>Decimate</button>
        </div>
    );
}

export default Unit;
