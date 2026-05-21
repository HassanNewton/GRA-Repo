import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Contacts from "./Contacts";
import { isAuthenticated } from "./api";
import { useAuth } from "./AuthContext";
import "./App.css";

// Wrapper-komponent som skyddar routes som kräver inloggning.
function RequireAuth({ children }) {
  if (!isAuthenticated())
    return <Navigate to="/" replace />;
  return children;
}

function App() {
  // useAuth() hämtar authed direkt från Context.
  // Ingen useState, inget useEffect, inga window-lyssnare behövs.
  // När login() eller logout() körs i Context uppdateras authed automatiskt.
  const { authed } = useAuth();

  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="top-nav">
          {/* Navigation-länkar (React Router) */}
          <Link to="/">Login</Link>
          <Link to="/register">Register</Link>

          {/* Visas bara om användaren är inloggad */}
          {authed && <Link to="/contacts">Contacts</Link>}
        </nav>

        <main className="main">
          {/* Routes definierar vilka komponenter som visas på vilka paths */}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Skyddad route */}
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
