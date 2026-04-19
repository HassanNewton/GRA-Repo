import React, { useState } from 'react'

function AddReviewForm({ filmId, addReview }) {
    const [review, setReview] = useState("");
    const [rating, setRating] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault(); // Förhindra sidomladdning

        if (!rating || !review.trim()) return; // Kontrollera om värdena är tomma

        const newReview = {
            id: Date.now(), // Använd Date.now() för att skapa ett unikt ID för recensionen
            rating: Number(rating),
            review,
        };

        addReview(filmId, newReview); // Skickar filmen till parent-komponenten
        setRating(""); // Nollställ inputfältet
        setReview("");

    }

    return (
        <div className="add-review-form">

            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Betyg från 1-10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Skriv en recension"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                />

                <button type="submit">Lägg till recension</button>
            </form>
        </div>
    );

}

export default AddReviewForm