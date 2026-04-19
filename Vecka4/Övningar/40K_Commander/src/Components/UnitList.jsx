import React, { useState, useEffect } from 'react';
import Unit from './Unit'; // Importerar enhetens komponent
import AddUnitForm from './AddUnitForm'; // Importerar formuläret för att lägga till en enhet
import EditUnitForm from './EditUnitForm'; // Importerar formuläret för att redigera en enhet

// Huvudkomponenten som hanterar listan av enheter
function UnitList() {
    // State för att hålla en lista på alla enheter
    const [units, setUnits] = useState([]);
    // State för att hålla reda på vilken enhet som är under redigering
    const [editingUnitId, setEditingUnitId] = useState(null);

    // Används för att hämta enhetsdata från servern när komponenten laddas
    useEffect(() => {
        fetch('http://localhost:3000/units') // Hämtar enheter från json-server
            .then(response => response.json()) // Konverterar svaret till JSON
            .then(data => setUnits(data)) // Uppdaterar state med enhetslistan
            .catch(error => console.error('Error fetching units:', error)); // Hanterar eventuella fel
    }, []); // Tom array för att köra funktionen bara en gång vid initialisering

    // Funktion för att sätta en enhet som "deployed"
    const handleOnDeploy = (unit) => {
        setUnits(prevUnits =>
            prevUnits.map(u => u.id === unit.id ? { ...u, deployed: true } : u) // Uppdaterar deployed-statusen för enheten
        );
    };

    // Funktion för att sätta en enhet som "recalled"
    const handleOnRecall = (unit) => {
        setUnits(prevUnits =>
            prevUnits.map(u => u.id === unit.id ? { ...u, deployed: false } : u) // Uppdaterar deployed-statusen till false
        );
    };

    // Funktion för att minska antalet enheter vid "decimate"
    const handleOnDecimate = (unitId, amount) => {
        setUnits(prevUnits =>
            prevUnits.map(u => u.id === unitId && u.count >= amount ? { ...u, count: u.count - amount } : u) // Minskar antalet om tillräckligt med enheter finns
        );
    };

    // Funktion för att ta bort en enhet från listan
    const handleOnRemove = (unit) => {
        setUnits(prevUnits => prevUnits.filter(u => u.id !== unit.id)); // Tar bort enheten baserat på id
    };

    // Funktion för att lägga till en ny enhet
    const addUnit = (newUnit) => {
        setUnits(prevUnits => [...prevUnits, newUnit]); // Lägger till enheten i state
    };

    // Funktion för att sätta en enhet som under redigering
    const handleEditUnit = (unitId) => {
        setEditingUnitId(unitId); // Sätter den enhet som ska redigeras
    };

    // Funktion för att spara en uppdaterad enhet
    const handleSaveUnit = (updatedUnit) => {
        fetch(`http://localhost:3000/units/${updatedUnit.id}`, {
            method: 'PUT', // HTTP-metod för att uppdatera data
            headers: { 'Content-Type': 'application/json' }, // Specificerar att vi skickar JSON
            body: JSON.stringify(updatedUnit) // Skickar den uppdaterade enheten som JSON
        })
            .then(response => response.json()) // Konverterar svaret till JSON
            .then(() => {
                setUnits(prevUnits =>
                    prevUnits.map(u => (u.id === updatedUnit.id ? updatedUnit : u)) // Uppdaterar enheten i listan
                );
                setEditingUnitId(null); // Stänger redigeringsläge
            })
            .catch(error => console.error('Error updating unit:', error)); // Hanterar eventuella fel
    };

    return (
        <div className='unit-List'>
            <h2>Unit List</h2>
            {/* Komponent för att lägga till en ny enhet */}
            <AddUnitForm addUnit={addUnit} />
            {/* Loopar genom enheterna och renderar en Unit eller EditUnitForm baserat på redigeringsläge */}
            {units.map(unit =>
                editingUnitId === unit.id ? (
                    <EditUnitForm
                        key={unit.id} // Nyckel för att hålla reda på enheten i listan
                        unit={unit} // Skickar enheten som prop
                        onSave={handleSaveUnit} // Skickar funktion för att spara ändringar
                        onCancel={() => setEditingUnitId(null)} // Funktion för att avbryta redigering
                    />
                ) : (
                    <Unit
                        key={unit.id} // Nyckel för att hålla reda på enheten i listan
                        unit={unit} // Skickar enheten som prop
                        onDeploy={handleOnDeploy} // Skickar funktion för att deploya enheten
                        onRecall={handleOnRecall} // Skickar funktion för att recall enheten
                        onDecimate={handleOnDecimate} // Skickar funktion för att decimera enheten
                        onRemove={handleOnRemove} // Skickar funktion för att ta bort enheten
                        onEdit={handleEditUnit} // Skickar funktion för att redigera enheten
                    />
                )
            )}
        </div>
    );
};

export default UnitList;
