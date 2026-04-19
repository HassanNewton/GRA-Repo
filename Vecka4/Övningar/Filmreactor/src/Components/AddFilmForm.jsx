import React, { useState } from 'react'

function AddFilmForm({ addFilm }) {
    const [title, setTitle] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault(); // Förhindra sidomladdning

        if (!title.trim()) return; // Stoppa om fältet är tomt

        const newFilm = {
            title,
            reviews: [], // Skapar en film med en tom lista av recensioner
        };

        addFilm(newFilm); // Skickar filmen till parent-komponenten
        setTitle(""); // Nollställ inputfältet

    }
    return (
        <div className="add-film-form">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Ange filmtitel"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <button type="submit">Lägg till film</button>
            </form>
        </div>
    );

}

export default AddFilmForm