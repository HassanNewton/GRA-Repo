import React, { useState } from "react";

export default function MultiInputForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    console.log("Formulärdata:", { name, email, message });

    // Töm formuläret
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Namn:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ditt namn"
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Din email"
        />
      </div>

      <div>
        <label>Meddelande:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ditt meddelande..."
        />
      </div>

      <button type="submit">Skicka</button>
    </form>
  );
}
