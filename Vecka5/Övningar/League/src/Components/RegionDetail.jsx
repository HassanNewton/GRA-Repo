import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const RegionDetail = () => {
    const { id } = useParams();
    const [region, setRegion] = useState(null);
    const navigate = useNavigate(); // För navigering
    useEffect(() => {
        fetch(`http://localhost:5000/regions/${id}`)
            .then((res) => res.json())  // Omvandla svaret till JSON
            .then((data) => {
                console.log("Hämtad region:", data);  // Skriv ut den hämtade datan till konsolen
                setRegion(data);  // Sätt regionen i state
            })
            .catch((error) => console.error("Error fetching region:", error));  // Hantera fel
    }, [id]);  // Effekt körs om 'id' ändras



    if (!region) return <p>Laddar...</p>;

    return (
        <div>
            <h2>{region.name}</h2>
            <img src={region.image} alt={region.name} width="1000" />
            <p>{region.description}</p>
            <button onClick={() => navigate('/')}>Back to home</button>
        </div>
    );
};

export default RegionDetail;
