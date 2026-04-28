import React, { useState, useEffect } from "react";

export default function FetchOnMount() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Komponenten laddad - hämtar data från API");

    fetch("https://jsonplaceholder.typicode.com/users/1")
      .then((res) => res.json())
      .then((user) => {
        setData(user);
        setLoading(false);
      });
  }, []); // Tomt array = körs en gång när komponenten monteras

  if (loading) return <p>Laddar...</p>;

  return (
    <div>
      <h2>{data.name}</h2>
      <p>Email: {data.email}</p>
    </div>
  );
}
