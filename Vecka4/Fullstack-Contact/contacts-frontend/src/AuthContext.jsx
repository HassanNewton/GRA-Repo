import React, { createContext, useContext, useState } from "react";
import { isAuthenticated, saveToken, logout as apiLogout } from "./api";

// Skapar själva context-objektet.
// null = standardvärde innan Provider är på plats.
const AuthContext = createContext(null);

// Provider-komponenten som omsluter hela appen.
// Håller auth-state och exponerar login/logout till alla barn.
export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(isAuthenticated());

  // Anropas när användaren loggar in.
  function login(token) {
    saveToken(token);   // sparar token i localStorage
    setAuthed(true);    // uppdaterar React-state direkt – inga events behövs
  }

  // Anropas när användaren loggar ut.
  function logout() {
    apiLogout();        // tar bort token från localStorage
    setAuthed(false);   // uppdaterar React-state direkt
  }

  return (
    <AuthContext.Provider value={{ authed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook så att komponenter slipper skriva useContext(AuthContext) själva.
export function useAuth() {
  return useContext(AuthContext);
}
