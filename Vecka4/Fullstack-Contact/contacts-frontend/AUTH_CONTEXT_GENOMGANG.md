# Auth & Context – steg-för-steg genomgång

> Alla originalfiler är orörda. Jämför varje "Före"-fil med sin "Efter"-fil.
>
> | Original | Med Context |
> | --- | --- |
> | `App.js` | `AppWithContext.jsx` |
> | `Login.jsx` | `LoginWithContext.jsx` |
> | `Contacts.jsx` | `ContactsWithContext.jsx` |
> | – | `AuthContext.jsx` (ny fil) |

---

## Varför ändrar vi något alls?

Nuvarande kod fungerar, men har ett designproblem: `api.js` är en vanlig JavaScript-modul, **utanför React**. När `saveToken()` eller `logout()` körs vet React inte om det.

Lösningen i originalfilen är att skicka ett custom event på `window`:

```js
// api.js (original)
window.dispatchEvent(new Event("authChange"));  // ← signal ut ur api.js
```

```js
// App.js (original)
window.addEventListener("authChange", onAuthChange);  // ← fångar signalen
```

Det fungerar, men det är en **bro utanför React**. AuthContext löser samma problem helt inuti React.

---

## Steg 1 – Ny fil: `AuthContext.jsx`

> Denna fil finns inte i originalet. Den är grunden för hela förändringen.

```jsx
import React, { createContext, useContext, useState } from "react";
import { isAuthenticated, saveToken, logout as apiLogout } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(isAuthenticated());

  function login(token) {
    saveToken(token);   // sparar token i localStorage (samma som förut)
    setAuthed(true);    // uppdaterar React-state direkt – inget window-event
  }

  function logout() {
    apiLogout();        // tar bort token (samma som förut)
    setAuthed(false);   // uppdaterar React-state direkt
  }

  return (
    <AuthContext.Provider value={{ authed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

**Varför gör vi så här?**

`AuthProvider` är en vanlig React-komponent som håller `authed`-state. Alla komponenter som är barn till den kan läsa `authed`, `login()` och `logout()` via `useAuth()` – utan att behöva ta emot dem som props.

---

## Steg 2 – `index.js`: Wrappa appen

> `index.js` ändras bara på ett ställe: `AuthProvider` läggs till runt `<App />`.

```jsx
// FÖRE
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// EFTER
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

**Varför här?** `AuthProvider` måste vara förälder till alla komponenter som ska använda `useAuth()`. Genom att lägga den i `index.js` täcker den hela appen.

---

## Steg 3 – `App.js` → `AppWithContext.jsx`

Jämför dessa två versioner sida vid sida.

### Före (`App.js`)

```jsx
import React, { useEffect, useState } from "react";
import { isAuthenticated } from "./api";

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

  // ...
}
```

### Efter (`AppWithContext.jsx`)
```jsx
import React from "react";
import { useAuth } from "./AuthContext";

function App() {
  const { authed } = useAuth();
  // Det är allt. Inget useState, inget useEffect, inga lyssnare.
  // ...
}
```

**Vad försvann och varför?**

| Borttaget | Varför det inte behövs |
|---|---|
| `useState(isAuthenticated())` | `authed` lever nu i Context |
| `useEffect(...)` | Inga lyssnare behövs längre |
| `window.addEventListener(...)` | Context triggar re-render direkt |
| `window.removeEventListener(...)` | Cleanup-funktionen behövs inte |

---

## Steg 4 – `Login.jsx` → `LoginWithContext.jsx`

Det enda som ändras är **en rad**: hur token sparas efter inloggning.

### Före (`Login.jsx`)
```jsx
import api, { saveToken } from "./api";

// ...

if (data.token) {
  saveToken(data.token);  // ← importerat direkt från api.js
  navigate("/contacts");
}
```

### Efter (`LoginWithContext.jsx`)
```jsx
import api from "./api";
import { useAuth } from "./AuthContext";

// ...

const { login } = useAuth();

// ...

if (data.token) {
  login(data.token);  // ← kommer från Context
  navigate("/contacts");
}
```

