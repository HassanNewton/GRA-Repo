# Frontend - Ansluta till Backend med JWT & CORS
## Enkelt, pedagogiskt & progressivt

---

## 🎯 Vad vi bygger denna gång
Frontend (HTML + JavaScript) som:
1. **Registrerar** användare
2. **Loggar in** och får JWT-token
3. **Sparar token** lokalt
4. **Hämtar data** från skyddat backend med token
5. **Skapar, uppdaterar, tar bort** kontakter

---

# 📚 GENOMGÅNG: Den stora bilden

## Hur en fullstack app fungerar

```
Frontend (Browser/React)
    ↓
User klickar knappar / fyller formulär
    ↓
Frontend skickar HTTP requests
    ↓
Backend API (Node + Express)
    ↓
Backend verifierar auth + logik
    ↓
MongoDB
    ↓
Backend skickar response
    ↓
Frontend uppdaterar UI
```

## Ansvarsområden

| Frontend | Backend |
|----------|---------|
| UI | Auth |
| Formulär | Säkerhet |
| Knappar | Databas |
| State | Validering |
| Visa data | API routes |
| Skicka requests | Business logic |

## 🧠 Viktigt tankesätt

**Frontend är INTE säkerhet.**

Frontend kan:
- Gömma knappar
- Visa olika sidor
- Blockera UI

Men users kan fortfarande:
- Manipulera requests
- Använda Postman
- Skicka egna requests

**Därför: ALL riktig säkerhet måste finnas i backend.**

---

# 📚 GENOMGÅNG: CORS - Cross-Origin Resource Sharing

## Problemet

Frontend och backend körs på olika portar:

```
Frontend: http://localhost:8000
Backend:  http://localhost:3000
```

Webbläsaren ser detta som:

```
Olika origins = potentiell säkerhetsrisk
```

Därför blockeras requests automatiskt.

## Lösningen

Vi säger till backend: "Tillåt frontend att prata med backend"

## 🧠 Vad är CORS?

CORS = **Browser security**, inte backend-security.

Backend kan fortfarande nås av:
- Postman
- andra clients
- scripts

Därför behövs fortfarande:
- JWT
- Auth middleware
- Route protection

---

## 🛠️ CORS i Praktiken: Backend Setup
### Steg 1: Installera CORS-paket
```bash
npm install cors
```

### Steg 2: Uppdatera server.js
```javascript
const express = require("express");
const cors = require("cors");  // ← NY
const dotenv = require("dotenv").config();
const connectDB = require("./dbConnection");
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();

// ← LÄGG DETTA FÖRE ROUTES
app.use(cors({
  origin: "http://localhost:8000",  // Frontend URL
  credentials: true  // Tillåt cookies/headers
}));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/contacts", contactRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

### 🧠 Vad detta betyder

```javascript
origin: "http://localhost:8000"
```
= denna frontend får access.

**Viktigt:** CORS är bara browsersäkerhet. Backend kan fortfarande nås via Postman eller andra clients. Därför behövs JWT + auth middleware!

---

# 📚 GENOMGÅNG: JWT - JSON Web Token

## Vad är JWT?

JWT = **Ett digitalt login-bevis.**

När user loggar in:

```
1. Backend verifierar email/lösenord
    ↓
2. Backend skapar token
    ↓
3. Frontend sparar token
    ↓
4. Frontend skickar token i framtida requests
```

## 🧠 Viktigaste förståelsen

JWT betyder INTE: "Ge tillgång till allt"

JWT betyder: **"Backend vet vem du är"**

Backend måste fortfarande:
- Verifiera token
- Kontrollera ownership
- Kontrollera permissions

## Login Flow

```
1. User loggar in
    ↓
2. Frontend skickar:
   POST /login { email, password }
    ↓
3. Backend verifierar lösenord
    ↓
4. Backend skapar JWT token
    ↓
5. Token skickas tillbaka
    ↓
6. Frontend sparar token (localStorage)
    ↓
7. Frontend använder token i framtida requests
    ↓
8. Backend verifierar token + vet vilken user
```

## Exempel på login request

```javascript
const response = await fetch("http://localhost:3000/api/users/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email,
    password
  })
});

