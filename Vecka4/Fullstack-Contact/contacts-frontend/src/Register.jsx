import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await api.register({ name, email, password });
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="auth-card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
        <label>Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        <button type="submit">Register</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>Already have an account? <Link to="/">Login</Link></p>
    </div>
  );
}
