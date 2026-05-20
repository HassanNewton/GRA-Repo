# 🚀 Fullstack Integration Guide - Backend & Frontend med JWT Auth

> En komplett steg-för-steg guide för att förstå och bygga en säker React-applikation med JWT-autentisering och skyddade routes.

---

## 📋 Innehållsförteckning
1. [Arkitektur & Översikt](#arkitektur--översikt)
2. [Projekt Setup](#projekt-setup)
3. [Authentication Flow](#authentication-flow)
4. [Protected Routes](#protected-routes)
5. [API Integration](#api-integration)
6. [Backend Connection](#backend-connection)
7. [Säkerhet](#säkerhet)
8. [Felsökning](#felsökning)

---

## 🏗️ Arkitektur & Översikt

### Systemöversikt

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  - Login/Register komponenter                              │
│  - Contacts lista & CRUD-operationer                       │
│  - Protected routes                                        │
│  - State management (useState, useContext)                 │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP(S) + JWT Token
                             │ CORS (localhost:3000)
                             │
┌────────────────────────────▼────────────────────────────────┐
│                  BACKEND (Node + Express)                   │
│  - User auth (register/login)                              │
│  - JWT token generation                                    │
│  - Protected API routes                                    │
│  - Kontakt CRUD-operationer                               │
└────────────────────────────┬────────────────────────────────┘
                             │
                             │
┌────────────────────────────▼────────────────────────────────┐
│                   DATABASE (MongoDB)                        │
│  - Users kollektion                                        │
│  - Contacts kollektion                                     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
┌──────────────────────┐
│  User fyller formulär │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Frontend skickar HTTP request     │ (POST /api/users/login)
│ med email + password              │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Backend validerar lösenord        │
│ mot MongoDB                       │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Backend skapar JWT token         │
│ och skickar tillbaka             │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Frontend sparar token            │
│ i localStorage                   │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Frontend skickar token i          │
│ Authorization-header              │
│ vid nästa request                │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Backend verifierar token         │
│ och processar request            │
└──────────────────────────────────┘
```

---

## 🔧 Projekt Setup

### Steg 1: Installera Dependencies

```bash
# Frontend
cd contacts-frontend
npm install

# Kontrollera att dessa finns i package.json:
# - react-router-dom (för routing)
# - react (v19+)
# - react-dom (v19+)
```

**Varför dessa beroenden?**
- **react-router-dom**: Hanterar routing mellan Login/Register/Contacts
- **React**: UI-bibliotek

### Steg 2: Projektstruktur

```
contacts-frontend/
├── public/
│   └── index.html              # HTML entry-point
│
├── src/
│   ├── App.js                  # Main app + routing
│   ├── App.css                 # Styling
│   │
│   ├── api.js                  # 🔑 API-abstraction layer
│   │
│   ├── Login.jsx               # Login-komponent
│   ├── Register.jsx            # Register-komponent
│   ├── Contacts.jsx            # Contacts-komponent (protected)
│   │
│   ├── index.js                # React entry-point
│   └── index.css               # Global styling
│
└── package.json                # Dependencies
```

**Varför denna struktur?**
- `api.js`: **Centraliserar** all kommunikation med backend
- Komponenter är fokuserade på UI
- Lätt att underhålla och testa

### Steg 3: Starta Frontend

```bash
npm start
```

Frontend öppnas på: **http://localhost:3000**

> ⚠️ **OBS**: Se till att backend körs på **http://localhost:3000** (eller justera `API_BASE` i `api.js`)

---

## 🔐 Authentication Flow

### Vad är JWT?

**JWT = JSON Web Token**

Ett Token är ett "identifieringsbevis" som backend ger till frontend när användaren loggar in.

**Struktur:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Tre delar:**
1. **Header**: Vilken algoritm som användes
2. **Payload**: Data (user ID, email, osv)
3. **Signature**: Signatur som backend verifierar

**Varför JWT?**
- ✅ Stateless (backend behöver inte lagra sessions)
- ✅ Säkert (kan inte förfalskas utan hemlig nyckel)
- ✅ Kan skickas i HTTP-headers

### Steg-för-steg: Login Flow

#### **Steg 1: Användaren submittar formulär**

```javascript
// Login.jsx
async function handleSubmit(e) {
  e.preventDefault();  // Förhindrar page refresh
  
  try {
    // Skickar email + password till backend
    const data = await api.login({
      email: "user@example.com",
      password: "password123"
    });
    
    // Backend returnerar: { token: "eyJhbGciOi..." }
    
  } catch (err) {
    setError(err.message);  // Visar fel
  }
}
```

#### **Steg 2: API-lagret skickar HTTP-request**

```javascript
// api.js
export async function login({ email, password }) {
  return request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}
```

**HTTP-request som skickas:**
```
POST http://localhost:3000/api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### **Steg 3: Backend processerar login**

```javascript
// Backend: users.js (router)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  // Söker upp användare i MongoDB
  const user = await User.findOne({ email });
  
  // Kontrollerar lösenord
  if (!user || !user.comparePassword(password)) {
    return res.status(401).json({ message: "Felaktig email/lösenord" });
  }
  
  // Skapar JWT token (giltig i 24h)
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  
  // Skickar tillbaka token
  res.json({ token });
});
```

#### **Steg 4: Frontend sparar token**

```javascript
// api.js
export function saveToken(token) {
  localStorage.setItem("token", token);
  window.dispatchEvent(new Event("authChange"));  // Notifiera App.js
}

// Login.jsx
if (data.token) {
  saveToken(data.token);
  navigate("/contacts");  // Navigera till contacts
}
```

**localStorage:**
```javascript
// localStorage är persistent browser-storage
localStorage.getItem("token");    // Hämtar token
localStorage.setItem("token", "eyJ...");  // Sparar token
localStorage.removeItem("token"); // Tar bort token
```

### Steg-för-steg: Token Usage

#### **Steg 1: Frontend skickar token i nästa request**

```javascript
// Alla requests från api.js lägger automatiskt till token:
async function request(path, options = {}) {
  const headers = options.headers || {};
  const token = getToken();
  
  // Lägger till Authorization-header
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  // Skickar request med token
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });
  
  // ...
}
```

**HTTP-request med token:**
```
GET http://localhost:3000/api/contacts
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

#### **Steg 2: Backend verifierar token**

```javascript
// Backend: middleware/authMiddleware.js
function authenticateToken(req, res, next) {
  // Hämtar Authorization-header
  const authHeader = req.headers["authorization"];
  
  // Extraherar token (format: "Bearer TOKEN")
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Token saknas" });
  }
  
  try {
    // Verifierar token med hemlig nyckel
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Sparar user info på request-objektet
    req.user = decoded;
    next();  // Tillåt request att fortsätta
    
  } catch (err) {
    return res.status(403).json({ message: "Ogiltig token" });
  }
}

// Använd middleware på protected routes
router.get("/contacts", authenticateToken, async (req, res) => {
  // Här kan vi använda req.user.id
  const contacts = await Contact.find({ userId: req.user.id });
  res.json(contacts);
});
```

#### **Steg 3: Backend skickar data tillbaka**

```javascript
// Svar från backend:
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0701234567",
  "userId": "507f1f77bcf86cd799439010"
}
```

### Logout

```javascript
// api.js
export function logout() {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("authChange"));  // Notifiera App.js
}

// Contacts.jsx eller App.jsx
<button onClick={() => {
  logout();
  navigate("/");
}}>
  Logout
</button>
```

---

## 🛡️ Protected Routes

### Vad är Protected Routes?

Protected routes är sidor som **bara kan besökas av inloggade användare**.

Exempel:
- ✅ `/` (Login) - **Public** - alla kan besöka
- ✅ `/register` (Register) - **Public** - alla kan besöka
- 🔒 `/contacts` (Contacts) - **Protected** - bara inloggade kan besöka

### Implementation i React

#### **Steg 1: Skapa RequireAuth-wrapper**

```javascript
// App.js
function RequireAuth({ children }) {
  // Kontrollerar om användaren är inloggad
  if (!isAuthenticated()) {
    // Redirectar till login
    return <Navigate to="/" replace />;
  }
  
  // Om inloggad: rendera komponenten
  return children;
}
```

#### **Steg 2: Använd RequireAuth runt protected routes**

```javascript
// App.js
<Routes>
  {/* Public routes */}
  <Route path="/" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  {/* Protected route */}
  <Route
    path="/contacts"
    element={
      <RequireAuth>
        <Contacts />
      </RequireAuth>
    }
  />
</Routes>
```

#### **Steg 3: Uppdatera Navigation baserat på auth-state**

```javascript
// App.js
const [authed, setAuthed] = useState(isAuthenticated());

useEffect(() => {
  // Lyssnar på auth-ändringar
  function onAuthChange() {
    setAuthed(isAuthenticated());
  }
  
  window.addEventListener("authChange", onAuthChange);
  return () => window.removeEventListener("authChange", onAuthChange);
}, []);

return (
  <nav>
    <Link to="/">Login</Link>
    <Link to="/register">Register</Link>
    
    {/* Visa Contacts-länk bara om inloggad */}
    {authed && <Link to="/contacts">Contacts</Link>}
    
    {/* Visa Logout-knapp bara om inloggad */}
    {authed && <button onClick={logout}>Logout</button>}
  </nav>
);
```

### Flöde: Försök besöka `/contacts` utan att vara inloggad

```
1. Användare försöker gå till /contacts
           ↓
2. RequireAuth-komponenten körs
           ↓
3. isAuthenticated() kontrolleras
           ↓
4. Ingen token → returnera <Navigate to="/" />
           ↓
5. Användaren redirectas till /
```

### Flöde: Besök `/contacts` med giltigt token

```
1. Användare loggar in → token sparas
           ↓
2. Användare navigerar till /contacts
           ↓
3. RequireAuth-komponenten körs
           ↓
4. isAuthenticated() returnerar true
           ↓
5. <Contacts /> rendereras
```

---

## 📡 API Integration

### Arkitektur: API-abstraktionslager

Tanken är att **alla API-requests går genom en central plats** (`api.js`). Det gör det enkelt att:
- Lägga till token automatiskt
- Hantera errors på ett ställe
- Ändra API-URL utan att uppdatera alla komponenter

```
Komponenter         API-lagret          Backend
   │                   │                   │
   ├─ Login.jsx       │                   │
   │  login()    →    request() ────→   POST /login
   │                   │                   │
   ├─ Contacts.jsx    │                   │
   │  getContacts() → request() ────→   GET /contacts
   │  createContact()→ request() ────→   POST /contacts
   │  deleteContact()→ request() ────→   DELETE /contacts/:id
   │                   │                   │
   └─ Register.jsx    │                   │
      register()  →   request() ────→   POST /register
```

### Generell request-funktion

```javascript
// api.js

// Bas-URL till backend
const API_BASE = "http://localhost:3000/api";

// Hämtar token från localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Generell funktion för alla HTTP-requests
async function request(path, options = {}) {
  // Setup headers
  const headers = options.headers || {};
  const token = getToken();
  
  // Lägg till Authorization-header om token finns
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  // Säg till backend att vi skickar JSON
  headers["Content-Type"] = "application/json";
  
  // Skicka HTTP-request
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });
  
  // Läs respons som JSON (eller text)
  const text = await res.text();
  let data = null;
  
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  
  // Kontrollera om request misslyckades
  if (!res.ok) {
    const err = (data && data.message) || res.statusText || "Request failed";
    throw new Error(err);
  }
  
  // Returnera data
  return data;
}
```

### Specifika API-funktioner

#### **Login**

```javascript
// api.js
export async function login({ email, password }) {
  return request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

// Användning i Login.jsx:
const data = await api.login({
  email: "user@example.com",
  password: "password123"
});

// Response från backend:
// { token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

#### **Register**

```javascript
// api.js
export async function register({ name, email, password }) {
  return request("/users/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password })
  });
}

// Användning i Register.jsx:
const data = await api.register({
  name: "John Doe",
  email: "john@example.com",
  password: "password123"
});

// Response från backend:
// { message: "User created", token: "..." } eller bara { message: "..." }
```

#### **Get Contacts**

```javascript
// api.js
export async function getContacts() {
  // GET request, automatiskt med token i header
  return request("/contacts", {
    method: "GET"
  });
}

// Användning i Contacts.jsx:
const contacts = await api.getContacts();

// Response från backend:
// [
//   {
//     "_id": "507f1f77bcf86cd799439011",
//     "name": "John Doe",
//     "email": "john@example.com",
//     "phone": "0701234567"
//   },
//   { ... }
// ]
```

#### **Create Contact**

```javascript
// api.js
export async function createContact({ name, email, phone }) {
  return request("/contacts", {
    method: "POST",
    body: JSON.stringify({ name, email, phone })
  });
}

// Användning i Contacts.jsx:
const newContact = await api.createContact({
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "0709876543"
});

// Response från backend:
// {
//   "_id": "507f1f77bcf86cd799439012",
//   "name": "Jane Doe",
//   "email": "jane@example.com",
//   "phone": "0709876543"
// }
```

#### **Update Contact**

```javascript
// api.js
export async function updateContact(id, { name, email, phone }) {
  return request(`/contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, email, phone })
  });
}

