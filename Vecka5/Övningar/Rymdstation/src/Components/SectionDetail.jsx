// SectionDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function SectionDetails() {
    const { id } = useParams(); // Hämtar id från URL
    const navigate = useNavigate(); // För navigering
    const [section, setSection] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/sections')
            .then((response) => response.json())
            .then((data) => {
                const section = data.find((sec) => sec.id === parseInt(id));
                setSection(section);
            });
    }, [id]);

    if (!section) return <div>Loading...</div>;

    return (
        <div className="section-details">
            <h2>{section.name}</h2>
            <p>{section.description}</p>
            <p><strong>Interesting Fact:</strong> {section.interestingFact}</p>
            <p><strong>Current Crew:</strong></p>
            <ul>
                {section.currentCrew.map((crewMember, index) => (
                    <li key={index}>{crewMember}</li>
                ))}
            </ul>
            <button onClick={() => navigate('/')}>Back to Portal</button>
        </div>
    );
};

export default SectionDetails;
