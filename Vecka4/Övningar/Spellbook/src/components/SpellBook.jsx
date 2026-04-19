import React, { useEffect, useState } from "react";
import Spell from "./Spell.jsx";
// import spellsData from "../db.json"; // Importera JSON-filen
import AddSpellForm from "./AddSpellForm.jsx"; // Lägg till AddSpellForm

const SpellBook = () => {
  const [spells, setSpells] = useState([]);

  useEffect(() => {
    // Hämta besvärjelser från JSON-filen
    fetchSpells();
  }, []);

  const fetchSpells = async () => {
    try {
      const response = await fetch("http://localhost:3001/spells");
      const data = await response.json();
      setSpells(data);
    } catch (error) {
      console.error("Error fetching spells:", error);
    }
  };

  // Funktion för att kasta en besvärjelse
  const castSpell = (spell) => {
    if (spell.oneUse) {
      removeSpell(spell); // Ta bort spell om det är en engångsbesvärjelse
      return `You casted ${spell.name}, and it is now gone from your Spellbook!`;
    } else {
      return `You casted ${spell.name}, and it remains in your Spellbook.`;
    }
  };

  // Funktion för att ta bort en besvärjelse
  const removeSpell = (spell) => {
    setSpells(spells.filter((s) => s.id !== spell.id));
  };

  // Lägg till spell i SpellBook
  const addSpell = async (newSpell) => {
    try {
      const response = await fetch("http://localhost:3001/spells", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSpell),
      });

      if (!response.ok) {
        throw new Error("Failed to add spell");
      }

      const savedSpell = await response.json(); // Hämta det sparade objektet från servern
      //   setSpells([...spells, savedSpell]); // Lägg till det som faktiskt sparades (inkl. id etc.)
      fetchSpells(); // Hämta spell-listan igen för att uppdatera
    } catch (error) {
      console.error("Error adding spell:", error);
    }
  };

  return (
    <div className="spell-book-container">
      <div className="spell-book">
        <h1>Spell Book</h1>
        {spells.length === 0 ? (
          <p>No spells left in your Spellbook!</p>
        ) : (
          spells.map((spell) => (
            <Spell
              key={spell.id}
              spell={spell}
              castSpell={castSpell}
              removeSpell={removeSpell}
            />
          ))
        )}
      </div>
      <AddSpellForm addSpell={addSpell} /> {/* Placera formuläret här */}
    </div>
  );
};

export default SpellBook;