// Användning i Contacts.jsx:
const updated = await api.updateContact(contactId, {
  name: "Updated Name",
  email: "updated@example.com",
  phone: "0700000000"
});
```

#### **Delete Contact**

```javascript
// api.js
export async function deleteContact(id) {
  return request(`/contacts/${id}`, {
    method: "DELETE"
  });
}

// Användning i Contacts.jsx:
await api.deleteContact(contactId);
```

### HTTP-metoder

| Metod | Användning | Exempel |
|-------|-----------|---------|
| **GET** | Hämta data | `GET /api/contacts` → alla kontakter |
| **POST** | Skapa ny data | `POST /api/contacts` → skapa ny kontakt |
| **PUT** | Uppdatera data | `PUT /api/contacts/123` → uppdatera kontakt 123 |
| **DELETE** | Ta bort data | `DELETE /api/contacts/123` → ta bort kontakt 123 |

### Error Handling

```javascript
// api.js skickar error automatiskt:
if (!res.ok) {
  const err = (data && data.message) || res.statusText || "Request failed";
  throw new Error(err);
}

// I komponenter:
try {
  const contacts = await api.getContacts();
  setContacts(contacts);
} catch (err) {
  // err.message innehåller felmeddelandet från backend
  setError(err.message);  // "Token invalid", "User not found", osv
}
```

---

## 🔌 Backend Connection

### CORS Setup

**Problem:** Frontend och backend körs på olika portar.
```
Frontend: http://localhost:3000
Backend:  http://localhost:3000
```

Browser blockerar detta av säkerhetsskäl.

**Lösning:** Backend måste tillåta frontend att göra requests.

#### Backend: server.js

```javascript
const express = require("express");
const cors = require("cors");

