import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { saveToken } from "./api";

export default function Login() {

  // State för email-inputen.
  const [email, setEmail] = useState("");

  // State för password-inputen.
  const [password, setPassword] = useState("");

  // State för eventuella felmeddelanden.
  const [error, setError] = useState("");

  // useNavigate används för att byta route/sida.
  const navigate = useNavigate();


  // Körs när formuläret skickas.
  async function handleSubmit(e) {

    // Förhindrar att sidan refreshas.
    e.preventDefault();

    // Nollställer gamla felmeddelanden.
    setError("");

    try {

      // Skickar login-request till backend.
      const data = await api.login({
        email,
        password
      });


      // Om backend skickade tillbaka en token.
      if (data.token) {

        // Sparar token i localStorage.
        saveToken(data.token);

        // Skickar användaren till contacts-sidan.
        navigate("/contacts");

      } else {

        // Om backend inte skickade token.
        setError("No token returned");
      }

    } catch (err) {

      // Visar error från backend/API.
      setError(err.message);
    }
  }


  return (
    <div className="auth-card">

      <h2>Login</h2>

      {/* onSubmit kör handleSubmit när formuläret skickas */}
      <form onSubmit={handleSubmit}>

        <label>Email</label>

        <input

          // value kopplar inputen till state.
          value={email}

          // Körs varje gång användaren skriver.
          onChange={e =>

            // e.target.value = det användaren skrev.
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
          Login
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

        Don't have an account?

        {/* Link används istället för <a>.
            React Router byter sida utan refresh. */}
        <Link to="/register">
          Register
        </Link>

      </p>
    </div>
  );
}