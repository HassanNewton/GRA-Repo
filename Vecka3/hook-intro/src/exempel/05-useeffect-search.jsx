import React, { useState, useEffect } from "react";

export default function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchTerm.length === 0) {
      setResults([]);
      return;
    }

    console.log("Söker efter:", searchTerm);
    fetch(`https://jsonplaceholder.typicode.com/users?name_like=${searchTerm}`)
      .then((res) => res.json())
      .then((users) => setResults(users));
  }, [searchTerm]); // Körs varje gång searchTerm ändras

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Sök användare..."
      />
      <ul>
        {results.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