const app = express();

// Tillåt frontend att ansluta
app.use(cors({
  origin: "http://localhost:3000",  // Din frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true  // Tillåt cookies/auth-headers
}));

// Andra middleware
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/contacts", require("./routes/contacts"));

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});
```

> ⚠️ **Produktion:** Använd miljövariabler för frontend-URL:
> ```javascript
> origin: process.env.FRONTEND_URL
> ```

### Environment Setup

#### Frontend: Konfiguration

I **`api.js`**, justera `API_BASE` baserat på miljö:

```javascript
// api.js

// Development
const API_BASE = "http://localhost:3000/api";

// eller använd process.env:
// const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000/api";
```

`.env` fil (Create React App):
```
REACT_APP_API_URL=http://localhost:3000/api
```

I `api.js`:
```javascript
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000/api";
```

### API-endpoints som Backend måste tillhandahålla

**Frontend förväntar sig dessa endpoints:**

```
POST   /api/users/register     { name, email, password }
POST   /api/users/login        { email, password }
GET    /api/contacts           (skyddad)
POST   /api/contacts           { name, email, phone } (skyddad)
PUT    /api/contacts/:id       { name, email, phone } (skyddad)
DELETE /api/contacts/:id       (skyddad)
```

**Responses:**

```javascript
// Register
{ message: "User created", token: "..." }