**Vad händer när `login(data.token)` körs?**

```
LoginWithContext.jsx
  └── login(token)              ← anropar Context-funktionen
        ├── saveToken(token)    ← sparar i localStorage (som förut)
        └── setAuthed(true)     ← React uppdaterar alla som lyssnar på authed
              └── AppWithContext.jsx re-renderar → navbaren visar "Contacts"
```

Jämför med det gamla flödet:

```
Login.jsx
  └── saveToken(token)
        └── window.dispatchEvent("authChange")  ← skickar ut ur React
              └── App.js lyssnar
                    └── setAuthed(isAuthenticated())  ← React uppdaterar
```

Samma slutresultat, men Context-vägen sker helt inuti React utan omvägen via `window`.

---

## Steg 5 – `Contacts.jsx` → `ContactsWithContext.jsx`

Exakt samma mönster som Login, fast för logout.

### Före (`Contacts.jsx`)
```jsx
import api, { logout } from "./api";

// ...

function doLogout() {
  logout();       // ← importerat direkt från api.js
  navigate("/");
}
```

### Efter (`ContactsWithContext.jsx`)
```jsx
import api from "./api";
import { useAuth } from "./AuthContext";

// ...

const { logout } = useAuth();

function doLogout() {
  logout();       // ← kommer från Context
  navigate("/");
}
```

**Vad händer när `logout()` körs?**

```
ContactsWithContext.jsx
  └── logout()               ← anropar Context-funktionen
        ├── apiLogout()      ← tar bort token från localStorage
        └── setAuthed(false) ← React uppdaterar → navbaren döljer "Contacts"
```

---

## Helhetsbilden – vad ändrades totalt?

```
ORIGINAL                          MED CONTEXT
─────────────────────────────     ─────────────────────────────
api.js                            api.js  (oförändrad)
  ├── saveToken()                   ├── saveToken()
  │     └── window.dispatchEvent    │     (inga events längre)
  └── logout()                      └── logout()
        └── window.dispatchEvent          (inga events längre)

App.js                            AuthContext.jsx  (ny)
  ├── useState(authed)               ├── useState(authed)
  └── useEffect                      ├── login()  → saveToken + setAuthed(true)
        ├── addEventListener          └── logout() → apiLogout + setAuthed(false)
        └── removeEventListener
                                  AppWithContext.jsx
                                    └── const { authed } = useAuth()

Login.jsx                         LoginWithContext.jsx
  └── saveToken(token)              └── login(token)  ← från useAuth()

Contacts.jsx                      ContactsWithContext.jsx
  └── logout()                       └── logout()     ← från useAuth()
```

---

## En sak som är lika i båda versionerna

`RequireAuth` i `App.js` / `AppWithContext.jsx` anropar fortfarande `isAuthenticated()` direkt:

```jsx
function RequireAuth({ children }) {
  if (!isAuthenticated())
    return <Navigate to="/" replace />;
  return children;
}
```

Det är **medvetet**. `RequireAuth` körs synkront när React renderar rutten. Den läser direkt från `localStorage` och det fungerar lika bra med eller utan Context. Det är ett enkelt skydd och behöver inte bli mer komplext.

---

## Nästa möjliga steg att bygga vidare på

### Lägg till `user` i Context

Backend kan skicka tillbaka mer än token (namn, email). Spara det i Context:

```jsx
// AuthContext.jsx
const [user, setUser] = useState(null);

function login(token, userData) {
  saveToken(token);
  setUser(userData);
  setAuthed(true);
}

// I en komponent:
const { user } = useAuth();
// <p>Välkommen, {user.name}!</p>
```

### Automatisk utloggning vid 401

Om backend svarar med 401 (token utgången) ska användaren loggas ut automatiskt.
Med Context kan `api.js` ta emot en callback:

```jsx
// AuthContext.jsx
useEffect(() => {
  // Registrerar en global callback som api.js kan anropa
  window.__authLogout = logout;
  return () => { window.__authLogout = null; };
}, []);
```

```js
// api.js
if (res.status === 401 && window.__authLogout) {
  window.__authLogout();
}
```
