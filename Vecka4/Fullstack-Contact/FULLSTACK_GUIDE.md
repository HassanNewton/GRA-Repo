# Fullstack Guide: Backend + Frontend Integration

> En steg-för-steg guide för att förstå hur backend och frontend hänger ihop i detta projekt.

---

## Innehållsförteckning

1. [Arkitekturöversikt](#1-arkitekturöversikt)
2. [Starta projektet](#2-starta-projektet)
3. [Hur backend och frontend pratar med varandra](#3-hur-backend-och-frontend-pratar-med-varandra)
4. [Autentisering – Hur JWT fungerar](#4-autentisering--hur-jwt-fungerar)
5. [Skyddade routes i backend](#5-skyddade-routes-i-backend)
6. [Skyddade routes i frontend](#6-skyddade-routes-i-frontend)
7. [API-lagret i frontend](#7-api-lagret-i-frontend)
8. [Dataflöde – Från knapptryck till databas](#8-dataflöde--från-knapptryck-till-databas)
9. [Vanliga fel och hur du felsöker](#9-vanliga-fel-och-hur-du-felsöker)
10. [Checklista för att koppla ihop ett nytt projekt](#10-checklista-för-att-koppla-ihop-ett-nytt-projekt)

---

## 1. Arkitekturöversikt

```
BROWSER (React)                    SERVER (Node/Express)              DATABAS (MongoDB)
─────────────────                  ─────────────────────              ─────────────────
                                                                       
  contacts-frontend/       HTTP    MyContacts-backend/
  ┌──────────────────┐   ──────►  ┌───────────────────┐   Mongoose   ┌─────────────┐
  │  App.js          │            │  server.js        │  ──────────► │  MongoDB    │
  │  Login.jsx       │   ◄──────  │  routers/         │              │  Atlas/     │
  │  Contacts.jsx    │   JSON     │  controllers/     │   ◄────────  │  Local      │
  │  api.js          │            │  middleware/       │              └─────────────┘
  └──────────────────┘            │  models/          │
  port: 3000 (React)              └───────────────────┘
                                  port: 3000 (Express)
                                  (eller annan port i .env)
```

**Viktigt att förstå:**
- React och Express körs som **separata processer** i terminalen
- De kommunicerar via **HTTP-anrop** (samma som en webbläsare som laddar en sida)
- Datan skickas som **JSON**
- Token skickas i varje requests **header** för att identifiera användaren

---

## 2. Starta projektet

### Steg 1: Konfigurera backend

Skapa filen `MyContacts-backend/.env`:

```env
PORT=3000
CONNECTION_STRING=mongodb+srv://<username>:<password>@cluster.mongodb.net/mycontacts
ACCESS_TOKEN_SECRET=ettlångtslupmpatttgissahemlignyckel123
```

> `ACCESS_TOKEN_SECRET` kan vara vilket långt slumpmässigt värde som helst – det används för att signera JWT-tokens. Byt **aldrig** ut det i produktion utan att logga ut alla användare.

### Steg 2: Installera och starta backend

```bash
cd MyContacts-backend
npm install
npm run dev       # startar med nodemon (auto-reload vid ändringar)
```

Kontrollera att du ser:
```
Server running on port 3000
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

### Steg 3: Installera och starta frontend

```bash
cd contacts-frontend
npm install
npm start         # startar React på port 3000 (eller 3001 om backend redan kör)
```

> Om React och Express kör på **samma port** krockar de. React hittar nästa lediga port automatiskt (t.ex. 3001). Justera då `API_BASE` i `src/api.js`.

---

## 3. Hur backend och frontend pratar med varandra

### Backend: Definiera en endpoint

I `MyContacts-backend/routers/contactRoutes.js`:

```javascript
const router = require("express").Router();
const validateToken = require("../middleware/validateTokenHandler");
const { getContacts, createContacts } = require("../controllers/contactController");

router.use(validateToken); // Alla routes nedan kräver giltig token

router.route("/").get(getContacts).post(createContacts);

module.exports = router;
```

I `server.js` kopplas routern till en URL-prefix:

```javascript
app.use("/api/contacts", require("./routers/contactRoutes"));
```

Resultat: `GET http://localhost:3000/api/contacts` → `getContacts()`

---

### Frontend: Anropa endpointen

I `contacts-frontend/src/api.js`:

```javascript
const API_BASE = "http://localhost:3000/api";

export async function getContacts() {
  return request("/contacts");  // → GET http://localhost:3000/api/contacts
}

async function request(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${response.status}`);
  }

  return response.json();
}
```

**Nyckelkonceptet:** `Authorization: Bearer <token>` – varje request skickar med token i headern så att backend vet vem som frågar.

---

## 4. Autentisering – Hur JWT fungerar

JWT (JSON Web Token) är en krypterad sträng som bevisar vem du är. Så här ser flödet ut:

```
1. REGISTRERING
   Frontend → POST /api/users/register { username, email, password }
   Backend  → Hashar lösenordet med bcrypt → Sparar i MongoDB
   Backend  → Svarar med { _id, username, email }

2. INLOGGNING
   Frontend → POST /api/users/login { email, password }
   Backend  → Hittar användaren → Jämför lösenord med bcrypt.compare()
   Backend  → Skapar JWT: jwt.sign({ user: { id, email } }, SECRET, { expiresIn: "15m" })
   Backend  → Svarar med { accessToken: "eyJhbGciO..." }
   Frontend → Sparar token i localStorage

3. SKYDDADE ANROP (t.ex. hämta kontakter)
   Frontend → GET /api/contacts  +  Header: "Authorization: Bearer eyJhbGciO..."
   Backend  → Middleware plockar ut token ur headern
   Backend  → jwt.verify(token, SECRET) → Avkodar { user: { id, email } }
   Backend  → Sätter req.user = avkodad user
   Backend  → Controller filtrerar data på req.user.id
   Backend  → Svarar med kontakterna som tillhör den inloggade användaren
```

### Varför localStorage?

```javascript
// api.js
export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("authChange"));
}
```

- `localStorage` överlever sid-omladdning (sessionen kvarstår)
- Alternativet är `sessionStorage` (rensas när fliken stängs)
- I produktionssystem används ofta `httpOnly cookies` istället (mer säkert mot XSS)

---

## 5. Skyddade routes i backend

### Middleware: `validateTokenHandler.js`

```javascript
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];       // "Bearer eyJ..." → "eyJ..."

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      req.user = decoded.user;              // { id, username, email }
      next();                               // Fortsätt till controllern
    });
  } else {
    res.status(401);
    throw new Error("Token is missing or malformed");
  }
});

