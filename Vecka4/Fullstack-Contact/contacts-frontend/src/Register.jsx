import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // useNavigate används för att byta route/sida.
  const navigate = useNavigate();

  // Körs när formuläret skickas.
  async function handleSubmit(e) {

    // Förhindrar att sidan refreshas.
    e.preventDefault();

    // Rensar gamla felmeddelanden.
    setError("");

    try {

      // Skickar register-request till backend.
      await api.register({
        name,
        email,
        password
      });

      // Om registreringen lyckades:
      // skicka användaren till login-sidan.
      navigate("/");

    } catch (err) {

      // Om backend/API skickar error:
      // visa felmeddelandet.
      setError(err.message);
    }
  }


  return (
    <div className="auth-card">

      <h2>Register</h2>

      {/* onSubmit körs när formuläret skickas */}
      <form onSubmit={handleSubmit}>

        <label>Name</label>

        <input

          // value kopplar input-fältet till state.
          value={name}

          // Körs varje gång användaren skriver.
          onChange={e =>

            // e.target.value = texten användaren skrev.
            setName(e.target.value)
          }

          required
        />


        <label>Email</label>

        <input
          value={email}

          onChange={e =>
            setEmail(e.target.value)
          }

          type="email"
          required
        />


        <label>Password</label>

        <input
          value={password}

          onChange={e =>
            setPassword(e.target.value)
          }

          type="password"
          required
        />


        <button type="submit">
          Register
        </button>
      </form>


      {/* Conditional rendering.
          Om error innehåller text:
          visa error-meddelandet */}
      {error && (
        <p className="error">
          {error}
        </p>
      )}


      <p>

        Already have an account?

        {/* Link används istället för vanlig <a>-tagg.
            React Router byter sida utan refresh. */}
        <Link to="/">
          Login
        </Link>

      </p>
    </div>
  );
}