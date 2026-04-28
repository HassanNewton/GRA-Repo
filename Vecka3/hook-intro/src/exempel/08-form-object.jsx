import React, { useState } from "react";

export default function FormWithObject() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Skickar:", formData);
    setFormData({ name: "", email: "", age: "" });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Namn"
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
        placeholder="Ålder"
      />
      <button type="submit">Skicka</button>
    </form>
  );
}
