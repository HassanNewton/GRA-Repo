import React, { useState } from 'react';

const Spell = ({ spell, castSpell, removeSpell }) => {
    const [effect, setEffect] = useState(''); // State för effekten av besvärjelsen

    // Funktion som körs när knappen klickas
    const handleCast = () => {
        const effectMessage = castSpell(spell); // Anropar castSpell-funktionen från SpellBook
        setEffect(effectMessage); // Uppdaterar effekten

        // Om besvärjelsen har castats och är en engångsbesvärjelse, ta bort den
        if (spell.oneUse) {
            removeSpell(spell); // Anropar removeSpell för att ta bort spell från spellbooken
        }
    };

    return (
        <div>
            <h3>{spell.name}</h3>
            <p>{spell.description}</p>
            <button className='cast-button' onClick={handleCast}>Cast Spell</button>
            {effect && <p>Effect: {effect}</p>} {/* Visa effekten om den finns */}
        </div>
    );
};

export default Spell;
