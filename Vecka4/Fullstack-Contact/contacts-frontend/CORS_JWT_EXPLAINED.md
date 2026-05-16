# CORS & JWT Explained Simply
## Vad behöver studenterna veta?

---

## 🤝 CORS - Cross-Origin Resource Sharing

### Problem
```
Frontend: http://localhost:8000
Backend:  http://localhost:3000

Frontend försöker ansluta till Backend
→ Webbläsaren säger NEJ! Olika domäner = risk.
```

### Lösning
**Tell backend: "Tillåt frontend att ansluta"**

**Backend: server.js**
```javascript
const cors = require("cors");
app.use(cors({ 
  origin: "http://localhost:8000" 
}));
```

**Det är det!** Nu kan frontend prata med backend.

---

## 🔐 JWT - JSON Web Tokens

### Problem
```
Frontend: "Jag är John från email john@test.com"
Backend: "Bevis det!"

Utan bevis = vilken som helst kan säga att de är John.
```

### Lösning
**Backend ger en hemlig "biljett" (token) vid login.**

### Flow

```
1️⃣ LOGIN
   Frontend: POST /login { email, password }
   Backend: "Lösenord rätt! Här är din token."
   Token sparas i Frontend

2️⃣ REQUEST MED TOKEN
   Frontend: GET /contacts
             Header: Authorization: Bearer {token}
   Backend: "Ah, du är John! Här är dina kontakter."

3️⃣ LOGOUT
   Frontend: ta bort token
   Nästa request utan token → Backend säger NEJ
```

---

## 🔑 Token Innehål (simpel version)

```javascript
{
  user: {
    id: "65a1b2c3d4e5f6g7h8i9j",
    email: "john@test.com"
  },
  created: "2024-01-14T10:00:00",
  expires: "2024-01-14T10:30:00"  // Gäller 30 min
}
```

**Backend vet:**
- Vilken user det är
- Att token inte är förfalskad (signerad)
- Att token inte är uppförfalskad

---

## 💾 localStorage

**Vad:** Sparar data i webbläsaren.

```javascript
// Login - spara token
localStorage.setItem("token", data.token);

// Nästa gång - hämta token
const token = localStorage.getItem("token");

// Logout - ta bort token
localStorage.removeItem("token");
```

**Token förblir sparad tills:**
- User gör logout
- Webbläsaren cookies/cache rensas
- Manuellt raderas

---

## 🔄 Complete Request Flow

### 1. REGISTER
```
User: "John / john@test.com / hemligt123"
  ↓
POST /api/users/register
  ↓
Backend: Hash lösenord → spara user
  ↓
Response: { _id, name, email }
  ↓
Frontend: "Du kan logga in nu"
```

### 2. LOGIN
```
User: "john@test.com / hemligt123"
  ↓
POST /api/users/login
  ↓
Backend: 
  - Hitta user med email
  - Jämför lösenord (bcrypt.compare)
  - Skapa JWT token
  ↓
Response: { token: "eyJhbGc..." }
  ↓
Frontend: localStorage.setItem("token", response.token)
```

### 3. GET PROTECTED DATA
```
Frontend: GET /api/contacts
          Header: Authorization: Bearer eyJhbGc...
  ↓
Backend Middleware validateToken:
  - Extrahera token från header
  - Verifiera med SECRET
  - Sätt req.user.id
  ↓
Controller:
  - Använd req.user.id
  - Hitta bara denna users kontakter
  ↓
Response: [ { _id, name, email, phone } ]
```

### 4. CREATE CONTACT (som inloggad user)
```
Frontend: POST /api/contacts
          Body: { name, email, phone }
          Header: Authorization: Bearer {token}
  ↓
Backend validateToken:
  - req.user.id = "65a1b2c3d4e5f6g7h8i9j"
  ↓
Controller createContact:
  - const contact = await Contact.create({
      userId: req.user.id,  // ← Från token!
      name, email, phone
    })
  ↓
Database: Spara contact + userId
  ↓
Response: Contact (med userId)
```

---

## ❌ Without Auth (Problem)

```
// ANY client kan göra detta:
GET /api/contacts
// Server: "Här är ALLA kontakter för ALLA users"

// ANY client kan göra detta:
DELETE /api/contacts/someone_elses_id
// Server: "OK, raderad!"
```

**Resultat:** Kaos! Data läcker. Inte säkert.

---

## ✅ With Auth (Säker)

```
// Client utan token:
GET /api/contacts
// Server: "401 Unauthorized. Du måste logga in först."

// Client med token från John:
GET /api/contacts
// Server: "OK, här är BARA Johns kontakter."

// Client försöker radera andras kontakt:
DELETE /api/contacts/bob_id
// Server: "403 Forbidden. Du äger denna kontakt inte."
```

**Resultat:** Säkert. Varje user ser bara sitt.

---

## 🧬 Token Lifecycle

