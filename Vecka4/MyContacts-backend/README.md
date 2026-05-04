# Node.js Backend - Contacts API
## Steg-för-steg guide med JWT Authentication

En pedagogisk genomgång av hur man bygger en REST API från grunden.

---

## 📚 Innehål

Två kompletta guider:

### 1. **NODE_BACKEND_GUIDE.md** - Grunderna
5 moduler som täcker:
- ✅ Project setup (npm, Express, .env)
- ✅ Routes & Controllers (modulär struktur)
- ✅ MongoDB & Mongoose (databasanslutning)
- ✅ CRUD-operationer (Create, Read, Update, Delete)
- ✅ Error handling (centraliserad felhantering)

**Vad du kan efter denna guide:**
- Starta en Express server
- Bygga REST API endpoints
- Ansluta till MongoDB
- Hämta och spara data
- Hantera fel på rätt sätt

---

### 2. **NODE_AUTH_GUIDE.md** - Autentisering
3 moduler som täcker:
- ✅ User Model & Password Hashing (bcryptjs)
- ✅ Register/Login & JWT Tokens
- ✅ Token Validation Middleware (skyddade routes)

**Vad du kan efter denna guide:**
- Registrera och logga in users
- Skapa och verifiera JWT-tokens
- Skydda routes med middleware
- Koppla data till specifika users
- Implementera basic säkerhet

---

## 🎯 Lärningsväg

**Börja här:**
```
1. Läs NODE_BACKEND_GUIDE.md (30-40 min läsning)
2. Bygg steg för steg i terminal
3. Testa med Postman/Thunder Client
4. Sen: NODE_AUTH_GUIDE.md
```

---

## 🛠️ Tech Stack

```
Backend:
  - Node.js (runtime)
  - Express.js (webbramverk)
  - MongoDB (databas)
  - Mongoose (databas-mapper)

Säkerhet:
  - bcryptjs (lösenord-hashing)
  - jsonwebtoken (JWT)

Verktyg:
  - nodemon (auto-restart)
  - dotenv (miljövariabler)
```

---

## 📋 Snabbstart

### 1. Initialisera projekt
```bash
mkdir contacts-backend
cd contacts-backend
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken express-async-handler
npm install --save-dev nodemon
```

### 2. Skapa .env
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/contactsdb
ACCESS_TOKEN_SECRET=din_hemliga_nyckel_här
```

### 3. Skapa mappstruktur
```bash
mkdir routes controllers models middleware
```

### 4. Koda enligt guiden
Följ NODE_BACKEND_GUIDE.md steg för steg.

### 5. Starta servern
```bash
npm run dev
```

### 6. Testa
Öppna Postman → testa endpoints

---

## 🧪 Test Checklist

### Без Auth (Modul 1-5):
```
✅ GET /api/contacts           → lista kontakter
✅ POST /api/contacts          → skapa kontakt
✅ GET /api/contacts/{id}      → hämta en
✅ PUT /api/contacts/{id}      → uppdatera
✅ DELETE /api/contacts/{id}   → ta bort
```

### Med Auth (Modul 6-8):
```
✅ POST /api/users/register    → registrera user
✅ POST /api/users/login       → logga in, få token
✅ GET /api/contacts (med token)           → bara mina kontakter
✅ POST /api/contacts (med token)          → skapa för mig
✅ GET /api/contacts (utan token)          → 401 error ✓
```

---

## 📁 Final Projektstruktur

```
contacts-backend/
├── server.js                          # Express setup
├── dbConnection.js                    # MongoDB anslutning
├── .env                               # Hemliga variabler
├── package.json
│
├── routes/
│   ├── contactRoutes.js               # /api/contacts endpoints
│   └── userRoutes.js                  # /api/users endpoints
│
├── controllers/
│   ├── contactController.js           # CRUD för kontakter
│   └── userController.js              # Register, login
│
├── models/
│   ├── contactModel.js                # Contact schema
│   └── userModel.js                   # User schema
│
└── middleware/
    ├── errorHandler.js                # Centraliserad felhantering
    └── validateTokenHandler.js        # JWT verifiering
```

---

## 🔐 Säkerhet i Korthet

**Lösenord:**
- Hashas med bcryptjs före lagring
- Jämförs med bcrypt.compare() vid login
- Aldrig lagrat i klartext

**Tokens:**
- JWT-token skapas vid login
- Gäller 30 minuter
- Verifieras via validateToken middleware
- Sparas på client → skickas i Authorization header

**Data-isolation:**
- Users kan bara se/redigera sin egen data
- userId länkas till varje contact
- 403 error om ej ägare

---

## 🐛 Vanliga Fel

### "Cannot find module 'express'"
→ Glömt `npm install`

### "Connection refused" på MongoDB
→ Start MongoDB: `mongod`

### "token invalid" vid request
→ Token kan vara upphörd (30 min)
→ Logga in igen, få ny token

### "All fields required"
→ Saknar fields i request body
→ Check Postman → Body → JSON

### "User already exists"
→ Email redan registrerad
→ Använd annat email

---

## 📚 Resurser

- [Express.js dokumentation](https://expressjs.com)
- [Mongoose dokumentation](https://mongoosejs.com)
- [JWT.io](https://jwt.io) - decode tokens
- [bcryptjs npm](https://www.npmjs.com/package/bcryptjs)

---

## 💡 Tips

- **Postman:** Använd Collections för att spara requests
- **Token decode:** Kopiera token till jwt.io för att se innehållet
- **MongoDB:** Använd MongoDB Compass för att visualisera data
- **Nodemon:** Autostarter vid filändringar - bara spara fil
- **.env:** Aldrig commita denna till Git!

---

## ✅ Nästa Nivå (Efter denna guide)

- Refresh tokens (stanna inloggad längre)
- Email verification
- Password reset
- Rate limiting (förhindra brute force)
- Input validation (joi, zod)
- CORS (cross-origin requests)
- Testing (Jest, Mocha)
- Deployment (Heroku, Railway, Vercel)

---

## 📝 Licens

Fritt att använda för lärande & personliga projekt.

---

**Lycka till med kodningen!** 🚀