// Backend response:
{
  token: "eyJhbGc..."
}
```

---

# 📚 GENOMGÅNG: localStorage & Token Sparning

## Varför behövs localStorage?

Om vi bara sparar token i en vanlig variabel:

```javascript
let token = "...";  // Försvinner när sidan laddas om!
```

## ✅ Lösningen

```javascript
localStorage.setItem("token", data.token);
```

Nu sparas token i webbläsaren mellan refreshes.

## Hämta token senare

```javascript
const token = localStorage.getItem("token");
```

## Logout - ta bort token

```javascript
localStorage.removeItem("token");
```

## 🧠 Viktigt att förstå

localStorage:
- Ligger i webbläsaren
- Försvinner inte vid refresh
- Används ofta för JWT i enklare projekt
- **Viktigt:** Sparas i klartext - inte så säkert för känslig data

---

# 📚 GENOMGÅNG: Authorization Header

## Vad är Authorization Header?

När frontend gör skyddade requests skickas token här:

```http
Authorization: Bearer eyJhbGc...
```

## 🧠 Vad betyder Bearer?

```
"Här är mitt login-bevis"
```

## Exempel – skyddad request

```javascript
const token = localStorage.getItem("token");

const response = await fetch("http://localhost:3000/api/contacts", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
```

**Key point:** Token skickas i headers, INTE i body.

---

# 📚 GENOMGÅNG: Public vs Protected Routes

## Public Routes (ingen auth behövs)

```
POST /register
POST /login
```

**Varför?** User är inte inloggad ännu.

## Protected Routes (token behövs)

```
GET /contacts
POST /contacts
PUT /contacts/:id
DELETE /contacts/:id
```

**Varför?** Backend måste veta **VEM** som gör requesten.

---

# 📚 GENOMGÅNG: validateToken Middleware

## Vad gör middleware?

Middleware körs **MELLAN request och controller**.

```
Frontend request
    ↓
validateToken middleware ← körs här!
    ↓
Controller
    ↓
Database
```

## validateToken ansvarar för:

1. Läsa token från Authorization header
2. Verifiera token är giltigt
3. Hitta user från token
4. Sätta req.user
5. Blockera ogiltiga tokens

## Exempel på flow

```javascript
// 1. Läs header
const authHeader = req.headers.authorization;
// "Bearer eyJhbGc..."

// 2. Extrahera token
const token = authHeader.split(" ")[1];
// "eyJhbGc..."

// 3. Verifiera token
const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
// { user: { id: "...", email: "..." } }

// 4. Sätt req.user
req.user = decoded.user;

// 5. Nästa middleware/controller kan nu använda:
console.log(req.user.id);  // MongoDB user ID
```

## 🧠 Viktigt efter middleware

Efter middleware kan controller använda:

```javascript
req.user.id
```

för att:
- Hämta user-specifik data
- Skydda routes
- Kontrollera ownership

---

# 📚 GENOMGÅNG: API Service Wrapper - Varför?

## Problemet utan api.js

```javascript
fetch(...)
fetch(...)
fetch(...)
fetch(...)
```

överallt i koden.

**Problem:**
- Duplicerad kod
- Svårt att underhålla
- Svårt att lägga till token
- Svårt att ändra API URL

## ✅ Lösningen med api.js

Alla requests samlas på ett ställe.

**Fördelar:**
- Renare kod
- Återanvändbar logik
- Enklare debugging
- Enklare scaling

## Grundidé

```javascript
const API_BASE = "http://localhost:3000/api";

const getToken = () => {
  return localStorage.getItem("token");
};

export const login = async (email, password) => {
  // logik här
};

export const createContact = async (name, email, phone) => {
  // logik här
};
```

Nu kan andra filer bara göra:

```javascript
import { login, createContact } from "./api.js";
```

---

## 📁 Frontend struktur

```
frontend/
├── index.html        (login form)
├── contacts.html     (contacts page)
├── css/
│   └── style.css     (styling)
└── js/
    ├── auth.js       (register, login)
    ├── api.js        (fetch calls)
    └── contacts.js   (CRUD operations)
```

---

# ✍️ API SERVICE WRAPPER - Praktiken

```javascript
// js/api.js

const API_BASE = "http://localhost:3000/api";

// Hämta token från localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// REGISTER - POST request, ingen token behövs
export const register = async (name, email, password) => {
  const response = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return await response.json();
};

// LOGIN - POST request, ingen token behövs
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  const data = await response.json();
  // Spara token när login lyckas
  localStorage.setItem("token", data.token);
  return data;
};

