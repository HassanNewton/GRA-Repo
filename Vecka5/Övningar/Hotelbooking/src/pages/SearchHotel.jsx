import React, { useState, useEffect } from 'react'
import HotelDetails from '../components/HotelDetails';
import BookHotel from './BookHotel';

function SearchHotel() {
    const [hotelList, setHotelList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedHotel, setSelectedHotel] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/hotels")
            .then((res) => res.json())
            .then((data) => setHotelList(data))
            .catch((error) => console.error("Error fetching characters:", error));
    }, []);

    const filteredHotel = hotelList.filter((hotel) =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleHotelClick = (hotel) => {
        setSelectedHotel(hotel);
    };

    const closeHotelDetails = () => {
        setSelectedHotel(null);
    };

    return (
        <div>
            <h2>Sök hotell</h2>
            <input
                type="text"
                placeholder="Sök hotell..."
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul>
                {filteredHotel.map((hotel) => (
                    <li key={hotel.id} onClick={() => handleHotelClick(hotel)}>{hotel.name} - {hotel.location}</li>
                ))}
            </ul>


            {selectedHotel && (
                <HotelDetails hotel={selectedHotel} closeDetails={closeHotelDetails} />
            )}
        </div>
    )
}

export default SearchHotel