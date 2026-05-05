import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import Character from './Character'
import Region from './Region'

function Parent() {
    const [characters, setCharacters] = useState([]);
    const [regions, setRegions] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/characters")
            .then((res) => res.json())
            .then((data) => setCharacters(data))
            .catch((error) => console.error("Error fetching characters:", error));

        fetch("http://localhost:5000/regions")
            .then((res) => res.json())
            .then((data) => setRegions(data))
            .catch((error) => console.error("Error fetching regions:", error));
    }, []);

    return (
        <div>
            <h1>League of Legends - Archive</h1>
            <h2>Karaktärer</h2>
            <div className="character-list">
                {characters.map((character) => (
                    <Link key={character.id} to={`/character/${character.id}`}>
                        <Character character={character} />
                    </Link>
                ))}
            </div>

            <h2>Regioner</h2>
            <div className="region-list">
                {regions.map((region) => (
                    <Link key={region.id} to={`/region/${region.id}`}>
                        <Region region={region} />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Parent