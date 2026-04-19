import React from 'react'
import Review from './Review';

function Film({ film, onDelete, onDeleteReview }) {

    return (
        <div className="film">
            <h3>{film.title}</h3>
            <p>Recensioner: {film.reviews.length}</p>
            <button onClick={() => onDelete(film.id)}>Ta bort</button>

            <h4>Recensioner:</h4>
            {film.reviews.length > 0 ? (
                film.reviews.map((review) => (
                    <Review key={review.id} review={review} onDelete={(reviewId) => onDeleteReview(film.id, reviewId)} />
                ))
            ) : (<p>Inga recensioner ännu</p>
            )}
        </div>
    );
}

export default Film