```
1. USER REGISTRAR + LOGGAR IN
   ↓ Token skapas
   
2. TOKEN I LOCALSTORAGE
   ↓ Finns kvar även om sida laddas om
   
3. ANVÄND TOKEN I ALLA REQUESTS
   ↓ Backend veriferar varje gång
   
4. TOKEN UPPHÖR EFTER 30 MIN
   ↓ User måste logga in igen för ny token
   
5. USER LOGGAR UT
   ↓ Token raderas från localStorage
   ↓ Nästa request utan token = 401
```

---

## 🚨 Common Mistakes

### 1. Glömma CORS
```javascript
// DÅLIGT
app.use(express.json());
// Frontend kan inte ansluta!

// BRA
const cors = require("cors");
app.use(cors({ origin: "http://localhost:8000" }));
app.use(express.json());
```

### 2. Glömma Token i Header
```javascript
// DÅLIGT
const response = await fetch("/api/contacts", {
  method: "GET"
  // Ingen Authorization header!
  // Server: "401 Unauthorized"
});

// BRA
const response = await fetch("/api/contacts", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`  // ← Token här!
  }
});
```

### 3. Spara Token i Global Variable
```javascript
// DÅLIGT
let token = null;  // Försvinner om sida laddas om!

// BRA
localStorage.setItem("token", data.token);  // Persistent
```

### 4. Ingen Error Handling
```javascript
// DÅLIGT
const response = await fetch("/api/contacts");
const data = await response.json();  // Kan krascha!

// BRA
const response = await fetch("/api/contacts");
if (!response.ok) {
  throw new Error(await response.json().message);
}
const data = await response.json();
```

---

## 📋 Files & Ansvar

### Backend Setup (Node.js)
| File | Gör | CORS? | JWT? |
|------|-----|-------|------|
| `server.js` | Start express | **JA** | - |
| `routes/userRoutes.js` | /register, /login | - | Skapar |
| `routes/contactRoutes.js` | /contacts (skyddat) | - | Använder |
| `middleware/validateTokenHandler.js` | Verifiera token | - | **JA** |
| `.env` | Spara secrets | - | ACCESS_TOKEN_SECRET |

### Frontend (HTML + JS)
| File | Gör | Token? |
|------|-----|--------|
| `index.html` | Login/Register form | - |
| `js/api.js` | Fetch wrapper | **JA** - lägg till i varje request |
| `js/auth.js` | Login logic | Sparar i localStorage |
| `js/contacts.js` | CRUD operations | Hämtar från localStorage |
| `css/style.css` | Styling | - |

---

## 🧪 Test Checklist

**Backend startar:**
```bash
npm run dev
# ✅ Server running on port 3000
```

**Register:**
```
POST http://localhost:3000/api/users/register
Body: { name, email, password }
Response: ✅ { _id, name, email }
```

**Login:**
```
POST http://localhost:3000/api/users/login
Body: { email, password }
Response: ✅ { token: "eyJhbGc..." }
```

**Get Contacts (med token):**
```
GET http://localhost:3000/api/contacts
Header: Authorization: Bearer {token_från_login}
Response: ✅ [ { _id, userId, name, email, phone } ]
```

**Get Contacts (utan token):**
```
GET http://localhost:3000/api/contacts
(ingen Authorization header)
Response: ❌ 401 { message: "No token provided" }
```

**Frontend can access:**
```
Frontend: http://localhost:8000
GET /api/contacts
Response: ✅ CORS tillåtet, data returneras
```

---

## 🎓 Key Takeaways

1. **CORS** = Låter frontend prata med backend
2. **JWT Token** = Bevis på att du är inloggad
3. **localStorage** = Sparar token mellan page loads
4. **Authorization Header** = Där token skickas: `Bearer {token}`
5. **validateToken Middleware** = Alla skyddade routes startar här
6. **req.user.id** = Controller vet vilken user som gör request

---

## 🔗 Summary: Login → Request Protected Data

```
┌─────────────────────────────────────────────────────────┐
│                       LOGIN FLOW                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Frontend: POST /api/users/login                      │
│     Body: { email, password }                            │
│                                                          │
│  2. Backend: Verifiera lösenord                          │
│     Skapa JWT token                                      │
│     Response: { token: "..." }                           │
│                                                          │
│  3. Frontend: localStorage.setItem("token", response)    │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              REQUEST PROTECTED DATA FLOW                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Frontend: GET /api/contacts                          │
│     Header: Authorization: Bearer {token_från_login}    │
│                                                          │
│  2. Backend validateToken:                              │
│     Extrahera token från header                         │
│     Verifiera token är giltigt                          │
│     Sätt req.user.id                                    │
│     Anropa nästa middleware/controller                  │
│                                                          │
│  3. Controller: Använd req.user.id                       │
│     Hitta bara denna users kontakter                    │
│     Response: Kontakter                                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

**Studenterna behöver förstå:**
1. Varför CORS behövs (säkerhet mellan domäner)
2. Hur JWT funkar (token som bevis på login)
3. Var token sparas (localStorage)
4. Hur token skickas (Authorization header)
5. Vad backend gör med token (verifiera + använd user ID)

**Resten är implementationsdetaljer.**
