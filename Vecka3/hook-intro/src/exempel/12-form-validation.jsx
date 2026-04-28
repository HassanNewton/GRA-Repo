import React, { useState } from "react";

export default function FormWithValidation() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};

    if (!form.email) newErrors.email = "Email krävs";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Ogiltig email";

    if (!form.password) newErrors.password = "Lösenord krävs";
    else if (form.password.length < 6)
      newErrors.password = "Lösenord måste vara minst 6 tecken";

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Formulär är giltigt! Skickar...", form);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
      </div>

      <div>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Lösenord"
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
      </div>

      <button type="submit">Logga in</button>
    </form>
  );
}