// GET CONTACTS - GET request, BEHÖVER token
export const getContacts = async () => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE}/contacts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,  // ← TOKEN GÅR HÄR
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get contacts");
  }

  return await response.json();
};

// CREATE CONTACT - POST request, BEHÖVER token
export const createContact = async (name, email, phone) => {
  const token = getToken();

  const response = await fetch(`${API_BASE}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,  // ← TOKEN GÅR HÄR
    },
    body: JSON.stringify({ name, email, phone }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create contact");
  }

  return await response.json();
};

// UPDATE CONTACT - PUT request, BEHÖVER token
export const updateContact = async (id, name, email, phone) => {
  const token = getToken();

  const response = await fetch(`${API_BASE}/contacts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,  // ← TOKEN GÅR HÄR
    },
    body: JSON.stringify({ name, email, phone }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update contact");
  }

  return await response.json();
};

// DELETE CONTACT - DELETE request, BEHÖVER token
export const deleteContact = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_BASE}/contacts/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,  // ← TOKEN GÅR HÄR
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete contact");
  }

  return await response.json();
};
```

**Key Points:**
- `getToken()` hämtar token från localStorage
- `Authorization: Bearer {token}` = standard sätt att skicka JWT
- Varje skyddad route får token i header

---

# 📚 GENOMGÅNG: Login/Register Form - Vad händer?

## Vad är en form?

En form samlar input från user:
- Email
- Lösenord
- Namn

## Flöde när user loggar in

```
1. User fyller email + lösenord
    ↓
2. User klicker "Logga in"
    ↓
3. JavaScript function körs
    ↓
4. api.login() anropas
    ↓
5. Frontend skickar POST /login med email/lösenord
    ↓
6. Backend verifierar lösenord
    ↓
7. Backend skickar token
    ↓
8. Frontend sparar token i localStorage
    ↓
9. Frontend visar kontakt-sida
```

## 🧠 Key punkt: Form inputs

```html
<input type="email" id="loginEmail" placeholder="Email">
<input type="password" id="loginPassword" placeholder="Lösenord">
<button onclick="handleLogin()">Logga in</button>
```

I JavaScript hämtar vi värdena:

```javascript
const email = document.getElementById("loginEmail").value;
const password = document.getElementById("loginPassword").value;
```

---

# ✍️ LOGIN/REGISTER - Praktiken (index.html + js/auth.js)
```html
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Auth App</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <!-- REGISTER FORM -->
    <div id="registerForm" class="form-section">
      <h2>Registrera</h2>
      <input 
        type="text" 
        id="regName" 
        placeholder="Namn" 
        required
      >
      <input 
        type="email" 
        id="regEmail" 
        placeholder="Email" 
        required
      >
      <input 
        type="password" 
        id="regPassword" 
        placeholder="Lösenord" 
        required
      >
      <button onclick="handleRegister()">Registrera</button>
      <p id="registerError" class="error"></p>
    </div>

    <!-- LOGIN FORM -->
    <div id="loginForm" class="form-section">
      <h2>Logga in</h2>
      <input 
        type="email" 
        id="loginEmail" 
        placeholder="Email" 
        required
      >
      <input 
        type="password" 
        id="loginPassword" 
        placeholder="Lösenord" 
        required
      >
      <button onclick="handleLogin()">Logga in</button>
      <p id="loginError" class="error"></p>
    </div>

    <!-- SKYDDAD SECTION - VISAS KUN OM INLOGGAD -->
    <div id="contactsSection" style="display: none;">
      <h2>Mina Kontakter</h2>
      <button onclick="handleLogout()">Logga ut</button>
      <div id="contactsList"></div>
    </div>
  </div>

  <script type="module" src="js/auth.js"></script>
</body>
</html>
```

### js/auth.js
```javascript
// js/auth.js
import { register, login, getContacts } from "./api.js";

// Kontrollera om user redan inloggad
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (token) {
    showContactsPage();
  } else {
    showLoginPage();
  }
});

// REGISTER - visa inputfält
async function handleRegister() {
  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const errorDiv = document.getElementById("registerError");

  try {
    const result = await register(name, email, password);
    errorDiv.textContent = "✅ Registrering lyckad! Logga in nu.";
    
    // Rensa formulär
    document.getElementById("regName").value = "";
    document.getElementById("regEmail").value = "";
    document.getElementById("regPassword").value = "";
  } catch (error) {
    errorDiv.textContent = `❌ ${error.message}`;
  }
}

