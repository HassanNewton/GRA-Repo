import React from 'react';
import { Link } from "react-router-dom";
import BookHotel from '../pages/BookHotel';

function HotelDetails({ hotel, closeDetails }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <h3>{hotel.name}</h3>
                <p>{hotel.location}</p>
                <img src={hotel.image} alt={hotel.name} width="200" />
                <h4>Reviews:</h4>
                <ul>
                    {hotel.reviews.map((review) => (
                        <li key={review.id}>
                            Rating: {review.rating} - {review.comment}
                        </li>
                    ))}
                </ul>
                <h4>Rooms:</h4>
                <ul>
                    {hotel.rooms.map((room) => (
                        <li key={room.id}>
                            {room.type} - ${room.price} - {room.booked ? "Booked" : "Available"}
                        </li>
                    ))}
                </ul>
                <button onClick={closeDetails}>Close</button>

                <Link key={hotel.id} to={`/hotels/${hotel.id}`}>
                    <button> Boka </button>
                </Link>
            </div>
        </div>
    );
}

export default HotelDetails;
