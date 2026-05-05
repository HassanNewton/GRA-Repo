import React from 'react'

function Region({ region }) {
    return (
        <div className="region-card">
            <img src={region.image} alt={region.name} width={100} />
            <h2>{region.name}</h2>
        </div>);
}

export default Region