// LOGIN - verifiera lösenord och få token
async function handleLogin() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const errorDiv = document.getElementById("loginError");

  try {
    const result = await login(email, password);
    
    // Token sparad automatiskt i api.js
    errorDiv.textContent = "✅ Inloggning lyckad!";
    
    // Vänta 1 sekund sen visa contacts page
    setTimeout(() => {
      showContactsPage();
    }, 1000);
  } catch (error) {
    errorDiv.textContent = `❌ ${error.message}`;
  }
}

// LOGOUT - ta bort token och gå tillbaka
function handleLogout() {
  localStorage.removeItem("token");
  showLoginPage();
}

// VISA LOGIN PAGE
function showLoginPage() {
  document.getElementById("registerForm").style.display = "block";
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("contactsSection").style.display = "none";
}

// VISA CONTACTS PAGE
function showContactsPage() {
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("contactsSection").style.display = "block";
  
  // Hämta och visa kontakter
  loadContacts();
}

// Hämta och visa alla kontakter
async function loadContacts() {
  try {
    const contacts = await getContacts();
    const listDiv = document.getElementById("contactsList");
    
    if (contacts.length === 0) {
      listDiv.innerHTML = "<p>Inga kontakter ännu.</p>";
      return;
    }

    listDiv.innerHTML = contacts.map(contact => `
      <div class="contact-card">
        <h3>${contact.name}</h3>
        <p>Email: ${contact.email}</p>
        <p>Telefon: ${contact.phone}</p>
      </div>
    `).join("");
  } catch (error) {
    console.error("Error loading contacts:", error);
  }
}

// Exportera för HTML onclick
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
```

---

# 📚 GENOMGÅNG: CRUD Operations - Create, Read, Update, Delete

## Vad är CRUD?

| Handling | HTTP | Exempel |
|----------|------|---------|
| **C**reate | POST | Lägg till ny kontakt |
| **R**ead | GET | Hämta kontakter |
| **U**pdate | PUT | Ändra kontakt |
| **D**elete | DELETE | Ta bort kontakt |

## Fullstack CRUD Flow

### CREATE - Lägg till kontakt

```
Frontend: POST /contacts
Body: { name: "Bob", email: "bob@test.com", phone: "0701234567" }
Header: Authorization: Bearer {token}
    ↓
Backend validateToken: Verifierar token, sätt req.user.id
    ↓
Controller: Contact.create({ userId: req.user.id, ...})
    ↓
MongoDB: Sparar kontakt
    ↓
Response: { _id, userId, name, email, phone }
    ↓
Frontend: Uppdaterar UI, visar ny kontakt
```

### READ - Hämta kontakter

```
Frontend: GET /contacts
Header: Authorization: Bearer {token}
    ↓
Backend validateToken: req.user.id
    ↓
Controller: Contact.find({ userId: req.user.id })
    ↓
MongoDB: Hitta alla kontakter för denna user
    ↓
Response: [ kontakt1, kontakt2, ... ]
    ↓
Frontend: Visa kontakter i lista
```

### DELETE - Ta bort kontakt

```
Frontend: DELETE /contacts/{id}
Header: Authorization: Bearer {token}
    ↓
Backend validateToken: req.user.id
    ↓
Controller: 
  - Hitta kontakt
  - Kontrollera kontakt.userId === req.user.id
  - Radera om OK
    ↓
MongoDB: Tar bort kontakt
    ↓
Response: { message: "Deleted" }
    ↓
Frontend: Uppdaterar lista (laddar igen)
```

## 🧠 Viktigt: Ownership Check

Backend MÅSTE verifiera att user äger kontakten:

```javascript
// ❌ DÅLIGT
Contact.findByIdAndDelete(req.params.id);  // Vilken som helst kan radera!