module.exports = validateToken;
```

**Hur middleware kopplas på:**

```javascript
// contactRoutes.js – gäller ALLA routes i filen
router.use(validateToken);

// userRoutes.js – gäller bara specifika routes
router.route("/current").get(validateToken, currentUser);
// register och login är öppna (ingen middleware)
```

### Ägarskyddskontroll i controllern

Det räcker inte att vara inloggad – du ska bara kunna ändra **dina egna** kontakter:

```javascript
// contactController.js
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  // Kontrollera att inloggad användare äger kontakten
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User don't have permission to update other user contacts");
  }

  const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedContact);
});
```

**HTTP-statuskoder att känna till:**
| Kod | Betydelse | När |
|-----|-----------|-----|
| 200 | OK | Lyckad GET/PUT |
| 201 | Created | Lyckad POST |
| 400 | Bad Request | Saknat fält i body |
| 401 | Unauthorized | Token saknas eller ogiltig |
| 403 | Forbidden | Inloggad men inte ägare |
| 404 | Not Found | Resursen finns inte |
| 500 | Server Error | Oväntat fel i kod |

---

## 6. Skyddade routes i frontend

### `RequireAuth`-komponenten i `App.js`

```javascript
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./api";

function RequireAuth({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;   // Skicka till login om inte inloggad
  }
  return children;
}
```

### Router-konfigurationen

```javascript
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route
          path="/contacts"
          element={
            <RequireAuth>          {/* Skyddad – kräver inloggning */}
              <Contacts />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

**Vad som händer:**
- Användaren går till `/contacts` utan token → `isAuthenticated()` returnerar `false` → `<Navigate to="/" />` skickar tillbaka till login
- Användaren loggar in → token sparas i localStorage → `isAuthenticated()` returnerar `true` → `<Contacts />` renderas

### Synkronisera auth-state i realtid

```javascript
// App.js
const [authed, setAuthed] = useState(isAuthenticated());

useEffect(() => {
  const sync = () => setAuthed(isAuthenticated());
  window.addEventListener("authChange", sync);  // Lyssna på logout/login
  window.addEventListener("storage", sync);     // Synk mellan flikar
  return () => {
    window.removeEventListener("authChange", sync);
    window.removeEventListener("storage", sync);
  };
}, []);
```

---

## 7. API-lagret i frontend

`src/api.js` är ett **servicelager** som håller all HTTP-kommunikation på ett ställe. Sidan (Contacts.jsx, Login.jsx etc.) importerar funktioner härifrån istället för att skriva `fetch()` direkt i komponenterna.

### Fördelar med ett eget API-lager

- Byt ut backend-URL på ett enda ställe
- Token-logik skrivs en gång, fungerar för alla anrop
- Enklare att testa och felsöka
- Komplex felhantering hanteras centralt

### Komplett flöde för att skapa en kontakt

```javascript
// api.js
export async function createContact(data) {
  return request("/contacts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Contacts.jsx
async function handleCreate(e) {
  e.preventDefault();
  try {
    const newContact = await createContact({ name, email, phone });
    setContacts(prev => [newContact, ...prev]);  // Lägg till i listan utan reload
    setForm({ name: "", email: "", phone: "" });
  } catch (err) {
    setError(err.message);
  }
}
```

---

## 8. Dataflöde – Från knapptryck till databas

### Scenario: Användare skapar en ny kontakt

```
1. Användaren fyller i formuläret och klickar "Spara"

2. Contacts.jsx anropar handleCreate()
   └── Anropar api.createContact({ name, email, phone })

3. api.js skapar ett fetch-anrop:
   └── POST http://localhost:3000/api/contacts
       Headers: { Authorization: "Bearer eyJ..." }
       Body:    { "name": "Ali", "email": "ali@ex.com", "phone": "070..." }

4. Express tar emot anropet i server.js
   └── Matcher /api/contacts → skickar till contactRoutes.js

5. validateToken middleware körs
   └── Plockar ut "eyJ..." ur Authorization-headern
   └── jwt.verify() avkodar token → { id: "abc123", email: "user@ex.com" }
   └── Sätter req.user = { id: "abc123", email: "user@ex.com" }
   └── next() → fortsätt till controllern

6. createContacts() i contactController.js körs
   └── Validerar att name, email, phone finns
   └── Skapar: Contact.create({ ...req.body, user_id: req.user.id })
   └── MongoDB sparar dokumentet

7. Svaret skickas tillbaka
   └── res.status(201).json(newContact)
   └── JSON: { _id: "xyz", name: "Ali", email: "...", user_id: "abc123" }

8. api.js tar emot svaret och returnerar det till Contacts.jsx

9. Contacts.jsx uppdaterar state:
   └── setContacts(prev => [newContact, ...prev])
   └── React re-renderar → kontakten visas direkt i listan
```

---

## 9. Vanliga fel och hur du felsöker

### CORS-fel

```
Access to fetch at 'http://localhost:3000/api/contacts' from origin 'http://localhost:3001' 
has been blocked by CORS policy
```

**Lösning:** Lägg till cors-paketet i backend:

```bash
npm install cors
```

```javascript
// server.js
const cors = require("cors");
app.use(cors({ origin: "http://localhost:3001" }));
```

---

### 401 Unauthorized

**Orsak:** Token saknas, är felaktig, eller har gått ut (15 min i detta projekt).

**Felsök:**
1. Öppna DevTools → Application → Local Storage → kolla att `token` finns
2. Kolla att frontend skickar headern: DevTools → Network → klicka på anropet → Headers → `Authorization`
3. Logga ut och logga in igen för att få ny token

---

### 403 Forbidden

**Orsak:** Du är inloggad men försöker ändra/radera en kontakt du inte äger.

**Felsök:**
- Kontrollera att `contact.user_id` matchar `req.user.id` i controllern
- Kontrollera att du inte jämför ObjectId med string utan `.toString()`

---

### "Cannot POST /api/contacts" (404)

**Orsak:** Routen är inte definierad eller `server.js` laddar inte in routern.

**Felsök:**
```javascript
// Kontrollera att detta finns i server.js
app.use("/api/contacts", require("./routers/contactRoutes"));
```

---

### Token sparas inte / användaren loggas ut direkt

**Orsak:** `saveToken()` anropas inte, eller `isAuthenticated()` kollar fel nyckel.

**Felsök:**
```javascript
// Login.jsx – kontrollera att detta körs vid lyckad inloggning
const { accessToken } = await api.login({ email, password });
api.saveToken(accessToken);  // Spara token INNAN navigate
navigate("/contacts");
```

---

## 10. Checklista för att koppla ihop ett nytt projekt

Använd denna lista när du bygger ett nytt fullstack-projekt från grunden:

### Backend

- [ ] `.env` finns med `PORT`, `CONNECTION_STRING`, `ACCESS_TOKEN_SECRET`
- [ ] `server.js` laddar dotenv (`require("dotenv").config()`) längst upp
- [ ] MongoDB-anslutning testad (se loggar i terminalen)
- [ ] `express.json()` middleware tillagd (annars läser Express inte request body)
- [ ] CORS konfigurerat för frontend-porten
- [ ] Öppna routes (register, login) har **ingen** `validateToken`
- [ ] Skyddade routes har `validateToken` antingen med `router.use()` eller per route
- [ ] Ägarskyddskontroll i update/delete: `contact.user_id.toString() === req.user.id`
- [ ] Centraliserad felhanterare tillagd i `server.js` (efter alla routes)

### Frontend

- [ ] `API_BASE` i `api.js` pekar på rätt port/adress för backend
- [ ] `request()`-funktionen lägger till `Authorization: Bearer` header automatiskt
- [ ] Token sparas med `saveToken()` direkt efter lyckad inloggning
- [ ] `RequireAuth`-komponent omsluter alla sidor som kräver inloggning
- [ ] Router har öppna routes (`/login`, `/register`) och skyddade routes (`/contacts`)
- [ ] Logout anropar `logout()` som tar bort token **och** navigerar till login
- [ ] Fel från API fångas med `try/catch` och visas för användaren
- [ ] `useEffect` med tom beroende-array `[]` används för att hämta data vid sidladdning

### Testa att allt fungerar

- [ ] Registrera en ny användare
- [ ] Logga in och kontrollera att token syns i localStorage
- [ ] Hämta kontakter utan token → ska ge 401
- [ ] Skapa, uppdatera och radera kontakter
- [ ] Gå direkt till `/contacts` utan att logga in → ska redirecta till login
- [ ] Logga ut → token försvinner → kan inte nå `/contacts`

---

## Sammanfattning av de viktigaste koncepten

| Koncept | Backend | Frontend |
|---------|---------|----------|
| **Autentisering** | JWT signeras med `ACCESS_TOKEN_SECRET` | Token sparas i `localStorage` |
| **Skydd av routes** | `validateToken` middleware | `RequireAuth` wrapper-komponent |
| **Identifiera användare** | `req.user` sätts av middleware | Token skickas i varje anrop |
| **Ägarskydd** | Kontrollera `user_id === req.user.id` | Inte relevant (hanteras i backend) |
| **Felhantering** | Centraliserad `errorHandler.js` | `try/catch` runt API-anrop |
| **Data-isolering** | `Contact.find({ user_id: req.user.id })` | Visa bara det API returnerar |
