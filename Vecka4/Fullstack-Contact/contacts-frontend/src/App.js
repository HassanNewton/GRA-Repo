import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Contacts from "./Contacts";
import { isAuthenticated } from "./api";
import "./App.css";

// Wrapper-komponent som skyddar routes som kräver inloggning.
function RequireAuth({ children }) {
  // Kontrollerar om användaren är inloggad.
  if (!isAuthenticated())
    // Redirectar till login-sidan om inte inloggad.
    return <Navigate to="/" replace />;

  // Om inloggad: rendera sidan som skickades in.
  return children;
}

function App() {
  // State som håller koll på om användaren är inloggad.
  const [authed, setAuthed] = useState(isAuthenticated());

  // Körs när komponenten mountas (startar).
  useEffect(() => {
    // Funktion som uppdaterar auth-state.
    function onAuthChange() {
      // Läser om auth-status från localStorage.
      setAuthed(isAuthenticated());
    }

    // Lyssnar på custom event från API:t.
    window.addEventListener("authChange", onAuthChange);

    // Lyssnar på browser storage events (t.ex. andra tabs).
    window.addEventListener("storage", onAuthChange);

    // Cleanup-funktion (körs när komponenten unmountas).
    return () => {
      window.removeEventListener("authChange", onAuthChange);
      window.removeEventListener("storage", onAuthChange);
    };
  }, []);

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
