import React, { useState } from "react";

export default function SimpleForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Formulär skickat:", email);
    setEmail(""); // Töm inputen
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Din email..."
      />
      <button type="submit">Skicka</button>
    </form>
  );
}
