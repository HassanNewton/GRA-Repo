import React, { useState } from 'react';

// Komponent för att redigera en enhet
function EditUnitForm({ unit, onSave, onCancel }) {
    // State för att hålla reda på de redigerade värdena för enheten
    const [name, setName] = useState(unit.name); // Startvärde från enhetens namn
    const [type, setType] = useState(unit.type); // Startvärde från enhetens typ
    const [count, setCount] = useState(unit.count); // Startvärde från enhetens antal
    const [description, setDescription] = useState(unit.description); // Startvärde från enhetens beskrivning

    // Funktion som hanterar formulärets skickande
    const handleSubmit = (e) => {
        e.preventDefault(); // Förhindrar att formuläret skickas på det vanliga sättet

        // Skapar ett objekt för den uppdaterade enheten
        const updatedUnit = { ...unit, name, type, count: Number(count), description };

        // Anropar onSave-funktionen från parent-komponenten och skickar den uppdaterade enheten
        onSave(updatedUnit);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Fält för att redigera enhetens namn */}
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)} // Uppdaterar name state när användaren ändrar värdet
                required
            />
            {/* Fält för att redigera enhetens typ */}
            <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)} // Uppdaterar type state när användaren ändrar värdet
                required
            />
            {/* Fält för att redigera enhetens antal */}
            <input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)} // Uppdaterar count state när användaren ändrar värdet
                min="1"
                required
            />
            {/* Fält för att redigera enhetens beskrivning */}
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)} // Uppdaterar description state när användaren ändrar värdet
            />
            {/* Knapp för att spara ändringarna */}
            <button type="submit">Spara ändringar</button>
            {/* Knapp för att avbryta redigeringen */}
            <button type="button" onClick={onCancel}>Avbryt</button>
        </form>
    );
}

export default EditUnitForm;