// ✅ BRA
const contact = await Contact.findById(req.params.id);
if (contact.userId.toString() !== req.user.id) {
  return res.status(403).json({ message: "Not authorized" });
}
await Contact.findByIdAndDelete(req.params.id);
```

---

## 3️⃣ Contacts Page (contacts.html + js/contacts.js)
```html
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kontakter</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div class="container">
    <h1>Mina Kontakter</h1>
    <button onclick="handleLogout()">Logga ut</button>

    <!-- CREATE CONTACT FORM -->
    <div class="form-section">
      <h2>Lägg till kontakt</h2>
      <input type="text" id="name" placeholder="Namn" required>
      <input type="email" id="email" placeholder="Email" required>
      <input type="tel" id="phone" placeholder="Telefon" required>
      <button onclick="handleCreateContact()">Lägg till</button>
      <p id="createError" class="error"></p>
    </div>

    <!-- CONTACTS LIST -->
    <div id="contactsList"></div>
  </div>

  <script type="module" src="js/contacts.js"></script>
</body>
</html>
```

### js/contacts.js
```javascript
// js/contacts.js
import { 
  getContacts, 
  createContact, 
  updateContact, 
  deleteContact 
} from "./api.js";

// Kontrollera login + ladda kontakter vid sidladdning
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) {
    // Inte inloggad - gå till login
    window.location.href = "index.html";
    return;
  }
  loadContacts();
});

// CREATE - lägg till ny kontakt
async function handleCreateContact() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const errorDiv = document.getElementById("createError");

  if (!name || !email || !phone) {
    errorDiv.textContent = "❌ Alla fält krävs";
    return;
  }

  try {
    await createContact(name, email, phone);
    
    // Rensa formulär
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    
    // Ladda om listan
    loadContacts();
    errorDiv.textContent = "✅ Kontakt tillagd!";
  } catch (error) {
    errorDiv.textContent = `❌ ${error.message}`;
  }
}

// READ - hämta och visa alla kontakter
async function loadContacts() {
  try {
    const contacts = await getContacts();
    const listDiv = document.getElementById("contactsList");
    
    if (contacts.length === 0) {
      listDiv.innerHTML = "<p>Inga kontakter ännu.</p>";
      return;
    }

    listDiv.innerHTML = contacts.map(contact => `
      <div class="contact-card">
        <h3>${contact.name}</h3>
        <p>Email: ${contact.email}</p>
        <p>Telefon: ${contact.phone}</p>
        <button onclick="handleDeleteContact('${contact._id}')">Ta bort</button>
      </div>
    `).join("");
  } catch (error) {
    console.error("Error loading contacts:", error);
  }
}

// DELETE - ta bort kontakt
async function handleDeleteContact(id) {
  if (!confirm("Är du säker?")) {
    return;
  }

  try {
    await deleteContact(id);
    loadContacts();
  } catch (error) {
    console.error("Error deleting contact:", error);
  }
}

// LOGOUT
function handleLogout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// Exportera för HTML onclick
window.handleCreateContact = handleCreateContact;
window.handleDeleteContact = handleDeleteContact;
window.handleLogout = handleLogout;
```

---

## 4️⃣ Styling (css/style.css)

```css
/* css/style.css */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: #f5f5f5;
  padding: 20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1, h2 {
  margin-bottom: 20px;
  color: #333;
}

.form-section {
  background: #fafafa;
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background: #0056b3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
}

.error:empty {
  display: none;
}

.contact-card {
  background: #f9f9f9;
  padding: 15px;
  margin-bottom: 15px;
  border-left: 4px solid #007bff;
  border-radius: 4px;
}

.contact-card h3 {
  margin-bottom: 8px;
  color: #007bff;
}

.contact-card p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.contact-card button {
  margin-top: 10px;
  background: #dc3545;
  width: auto;
  padding: 8px 15px;
}

.contact-card button:hover {
  background: #c82333;
}
```

---

# 📚 GENOMGÅNG: Komplett Fullstack Flow

## Vad händer när user klickar "Lägg till kontakt"?

```
1. User fyller: namn, email, telefon
    ↓
2. User klicker button
    ↓
3. JavaScript function körs (handleCreateContact)
    ↓
4. api.js skickar fetch request
    ↓
POST /api/contacts
Body: { name, email, phone }
Header: Authorization: Bearer {token}
    ↓
5. BACKEND MOTTAR REQUEST
    ↓
6. validateToken middleware:
   - Läser Authorization header
   - Verifierar token
   - Sätt req.user.id
    ↓
7. Controller körs (createContact):
   - Validera data
   - Contact.create({ userId: req.user.id, ... })
    ↓
8. MongoDB sparar contact
    ↓
9. Backend skickar response:
   { _id, userId, name, email, phone }
    ↓
10. Frontend mottager response
    ↓
