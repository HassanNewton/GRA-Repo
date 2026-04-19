import React, { useState } from 'react';

// Komponent för att lägga till en enhet
function AddUnitForm({ addUnit }) {
    // State för att hålla reda på värdena i formuläret
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [count, setCount] = useState(1); // Antalet enheter som läggs till
    const [description, setDescription] = useState(''); // Beskrivningen av enheten

    // Funktion som hanterar formulärets skickande
    const handleSubmit = (e) => {
        e.preventDefault(); // Förhindrar standard formulärskickning
        // Kontrollera att alla fält är ifyllda och att antal är ett positivt tal
        if (!name || !type || count <= 0) {
            alert("Fyll i alla fält och ange ett positivt antal!");
            return;
        }

        // Skapar en ny enhet som ska läggas till
        const newUnit = {
            id: Date.now(), // Generera temporärt unikt ID baserat på tidsstämpel
            name,
            type,
            count: Number(count), // Omvandla count till ett nummer
            description,
            deployed: false // Sätt deployed till false som standard
        };

        // Anropar addUnit-funktionen från parent-komponenten och skickar med den nya enheten
        addUnit(newUnit);

        // Rensa fälten efter att enheten lagts till
        setName('');
        setType('');
        setCount(1);
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Fält för att skriva in enhetens namn */}
            <input
                type="text"
                placeholder="Namn"
                value={name}
                onChange={(e) => setName(e.target.value)} // Uppdaterar name state vid varje ändring
                required
            />
            {/* Fält för att skriva in enhetens typ */}
            <input
                type="text"
                placeholder="Typ"
                value={type}
                onChange={(e) => setType(e.target.value)} // Uppdaterar type state vid varje ändring
                required
            />
            {/* Fält för att skriva in enhetens antal */}
            <input
                type="number"
                placeholder="Antal"
                value={count}
                onChange={(e) => setCount(e.target.value)} // Uppdaterar count state vid varje ändring
                min="1"
                required
            />
            {/* Fält för att skriva enhetens beskrivning */}
            <textarea
                placeholder="Beskrivning"
                value={description}
                onChange={(e) => setDescription(e.target.value)} // Uppdaterar description state vid varje ändring
            />
            {/* Skickar formuläret och lägger till enheten */}
            <button type="submit">Lägg till enhet</button>
        </form>
    );
}

export default AddUnitForm;
