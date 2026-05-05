import React from 'react'

function Character({ character }) {
    return (
        <div className="character-card">
            <img src={character.image} alt={character.name} width={20} />
            <h2>{character.name}</h2>

        </div>);
}

export default Character