// Login
{ token: "eyJhbGciOi..." }

// Get Contacts
[
  { _id: "...", name: "...", email: "...", phone: "..." },
  { ... }
]

// Create Contact
{ _id: "...", name: "...", email: "...", phone: "..." }

// Update Contact
{ _id: "...", name: "...", email: "...", phone: "..." }

// Delete Contact
{ message: "Contact deleted" }
```

---

## 🔒 Säkerhet

### Viktiga säkerhetsprinciper

#### **1. Frontend är INTE säkerhet**

Frontend kan:
- ✅ Gömma knappar
- ✅ Visa/dölja sidor
- ✅ Validera input

Men frontend kan **INTE**:
- ❌ Skydda hemliga nycklar
- ❌ Hindra manipulering
- ❌ Garantera säkerhet

**Användare kan:**
```bash
# Öppna DevTools och läsa localStorage
localStorage.getItem("token")

# Använda Postman och göra requests utan frontend
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/api/contacts

# Manipulera requests
// Fake ett token och skicka det
```

**Slutsats:** ALL säkerhet måste finnas i backend.

#### **2. Backend måste validera ALLT**

```javascript
// ❌ DÅLIGT: Lita på frontend
router.post("/contacts", (req, res) => {
  // Antar att token är giltig och user_id stämmer
  const contact = new Contact(req.body);
  contact.save();
});

