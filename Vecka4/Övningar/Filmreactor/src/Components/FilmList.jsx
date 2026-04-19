import React, { useState, useEffect } from "react";
import Film from "./Film";
import AddFilmForm from "./AddFilmForm";
import AddReviewForm from "./AddReviewForm";

function FilmList() {
    const [films, setFilms] = useState([]);

    // Hämta filmer från JSON-server
    useEffect(() => {
        fetch("http://localhost:3000/films")
            .then((response) => response.json())
            .then((data) => setFilms(data));
    }, []);

    // Funktion för att lägga till en ny film
    const addFilm = (newFilm) => {
        fetch("http://localhost:3000/films", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newFilm),
        })
            .then((response) => response.json())
            .then((addedFilm) => setFilms([...films, addedFilm]));
    };

    // Funktion för att lägga till en ny recension
    const addReview = (filmId, newReview) => {
        const updatedFilms = films.map((film) => {
            if (film.id === filmId) {
                return {
                    ...film,
                    reviews: [...film.reviews, newReview],
                };
            }
            return film;
        });

        // Uppdatera servern med nya recensioner
        const updatedFilm = updatedFilms.find((film) => film.id === filmId);

        fetch(`http://localhost:3000/films/${filmId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFilm),
        }).then(() => setFilms(updatedFilms));
    };

    // Funktion för att ta bort en film
    const deleteFilm = (id) => {
        fetch(`http://localhost:3000/films/${id}`, {
            method: "DELETE",
        }).then(() => {
            setFilms(films.filter((film) => film.id !== id));
        });
    };

    // Funktion för att ta bort en recension
    const deleteReview = (filmId, reviewId) => {
        const updatedFilms = films.map((film) => {
            if (film.id === filmId) {
                return {
                    ...film,
                    reviews: film.reviews.filter((review) => review.id !== reviewId),
                };
            }
            return film;
        });

        // Uppdatera servern med nya recensioner
        const updatedFilm = updatedFilms.find((film) => film.id === filmId);

        fetch(`http://localhost:3000/films/${filmId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedFilm),
        }).then(() => setFilms(updatedFilms));
    };

    return (
        <div className="film-list">
            <h2>Filmlista</h2>
            <AddFilmForm addFilm={addFilm} /> {/* Lägg till formuläret här */}

            {films.map((film) => (
                <div key={film.id} className="film-list-item">
                    <Film film={film} onDelete={deleteFilm} onDeleteReview={deleteReview} />
                    <AddReviewForm filmId={film.id} addReview={addReview} /> {/* Lägg till AddReviewForm för varje film */}
                </div>
            ))}
        </div>
    );
}

export default FilmList;
