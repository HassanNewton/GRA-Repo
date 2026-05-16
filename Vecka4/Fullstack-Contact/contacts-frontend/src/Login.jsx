import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { saveToken } from "./api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const data = await api.login({ email, password });
      if (data.token) {
        saveToken(data.token);
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
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}