11. loadContacts() hämtar uppdaterad lista
    ↓
12. UI uppdateras - ny kontakt syns!
```

## 📊 Visuell diagram

```
┌──────────────────────┐
│      FRONTEND        │
│    React/Browser     │
└──────────┬───────────┘
           │ HTTP POST
           ▼
┌──────────────────────┐
│       BACKEND        │
│    Node + Express    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   validateToken      │
│  Middleware          │
└──────────┬───────────┘
           │ req.user.id
           ▼
┌──────────────────────┐
│     CONTROLLER       │
│   Business Logic     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       MONGODB        │
│   Sparar data        │
└──────────┬───────────┘
           │ Response
           ▼
┌──────────────────────┐
│      FRONTEND        │
│   Uppdaterar UI      │
└──────────────────────┘
```

---

## 🧪 Test Workflow
```bash
cd contacts-backend
npm run dev
# ✅ Server running on port 3000
```

### 2. Starta Frontend
```bash
# Öppna index.html i webbläsare
# Eller: python -m http.server 8000
# Gå till: http://localhost:8000
```

### 3. Registrera ny user
- Fyll namn, email, lösenord
- Klick "Registrera"
- ✅ "Registrering lyckad! Logga in nu."

### 4. Logga in
- Fyll samma email + lösenord
- Klick "Logga in"
- ✅ Se "Mina Kontakter" sida

### 5. Lägg till kontakt
- Fyll namn, email, telefon
- Klick "Lägg till"
- ✅ Kontakt visas i listan

### 6. Logout
- Klick "Logga ut"
- ✅ Tillbaka till login-sida

---

## 🔍 Data Flow: Front → Back → DB

```
FRONTEND (Browser)
  ↓
  User fyller form + klicker button
  
  ↓
  js/api.js createContact()
  
  ↓
  fetch POST /api/contacts
  Headers: Authorization: Bearer {token}
  Body: { name, email, phone }
  
  ↓
BACKEND (Node.js)
  
  validateToken Middleware
  ↓
  Verifiera token
  Sätt req.user.id
  
  ↓
  contactController.createContact()
  ↓
  Contact.create({ userId: req.user.id, name, email, phone })
  
  ↓
MONGODB
  
  Spara i contacts collection
  
  ↓
Backend svar:
  { _id: "...", userId: "...", name, email, phone }
  
  ↓
Frontend:
  Mottaget svar → loadContacts() → uppdatera UI
```

---

# 📚 GENOMGÅNG: Vanliga Misstag & Error Handling

## ❌ Misstag 1: Ingen CORS

```text
Frontend blockeras av browsern
CORS Policy: Access blocked
```

**Lösning:** Uppdatera server.js med cors-middleware.

## ❌ Misstag 2: Ingen token i headers

```text
401 Unauthorized
"No token provided"
```

**Lösning:** Se till att token skickas i Authorization header:

```javascript
headers: {
  "Authorization": `Bearer ${token}`  // ← Inte glömma!
}
```

## ❌ Misstag 3: Token sparas inte

```text
User loggas ut när sidan laddas om
```

**Lösning:** Använd localStorage:

```javascript
localStorage.setItem("token", data.token);
```

## ❌ Misstag 4: Ingen error handling

```text
Applikationen kraschar eller beter sig konstigt
```

**Lösning:** Alltid kontrollera response.ok:

```javascript
if (!response.ok) {
  const error = await response.json();
  throw new Error(error.message);
}
```

## ✅ Bra Error Handling Pattern

```javascript
try {
  const result = await login(email, password);
  // Success!
} catch (error) {
  errorDiv.textContent = `❌ ${error.message}`;
}
```

## Auto-logout på 401

För en verklig app:

```javascript
if (response.status === 401) {
  localStorage.removeItem("token");
  window.location.href = "/";  // Redirect till login
}
```

---

## ⚠️ Error Handling Tips

| Problem | Orsak | Lösning |
|---------|-------|---------|
| CORS Error | Backend tillåter inte frontend | Uppdatera `server.js` cors config |
| 401 Unauthorized | Token saknas eller expired | Logga in igen, token sparas i localStorage |
| 403 Forbidden | Försöker ändra annan users data | Kontrollera userId matchar |
| 404 Not Found | Kontakt ID existerar inte | Testa GET /api/contacts först |
| Empty contactsList | inga kontakter än | Det är OK - "Inga kontakter ännu" visas |

---

# 📚 GENOMGÅNG: localStorage Explained

## Vad är localStorage?

localStorage = **Data sparad i webbläsaren**

## Skillnad från vanlig variabel

```javascript
// Vanlig variabel - försvinner vid refresh
let token = "eyJhbGc...";

