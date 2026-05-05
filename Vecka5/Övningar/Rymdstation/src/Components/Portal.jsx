// Portal.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Section from './Section';

function Portal() {
    const [sections, setSections] = useState([]);
    const [newSection, setNewSection] = useState({
        name: '',
        description: '',
        interestingFact: '',
        currentCrew: '',
    });


    useEffect(() => {
        fetch('http://localhost:5000/sections')
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Logga hela svaret
                setSections(data);

            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    // Kontrollera om sections är en array innan vi försöker använda .map()
    if (!sections || !Array.isArray(sections)) {
        return <div>Laddar...</div>; // Eller någon annan loading-indikator
    }

    // Hantera ändringar i formulärfälten
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewSection({
            ...newSection,
            [name]: value
        });
    };

    const handleCrewChange = (event) => {
        setNewSection({
            ...newSection,
            currentCrew: event.target.value.split(',').map(name => name.trim()) // Dela på komma och trimma vita tecken
        });
    };

    // Funktion för att skapa ett nytt ID baserat på det största existerande id:t
    const generateNewId = () => {
        const highestId = sections.length > 0 ? Math.max(...sections.map(section => section.id)) : 0;
        return highestId + 1; // Skapa nytt id
    };

    // Skicka den nya sektionen till servern
    const handleSubmit = (event) => {
        event.preventDefault();

        const sectionWithId = {
            ...newSection,
            id: generateNewId(), // Lägg till ett nytt id till sektionen
        };

        fetch('http://localhost:5000/sections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sectionWithId),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    // Lägg till den nya sektionen i den lokala listan (state)
                    setSections((prevSections) => [...prevSections, data]);
                    setNewSection({
                        name: '',
                        description: '',
                        interestingFact: '',
                        currentCrew: ''
                    });
                } else {
                    console.error('Felaktigt svar från servern:', data);
                }
            })
            .catch((error) => console.error('Error adding section:', error));
    };

    return (
        <div className="portal">
            <h1>Welcome to the Space Station Portal</h1>

            <h2>Add New Section</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={newSection.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={newSection.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="interestingFact">Interesting Fact:</label>
                    <textarea
                        id="interestingFact"
                        name="interestingFact"
                        value={newSection.interestingFact}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="currentCrew">Current Crew (comma separated):</label>
                    <input
                        type="text"
                        id="currentCrew"
                        name="currentCrew"
                        value={newSection.currentCrew}
                        onChange={handleCrewChange}
                        required
                    />
                </div>
                <button type="submit">Add Section</button>
            </form>

            {sections.map((section) => (
                <Section key={section.id} section={section} />
            ))}
        </div>
    );
};

export default Portal;