// ✅ BÄST: Validera och verifiera i backend
router.post("/contacts", authenticateToken, (req, res) => {
  // 1. Verifiera token (middleware gör detta)
  // 2. Validera input
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({ message: "Missing fields" });
  }
  
  // 3. Använd user ID från token, INTE från request
  const contact = new Contact({
    userId: req.user.id,  // Från JWT
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  });
  
  contact.save();
  res.json(contact);
});
```

#### **3. Lagra lösenord säkert**

```javascript
// ❌ DÅLIGT: Lagra lösenord i klartext
const user = new User({
  email: "user@example.com",
  password: "password123"  // NÄ!
});

// ✅ BÄST: Hash lösenord
const bcrypt = require("bcrypt");

const user = new User({
  email: "user@example.com",
  password: await bcrypt.hash("password123", 10)  // Hashat
});

// Vid login:
const isValid = await bcrypt.compare(inputPassword, user.password);
```

#### **4. JWT Secret måste hållas hemlig**

```javascript
// ❌ DÅLIGT: Secret i koden
const token = jwt.sign(data, "my-secret", { expiresIn: "24h" });

// ✅ BÄST: Secret i environment variable
const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "24h" });
```

`.env` fil (backend):
```
JWT_SECRET=abc123xyz789verylongandrandomstring
DATABASE_URL=mongodb://...
FRONTEND_URL=http://localhost:3000
```

#### **5. Använd HTTPS i produktion**

```javascript
// ❌ Development
app.use(cors({ origin: "http://localhost:3000" }));

