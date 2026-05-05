
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

function BookHotel() {
    const { hotelId } = useParams(); // Hämtar hotelId från URL:en
    const navigate = useNavigate(); // För att kunna navigera efter bokningen
    const [hotel, setHotel] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        // Hämta hotellets information baserat på hotelId
        fetch(`http://localhost:5000/hotels/${hotelId}`)
            .then((res) => res.json())
            .then((data) => setHotel(data))
            .catch((error) => console.error('Error fetching hotel data:', error));
    }, [hotelId]);

    const handleBooking = () => {
        // Kontrollera om ett rum är valt
        if (!selectedRoom) {
            alert("Vänligen välj ett rum.");
            return;
        }

        // Uppdatera rummet som bokat genom att uppdatera hela hotellets rum
        const updatedHotel = {
            ...hotel, // Behåll de andra detaljerna av hotellet
            rooms: hotel.rooms.map((room) =>
                room.id === selectedRoom.id ? { ...room, booked: true } : room
            ), // Uppdatera det valda rummet
        };

        fetch(`http://localhost:5000/hotels/${hotelId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedHotel),
        })
            .then((res) => res.json())
            .then((data) => {
                alert("Rummet har bokats!");
                navigate(`/`); // Navigera tillbaka till hotellets sida
            })
            .catch((error) => console.error("Error booking room:", error));
    };

    return (
        <div>
            {hotel ? (
                <>
                    <h2>Boka rum på {hotel.name}</h2>
                    <ul>
                        {hotel.rooms.map((room) => (
                            <li key={room.id}>
                                <button
                                    onClick={() => setSelectedRoom(room)}
                                    style={{
                                        backgroundColor: room.booked ? 'red' : 'green',
                                    }}
                                    disabled={room.booked}
                                >
                                    {room.name} - {room.booked ? 'Bokat' : 'Tillgängligt'}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleBooking} disabled={!selectedRoom}>
                        Bekräfta bokning
                    </button>
                    <Link key={hotel.id} to={`/`}>
                        <button >
                            Avbryt bokning
                        </button>
                    </Link>

                </>
            ) : (
                <p>Hämtar hotellinformation...</p>
            )}
        </div>
    );
}

export default BookHotel