import { click } from "@testing-library/user-event/dist/click";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CharacterDetail = () => {
    const { id } = useParams();
    const [character, setCharacter] = useState(null);
    const navigate = useNavigate(); // För navigering

    useEffect(() => {
        fetch(`http://localhost:5000/characters/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setCharacter(data)
            })
            .catch((error) => console.error("Error fetching character:", error));
    }, [id]);

    if (!character) return <p>Laddar...</p>;

    return (
        <div>
            <h2>{character.name}</h2>
            <img src={character.image} alt={character.name} width="300" />
            <p>{character.description}</p>
            <p><strong>Region:</strong> {character.region}</p>
            <button onClick={() => navigate('/')}>Back to home</button>
        </div>
    );
};

export default CharacterDetail;