// ✅ Produktion
app.use(cors({ origin: "https://example.com" }));

// Tvinga HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  }
  next();
});
```

#### **6. Token Expiration**

```javascript
// ✅ BÄST: Token har en utgångsdatum
const token = jwt.sign(
  { id: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "24h" }  // Token är bara giltig 24 timmar
);

// Efter 24h måste användaren logga in igen
```

#### **7. Logout - Ta bort token**

```javascript
// Frontend
export function logout() {
  localStorage.removeItem("token");  // ← Token är borta
  window.dispatchEvent(new Event("authChange"));
}

// Nu kan användaren inte göra autentiserade requests
```

#### **8. HTTPS-only Cookies (för cookie-baserad auth)**

Om du använder cookies istället för localStorage:

```javascript
// Backend: Sätt HttpOnly flag
res.cookie("token", token, {
  httpOnly: true,    // JavaScript kan INTE läsa denna cookie
  secure: true,      // Bara HTTPS
  sameSite: "Strict" // CSRF-skydd
});
```

### Säkerhetschecklista

- [ ] Backend validerar alla inputs
- [ ] Lösenord är hashade (bcrypt)
- [ ] JWT Secret är i .env-fil
- [ ] Token har expiration date
- [ ] Protected routes har `authenticateToken`-middleware
- [ ] CORS är konfigurerat för rätt domain
- [ ] HTTPS i produktion
- [ ] Sensitive data loggas INTE

---

## 🐛 Felsökning

### Problem: "CORS error: Access-Control-Allow-Origin missing"

**Orsak:** Backend CORS är inte konfigurerat.

**Lösning:**
```javascript
// Backend: server.js
const cors = require("cors");
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
```

**Kontrollera:**
```bash
# Är backend igång?
curl http://localhost:3000

# Svarar backend?
curl -H "Origin: http://localhost:3000" http://localhost:3000/api/users/login
```

---

### Problem: "Token invalid / 401 Unauthorized"

**Orsak:** Token saknas eller är ogiltig.

**Debugging:**
```javascript
// Frontend: Kontrollera token i localStorage
console.log(localStorage.getItem("token"));

