import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";

// useAuth() importeras från Context istället för att importera saveToken direkt från api.js.
// Nu sköter Context token-sparandet OCH uppdateringen av authed-state i ett steg.
import { useAuth } from "./AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // login-funktionen kommer från AuthContext.
  // Den kör saveToken(token) + setAuthed(true) inuti sig.
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = await api.login({ email, password });

      if (data.token) {
        // Tidigare: saveToken(data.token)  ← importerades direkt från api.js
        // Nu:       login(data.token)      ← kommer från AuthContext
        //
        // Skillnaden: Context uppdaterar authed-state direkt i React-trädet.
        // Inget window-event behövs för att navbaren ska uppdateras.
        login(data.token);

        navigate("/contacts");
      } else {
        setError("No token returned");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-card">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
        />

        <label>Password</label>
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          required
        />

        <button type="submit">Login</button>
      </form>

      {error && <p className="error">{error}</p>}

      <p>
        Don't have an account?
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