// localStorage - kvarstår vid refresh  
localStorage.setItem("token", "eyJhbGc...");
```

## localStorage operations

```javascript
// Spara
localStorage.setItem("token", "eyJhbGc...");

// Hämta
const token = localStorage.getItem("token");

// Radera
localStorage.removeItem("token");

// Vy i DevTools: F12 → Application → LocalStorage
```

## 🧠 Viktig säkerhetstanke

localStorage sparas **I KLARTEXT**. Det är därför enkelt att läsa:

```javascript
// Någon kan göra detta i console:
localStorage.getItem("token")  // Visar token i klartext!
```

**För enklare projekt OK**, men för känslig data är det bättre att använda **secure HTTP-only cookies** (mer komplext).

---

## 💾 localStorage Explained

```javascript
// Spara
localStorage.setItem("token", "eyJhbGc...");

// Hämta
const token = localStorage.getItem("token");

// Radera
localStorage.removeItem("token");

// Vy i DevTools: F12 → Application → LocalStorage
```

**Token sparas i localStorage** = förblir inloggad tills logout eller webbläsaren rensas.

---

# 📚 GENOMGÅNG: Key Concepts Recap

## CORS

Låter frontend prata med backend. Browser security som säger "dessa två portrar får prata".

## JWT Token

Bevis på att du är inloggad. Backend skapar det vid login, frontend sparar och skickar det i framtida requests.

## localStorage

Sparar token mellan refreshes. Försvinner inte när user lämnar sidan (tills logout).

## Authorization Header

Där token skickas: `Authorization: Bearer {token}`

## Middleware

Verifierar token INNAN controller körs. Säter req.user.id.

## req.user.id

Gör att backend vet vilken user som gör requesten. Används för att:
- Hämta user-specifik data
- Skydda routes
- Kontrollera ownership

## API Service Wrapper

Samlar alla fetch-calls på ett ställe (api.js). Gör koden renare och enklare att underhålla.

---

## 🎓 Key Concepts

| Begrepp | Förklaring |
|---------|-----------|
| **JWT Token** | Säker string som bevisar "du är inloggad" |
| **Authorization Header** | Där token skickas: `Authorization: Bearer {token}` |
| **CORS** | Regel som säger vilka URLer får prata med varandra |
| **localStorage** | Sparar data i webbläsare (persistent) |
| **fetch API** | JavaScript-funktion för HTTP requests |
| **Module Import/Export** | `import { func } from "file.js"` för att dela kod mellan files |

---

# 📚 GENOMGÅNG: Slutlig Mental Modell - Fullstack

## Det viktiga flödet

```
Frontend visar UI
    ↓
Frontend skickar requests
    ↓
Backend verifierar auth (JWT token)
    ↓
Backend hanterar logik
    ↓
Database lagrar data
    ↓
Backend skickar response
    ↓
Frontend uppdaterar UI
```

**Detta är kärnan i modern fullstack-utveckling.**

## Vad ni nu kan bygga

- Riktiga fullstack-appar
- Login-system
- Skyddade routes
- User-specifik data
- Frontend + backend integration
- CRUD-applikationer

## Verklig tillämpning

Detta är grunden för:
- Dashboards
- SaaS-appar
- Admin-system
- Sociala plattformar
- Interna företagsverktyg
- AI-applikationer

---

## ✅ Checklista

**Backend:**
- [ ] `npm install cors`
- [ ] `server.js` har `app.use(cors(...))`

**Frontend:**
- [ ] `js/api.js` - fetch functions med token
- [ ] `index.html` + `js/auth.js` - login/register
- [ ] `contacts.html` + `js/contacts.js` - CRUD
- [ ] `css/style.css` - styling
- [ ] Testa: Register → Login → Create Contact → Logout

---

## 🚀 Nästa Steg (ej i denna guide)
- React/Vue frontend för större projekt
- Refresh tokens (stanna inloggad längre)
- Edit-funktionalitet (UPDATE)
- Form validation (bättre error messages)
- Loading spinners (visa "laddar..." meddelande)
