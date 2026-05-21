# Auth, Context och hur vi kan bygga vidare

## Hur fungerar lösningen idag?

Nuvarande arkitektur bygger på tre delar som samarbetar:

```
localStorage  ──▶  api.js (saveToken / logout)
                       │
               window.dispatchEvent("authChange")
                       │
               App.js lyssnar via addEventListener
                       │
               setAuthed(isAuthenticated())  ──▶  re-render
```

### Flödet steg för steg

1. Användaren loggar in → `Login.jsx` anropar `saveToken(data.token)`
2. `saveToken` sparar token i `localStorage` **och** skickar ett custom `authChange`-event på `window`
3. `App.js` lyssnar på det eventet och kör `setAuthed(isAuthenticated())` → navbaren uppdateras
4. När användaren loggar ut → `logout()` i `api.js` gör samma sak i omvänd ordning

Det fungerar. Men det är en **bro byggd med window-events** för att låta en modul utanför React (`api.js`) kommunicera med React-trädet.

---

## Varför finns `onAuthChange`-eventet överhuvudtaget?

`api.js` är inte en React-komponent. Den har inget `useState`, inget `useEffect`, ingen koppling till komponentträdet. Men `App.js` behöver veta när auth-läget ändras för att kunna re-rendera navbaren.

Problemet: **React vet inte om att localStorage har ändrats.**

Lösningen: skicka ett custom event på `window` och låta `App.js` lyssna på det.

```js
// api.js – skickar signalen
window.dispatchEvent(new Event("authChange"));

// App.js – tar emot signalen
window.addEventListener("authChange", onAuthChange);
```

Det är ett **giltigt mönster**, men det är en workaround. AuthContext är det mer Reaktiva sättet att lösa samma problem.

---

## Vad är AuthContext och när ska det användas?

React Context är ett sätt att dela state **direkt i komponentträdet** utan att behöva skicka props manuellt genom varje nivå (prop drilling).

### Utan Context (props drilling)
```
App  ──authed──▶  Nav  ──authed──▶  NavLink
```

### Med Context
```
AuthProvider  (håller authed, login, logout)
    ├── Nav          (läser direkt via useContext)
    ├── Login        (läser direkt via useContext)
    └── Contacts     (läser direkt via useContext)
```

### Använd AuthContext när:
- Flera komponenter på olika nivåer behöver auth-state
- Du vill slippa importera `logout` / `saveToken` direkt från `api.js` i varje komponent
- Du vill kunna byta ut auth-logik (t.ex. byta från localStorage till cookies) på ett ställe
- Appen växer och fler sidor behöver veta om användaren är inloggad

### Håll dig till nuvarande lösning när:
- Det bara är en komponent (`App.js`) som behöver auth-state
- Appen är liten och enkelriktad
- Du lär dig grunderna och vill hålla det enkelt

**Din nuvarande lösning är inte fel** – den är faktiskt bra för den storleken appen har nu. Men om appen växer är AuthContext nästa naturliga steg.

---

## Hur hade AuthContext sett ut i detta projekt?

### Steg 1 – Skapa `AuthContext.jsx`

```jsx
import React, { createContext, useContext, useState } from "react";
import { isAuthenticated, saveToken, logout } from "./api";

// Skapar själva context-objektet
const AuthContext = createContext(null);

// Provider-komponenten som omsluter hela appen
export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(isAuthenticated());

  function handleLogin(token) {
    saveToken(token);       // sparar i localStorage
    setAuthed(true);        // uppdaterar React-state direkt
  }

  function handleLogout() {
    logout();               // tar bort från localStorage
    setAuthed(false);       // uppdaterar React-state direkt
  }

  return (
    <AuthContext.Provider value={{ authed, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook – enklare att använda i komponenter
export function useAuth() {
  return useContext(AuthContext);
}
```

### Steg 2 – Wrappa appen i `index.js` eller `App.js`

```jsx
// index.js
import { AuthProvider } from "./AuthContext";

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

### Steg 3 – Använd `useAuth()` i komponenterna

```jsx
// Login.jsx – istället för att importera saveToken direkt
import { useAuth } from "./AuthContext";

function Login() {
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    const data = await api.login({ email, password });
    if (data.token) {
      login(data.token);   // ← Context sköter resten
      navigate("/contacts");
    }
  }
}
```

```jsx
// Contacts.jsx – istället för att importera logout direkt
import { useAuth } from "./AuthContext";

function Contacts() {
  const { logout } = useAuth();

  function doLogout() {
    logout();
    navigate("/");
  }
}
```

```jsx
// App.js – drastiskt förenklat
import { useAuth } from "./AuthContext";

function App() {
  const { authed } = useAuth();
  // Inget useEffect, inga window.addEventListener
  // authed uppdateras automatiskt när login/logout körs
}
```

---

## Vad händer med `authChange`-eventet?

Med AuthContext behövs det **inte längre**. Istället för att:

1. `api.js` dispatchar ett event på `window`
2. `App.js` lyssnar och uppdaterar sin state

Gör vi:

1. `login()` i Context sätter `setAuthed(true)` direkt
2. React uppdaterar alla komponenter som använder `useAuth()` automatiskt

`window.addEventListener` och `window.dispatchEvent` kan tas bort helt.

---

## Jämförelse sida vid sida

| | Nuvarande lösning | Med AuthContext |
|---|---|---|
| Auth-state bor i | `App.js` (useState) | `AuthContext` (useState) |
| Kommunikation | `window` custom events | React state direkt |
| Importerar från | `api.js` i varje komponent | `useAuth()` hook |
| Antal lyssnare | 2 (authChange + storage) | 0 |
| Skalbarhet | Bra för liten app | Bättre för större app |
| Testbarhet | Lite svårare (window events) | Enklare (mock context) |

---

## Hur kan vi bygga vidare?

### Nästa steg 1 – Lägg till `user` i Context

När backend skickar tillbaka mer än token (t.ex. namn och email):

```jsx
const [user, setUser] = useState(null);

function handleLogin(token, userData) {
  saveToken(token);
  setUser(userData);
  setAuthed(true);
}

// I komponenter:
const { user } = useAuth();
// <p>Inloggad som {user.name}</p>
```

### Nästa steg 2 – Automatisk utloggning vid 401

I `api.js`, om backend svarar med 401 (unauthorized):

```js
if (res.status === 401) {
  logout();
  window.dispatchEvent(new Event("authChange")); // eller bättre: Context callback
}
```

Med Context kan du istället skicka in en `onUnauthorized`-callback från Context till `api.js`.

### Nästa steg 3 – Persistent user (refresh-säker)

Spara user-data i localStorage precis som token, och läs upp det vid start:

```jsx
const [user, setUser] = useState(() => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
});
```