// Är token skickat i header?
// Öppna DevTools → Network → Request headers
// Authorization: Bearer eyJ...
```

**Lösning:**
```javascript
// Sätt breakpoint i api.js request-funktion
function request(path, options = {}) {
  const token = getToken();
  console.log("Token:", token);  // ← Debug
  console.log("Path:", path);
  console.log("Options:", options);
  
  // ...
}
```

---

### Problem: "User not found / Invalid credentials"

**Orsak:** Email eller lösenord är fel.

**Debugging:**
```javascript
// Login.jsx
async function handleSubmit(e) {
  e.preventDefault();
  
  console.log("Email:", email);
  console.log("Password:", password);
  
  try {
    const data = await api.login({ email, password });
    console.log("Response:", data);
  } catch (err) {
    console.log("Error:", err.message);
    setError(err.message);
  }
}
```

**Kontrollera:**
- Är email/lösenord korrekt?
- Är användaren registrerad i databasen?
- Backend-logs - vad säger de?

---

### Problem: "Protected route redirects to login"

**Orsak:** Token finns inte eller är ogiltig.

**Debugging:**
```javascript
// App.js
function RequireAuth({ children }) {
  const authed = isAuthenticated();
  console.log("Is authenticated:", authed);
  console.log("Token:", localStorage.getItem("token"));
  
  if (!authed) return <Navigate to="/" replace />;
  return children;
}
```

**Kontrollera:**
- Är token sparad efter login?
- Är token fortfarande giltig?
- Stäl ej in token genom localStorage innan login?

---

### Problem: "LocalStorage null vid page refresh"

**Orsak:** Normal - localStorage behålls vid refresh.

**Debugging:**
```javascript
// App.js - useEffect
useEffect(() => {
  console.log("App mounted");
  console.log("Token:", localStorage.getItem("token"));
  
  // Om token finns, är användaren redan inloggad
  const authed = isAuthenticated();
  setAuthed(authed);
}, []);
```

---

### Problem: "Contacts inte laddas"

**Orsak:** Token skickas inte eller request misslyckas.

**Debugging:**
```javascript
// Contacts.jsx
useEffect(() => {
  setLoading(true);
  
  api.getContacts()
    .then(data => {
      console.log("Contacts loaded:", data);
      setContacts(data || []);
      setLoading(false);
    })
    .catch(err => {
      console.error("Error loading contacts:", err);
      setError(err.message);
      setLoading(false);
    });
}, []);
```

**Kontrollera:**
- Network tab i DevTools - request-headers
- Backend logs - är request mottaget?
- Status code - 200 eller error?

---

### Debugging Tips

#### **1. DevTools Network Tab**

```
1. Öppna DevTools (F12)
2. Gå till Network-tabben
3. Utför en action (login, fetch contacts)
4. Se requests och responses
```

**Kontrollera:**
- Request URL korrekt?
- Method korrekt (GET/POST/DELETE)?
- Headers innehåller Authorization?
- Status code OK (200/201)?
- Response format korrekt?

#### **2. Console Logging**

```javascript
// api.js
async function request(path, options = {}) {
  console.log(`[API] ${options.method || "GET"} ${path}`);
  console.log("[API] Token:", getToken());
  
  // ...
  
  console.log("[API] Response:", data);
}
```

#### **3. Backend Logging**

```javascript
// Backend: users.js
router.post("/login", async (req, res) => {
  console.log("[AUTH] Login attempt:", req.body.email);
  
  const user = await User.findOne({ email: req.body.email });
  console.log("[AUTH] User found:", !!user);
  
  if (!user || !user.comparePassword(req.body.password)) {
    console.log("[AUTH] Login failed: Invalid credentials");
    return res.status(401).json({ message: "Invalid credentials" });
  }
  
  console.log("[AUTH] Login successful, generating token");
  // ...
});
```

#### **4. Postman Testing**

```
1. Öppna Postman
2. POST http://localhost:3000/api/users/login
3. Body (JSON):
   {
     "email": "user@example.com",
     "password": "password123"
   }
4. Se response
```

Kopiera token från response och testa GET /api/contacts:
```
GET http://localhost:3000/api/contacts
Headers:
  Authorization: Bearer TOKEN_HÄR
```

---

## 📚 Sammanfattning

### Steg-för-steg process för full integration:

**1. Backend Setup**
- Express server med CORS
- JWT middleware för protected routes
- User model med password hashing
- Contact model med userId-referens
- API routes för register/login/CRUD

**2. Frontend Setup**
- React app med react-router-dom
- API-abstraktionslager (api.js)
- Login & Register komponenter
- Protected Routes wrapper
- State management för auth

**3. Authentication Flow**
1. Användare registrerar sig
2. Användare loggar in
3. Backend skapar JWT token
4. Frontend sparar token i localStorage
5. Frontend skickar token i Authorization-header
6. Backend verifierar token på protected routes

**4. Säkerhet**
- Alla endpoints (förutom login/register) är skyddade
- Backend validerar token innan data skickas
- Lösenord är hashade
- Frontend kan ej manipulera säkerhet

---

## 🎓 Vidare läsning

- [JWT.io - Officiell JWT-webbplats](https://jwt.io)
- [MDN Web Docs - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [React Router - Protected Routes](https://reactrouter.com/docs/)
- [Express.js - Middleware](https://expressjs.com/en/guide/using-middleware.html)
- [MongoDB - Best Practices](https://docs.mongodb.com/manual/administration/security/)

---

**Uppdaterad:** 20 maj 2026
**För:** Fullstack-Contact projektet
