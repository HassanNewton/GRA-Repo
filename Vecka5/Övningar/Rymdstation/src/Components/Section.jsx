import React from 'react'
import { Link } from 'react-router-dom';

function Section({ section }) {

    return (
        <div className="section">
            <h2>{section.name}</h2>
            <p>{section.description}</p>
            <Link to={`/section/${section.id}`}>
                <button>More Details</button>
            </Link>
        </div>
    );
};

export default Section