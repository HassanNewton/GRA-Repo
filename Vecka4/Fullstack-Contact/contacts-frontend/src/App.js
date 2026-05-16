import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Contacts from "./Contacts";
import { isAuthenticated } from "./api";
import "./App.css";

function RequireAuth({ children }) {
  if (!isAuthenticated()) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const [authed, setAuthed] = useState(isAuthenticated());

  useEffect(() => {
    function onAuthChange() {
      setAuthed(isAuthenticated());
    }
    window.addEventListener("authChange", onAuthChange);
    window.addEventListener("storage", onAuthChange);
    return () => {
      window.removeEventListener("authChange", onAuthChange);
      window.removeEventListener("storage", onAuthChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="top-nav">
          <Link to="/">Login</Link>
          <Link to="/register">Register</Link>
          {authed && <Link to="/contacts">Contacts</Link>}
        </nav>
        <main className="main">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/contacts"
              element={
                <RequireAuth>
                  <Contacts />
                </RequireAuth>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
