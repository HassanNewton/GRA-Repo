import React from 'react'

function Review({ review, onDelete }) {

    return (
        <div className="review">
            <p><strong>Betyg:</strong> {review.rating}/10</p>
            <p>{review.review}</p>
            <button onClick={() => onDelete(review.id)}>
                Ta bort review
            </button>
        </div>
    )
}

export default Review