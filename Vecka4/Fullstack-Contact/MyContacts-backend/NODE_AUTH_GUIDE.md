# Node.js Backend - JWT Authentication
## Modul 6-8: Autentisering & Skyddade Routes

---

## 🎯 Vad vi bygger denna gång
Users kan registrera sig, logga in, få JWT-token. Routes skyddas - bara inloggade users kan komma åt.

---

## 📊 Flow: Från Registration Till Skyddad Route

```
1. USER REGISTRERAR
   POST /api/users/register
   { name, email, password }
       ↓
   Password hashas (bcrypt)
   User sparas i MongoDB
   Svar: { _id, email }

2. USER LOGGAR IN
   POST /api/users/login
   { email, password }
       ↓
   Password jämförs med hashat (bcrypt)
   JWT-token skapas
   Svar: { token: "eyJhbGc..." }

3. USER ANVÄNDER TOKEN
   GET /api/contacts
   Header: Authorization: Bearer eyJhbGc...
       ↓
   Middleware validateToken verifierar token
   req.user sätts (innehåller user ID)
   Controller får tillgång till req.user

4. SKYDDAD OPERATION
   Controller använder req.user.id
   Sparar kontakt med userId
   Bara denna users kontakter returneras
```

---

## 🔒 MODUL 6: User Model & Password Hashing (20 min)

### Mål
Skapa User-modell. Förstå varför lösenord hashas.

### Varför hasha lösenord?
```
DÅLIGT (aldrig göra):
Database: { email: "john@test.com", password: "hemligt123" }
→ Om databas läcks: lösenordet är synligt!

BRA (det vi gör):
Database: { email: "john@test.com", password: "$2a$10$N9qo8uLO..." }
→ Även om databas läcks: lösenordet är omöjligt att återskapa!
→ Processen är envägs (one-way hashing)
```

### Steg 6.1: Installera bcryptjs
```bash
npm install bcryptjs jsonwebtoken
```

**Vad är:**
- `bcryptjs` = hashning av lösenord
- `jsonwebtoken` = skapande och verifiering av tokens

### Steg 6.2: Skapa models/userModel.js
```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true, // Inte två users samma email
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
```

**Notera:**
- `unique: true` = databas säkerställer inga dubbletter
- Lösenordet sparas INTE i klartext (gör vi senare)

### Steg 6.3: Förstå bcrypt
```javascript
const bcrypt = require("bcryptjs");

// REGISTRERING - hasha lösenord INNAN spara
const plainPassword = "hemligt123";
const hashedPassword = await bcrypt.hash(plainPassword, 10);
// hashedPassword = "$2a$10$N9qo8uLO..." (aldrig samma två gånger!)

// LOGIN - jämför lösenord med hashat
const userPassword = "$2a$10$N9qo8uLO..."; // från database
const inputPassword = "hemligt123"; // från user
const isMatch = await bcrypt.compare(inputPassword, userPassword);
// isMatch = true/false
```

**Salt:** `bcrypt.hash(password, 10)` - cifran `10` betyder "krånglar till lösenordet 10 gånger". Högre = säkrare men långsammare.

---

## 🔑 MODUL 7: Authentication Controller & Routes (30 min)

### Mål
Registrera users, logga in, skapa JWT-tokens.

### Steg 7.1: Installera express-async-handler
```bash
npm install express-async-handler
```

**Varför:** Hantera async errors automatiskt (slippa try-catch överallt).

### Steg 7.2: Skapa controllers/userController.js
```javascript
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @desc Register user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validering
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // Kolla om user redan finns
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hasha lösenord
  const hashedPassword = await bcrypt.hash(password, 10);

  // Skapa user
  const user = await User.create({
    name,
    email,
    password: hashedPassword, // Spara hashat lösenord
  });

  res.status(201).json({
    message: "User registered successfully",
    data: {
      _id: user.id,
      email: user.email,
      name: user.name,
    },
  });
});

// @desc Login user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validering
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password required");
  }

  // Hitta user
  const user = await User.findOne({ email });

  // Jämför lösenord
  if (user && (await bcrypt.compare(password, user.password))) {
    // Lösenord rätt - skapa token
    const token = jwt.sign(
      { user: { id: user.id, email: user.email } }, // Data att lagra i token
      process.env.ACCESS_TOKEN_SECRET, // Secret key
      { expiresIn: "30m" } // Token gäller 30 minuter
    );

    res.json({
      message: "Login successful",
      token: token,
    });
  } else {
    // Lösenord fel eller user existerar inte
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

module.exports = {
  registerUser,
  loginUser,
};
```

**Vad gör registerUser:**
1. Hämtar name, email, password från request
2. Validerar att alla finns
3. Kolla om email redan registrerad
4. Hasha lösenordet
5. Spara user i MongoDB
6. Svar: user data (inte lösenord!)

**Vad gör loginUser:**
1. Hämtar email, password
2. Hitta user i databas
3. Jämför lösenord med bcrypt.compare()
4. Om rätt: skapa JWT-token med user info
5. Svar: token (user använder detta senare)

**JWT-token innehåller:**
```javascript
{
  user: {
    id: "mongodb_user_id",
    email: "john@test.com"
  },
  iat: 1234567890,    // Skapats när
  exp: 1234568790     // Upphör när
}
```

### Steg 7.3: Uppdatera .env
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/contactsdb
ACCESS_TOKEN_SECRET=din_hemliga_nyckel_här_12345
```

**Varför:** ACCESS_TOKEN_SECRET måste vara en hemlig string. Längre = säkrare.

### Steg 7.4: Skapa routes/userRoutes.js
```javascript
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
} = require("../controllers/userController");

// Publika routes (ingen auth behövs)
router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
```

### Step 7.5: Uppdatera server.js
```javascript
const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./dbConnection");
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes"); // ← NY
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();

app.use(express.json());

// Routes
app.use("/api/users", userRoutes); // ← NY
app.use("/api/contacts", contactRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

### Test i Postman:

**1. Register:**
```
POST http://localhost:3000/api/users/register

Body (JSON):
{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "hemligt123"
}

Svar: ✅
{
  "message": "User registered successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j",
    "email": "john@test.com",
    "name": "John Doe"
  }
}
```

**2. Login:**
```
POST http://localhost:3000/api/users/login

Body (JSON):
{
  "email": "john@test.com",
  "password": "hemligt123"
}

Svar: ✅
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Spara denna token!** Du använder den nästa.

---

## 🛡️ MODUL 8: Token Validation Middleware & Skyddade Routes (30 min)

### Mål
Skapa middleware som verifierar tokens. Skydda contact-routes.

### Varför middleware?
```
UTAN middleware (varje controller måste kolla token):
const getContacts = async (req, res) => {
  // Repetera denna kod i VARJE controller:
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, SECRET, ...);
  // ... sen faktisk logik
}

MED middleware (en gång, använd överallt):
router.use(validateToken);

const getContacts = async (req, res) => {
  // Token redan validerad, req.user redan satt
  // Bara affärslogik
}
```

### Steg 8.1: Skapa middleware/validateTokenHandler.js
```javascript
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// @desc Validera JWT token
// @route Middleware för skyddade routes
// @access Private
const validateToken = asyncHandler(async (req, res, next) => {
  let token;

  // Hämta token från Authorization header
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    // Format: "Bearer eyJhbGc..."
    token = authHeader.split(" ")[1]; // Ta delen efter "Bearer "
  }

  // Kolla om token finns
  if (!token) {
    res.status(401);
    throw new Error("No token provided, access denied");
  }

  // Verifiera token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // Token invalid eller upphörd
      res.status(401);
      throw new Error("Token invalid or expired");
    }

    // Token giltiga! Sätt user info på request
    req.user = decoded.user; // { id: "...", email: "..." }

    // Gå vidare till nästa middleware/route
    next();
  });
});

module.exports = validateToken;
```

**Vad gör detta:**
1. Hämtar token från `Authorization: Bearer {token}` header
2. Verifierar token med ACCESS_TOKEN_SECRET
3. Om giltigt: sätter `req.user` och anropar `next()`
4. Om ogiltigt: skickar 401-error och stoppar kedjan

**next() är kritisk:** Om vi inte anropar next(), stoppas request och når aldrig controllern!

### Steg 8.2: Uppdatera controllers/contactController.js
```javascript
const Contact = require("../models/contactModel");

// @desc Get all contacts for current user
// @route GET /api/contacts
// @access Private
const getContacts = async (req, res) => {
  // req.user är redan satt av middleware!
  const contacts = await Contact.find({ userId: req.user.id });
  res.status(200).json(contacts);
};

// @desc Create contact
// @route POST /api/contacts
// @access Private
const createContact = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "All fields required" });
  }

  // Sätt userId från inloggad user
  const contact = await Contact.create({
    userId: req.user.id,
    name,
    email,
    phone,
  });

  res.status(201).json(contact);
};

// @desc Get single contact
// @route GET /api/contacts/:id
// @access Private
const getContact = async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  // Kolla att contact tillhör inloggad user
  if (contact.userId.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Not authorized to view this contact" });
  }

  res.status(200).json(contact);
};

// @desc Update contact
// @route PUT /api/contacts/:id
// @access Private
const updateContact = async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  // Kolla att contact tillhör inloggad user
  if (contact.userId.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Not authorized to update this contact" });
  }

  // Uppdatera
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedContact);
};

// @desc Delete contact
// @route DELETE /api/contacts/:id
// @access Private
const deleteContact = async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  // Kolla att contact tillhör inloggad user
  if (contact.userId.toString() !== req.user.id) {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this contact" });
  }

  await Contact.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Contact deleted" });
};

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
```

**Vad ändrade:**
- `req.user.id` används överallt (satt av middleware)
- Sparar `userId` när contact skapas
- Kolla att user äger contact innan update/delete (403 = "Forbidden")

### Steg 8.3: Uppdatera models/contactModel.js
```javascript
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Varje contact måste ha en owner
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
    },
    phone: {
      type: String,
      required: [true, "Please add a phone"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);
```

**Notera:**
- `userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }` = länk till User
- `required: true` = varje contact måste ha owner

### Steg 8.4: Uppdatera routes/contactRoutes.js
```javascript
const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandler");
const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

// Använd middleware på ALLA contact routes
router.use(validateToken); // ← KEY LINE

router.route("/").get(getContacts).post(createContact);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;
```

**Vad `router.use(validateToken)` gör:**
- Alla requests till contact-routes passerar genom validateToken först
- Om token invalid: stoppas här, returneras 401
- Om token giltigt: req.user sätts, fortsätter till actual route

### Steg 8.5: Uppdatera server.js
```javascript
const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./dbConnection");
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();

app.use(express.json());

// Publika routes (ingen auth)
app.use("/api/users", userRoutes);

// Skyddade routes (auth krävs)
app.use("/api/contacts", contactRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

---

## 🧪 Test Workflow i Postman

### 1. Register nya user
```
POST http://localhost:3000/api/users/register

Body:
{
  "name": "Alice",
  "email": "alice@test.com",
  "password": "pass123"
}

Svar: ✅ User skapad
```

### 2. Login
```
POST http://localhost:3000/api/users/login

Body:
{
  "email": "alice@test.com",
  "password": "pass123"
}

Svar: ✅
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVhMWIyYzNkNGU1ZjZnN2g4aTlqIiwiZW1haWwiOiJhbGljZUB0ZXN0LmNvbSJ9LCJpYXQiOjE3MDUxNjU4NDgsImV4cCI6MTcwNTE2NzY0OH0.xyz..."
}

→ KOPIERA DENNA TOKEN
```

### 3. Skapa contact (med token i header)
```
POST http://localhost:3000/api/contacts

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Body:
{
  "name": "Bob Smith",
  "email": "bob@test.com",
  "phone": "0701234567"
}

Svar: ✅ Contact skapad (userId satt automatiskt)
{
  "_id": "65a2c3d4e5f6g7h8i9j0k",
  "userId": "65a1b2c3d4e5f6g7h8i9j",
  "name": "Bob Smith",
  "email": "bob@test.com",
  "phone": "0701234567",
  "createdAt": "2024-01-14T...",
  "updatedAt": "2024-01-14T..."
}
```

### 4. Hämta kontakter (skyddat)
```
GET http://localhost:3000/api/contacts

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Svar: ✅ Bara denna users kontakter
[
  {
    "_id": "65a2c3d4e5f6g7h8i9j0k",
    "userId": "65a1b2c3d4e5f6g7h8i9j",
    "name": "Bob Smith",
    ...
  }
]
```

### 5. Utan token (ska misslyckas)
```
GET http://localhost:3000/api/contacts

(ingen Authorization header)

Svar: ❌ 401
{
  "message": "No token provided, access denied"
}
```

---

## 🔐 Säkerhet: Vad vi nu har

✅ Lösenord hashas (bcryptjs)
✅ Token skapas vid login
✅ Token verifieras innan access
✅ Users kan bara se sin egna data
✅ Token upphör efter 30 min

---

## ⚡ Felhantering: Lägg märke till

| Kod | Betydelse |
|-----|-----------|
| 200 | OK - request lyckades |
| 201 | Created - ny resurs skapad |
| 400 | Bad Request - invalid data |
| 401 | Unauthorized - token saknas/ogiltigt |
| 403 | Forbidden - har inte permission |
| 404 | Not Found - resursen existerar inte |
| 500 | Server Error - något gick fel |

---

## 🔄 Datamöbler efter autentisering

### Innan (ingen userId)
```
Contact {
  _id: "123",
  name: "Bob",
  email: "bob@test.com",
  phone: "123456"
}
```

### Efter (med userId)
```
Contact {
  _id: "123",
  userId: "user_456",  ← Link till User
  name: "Bob",
  email: "bob@test.com",
  phone: "123456"
}
```

---

## 📋 Vad gör varje del?

| Fil | Ansvar |
|-----|--------|
| `models/userModel.js` | Användar-schema |
| `controllers/userController.js` | Register, Login logik |
| `routes/userRoutes.js` | /register, /login endpoints |
| `middleware/validateTokenHandler.js` | Verifiera JWT token |
| `routes/contactRoutes.js` | (uppdaterad) använder middleware |
| `controllers/contactController.js` | (uppdaterad) använder req.user.id |
| `models/contactModel.js` | (uppdaterad) har userId fält |

---

## 🔗 Request Flow: Med Authentication

```
1. CLIENT
   POST /api/users/login
   { email, password }

2. registerUser/loginUser (OPROTEKTERAD)
   ↓
   Verifiera lösenord
   Skapa JWT token
   Svar: { token: "..." }

3. CLIENT SPARAR TOKEN
   (i localStorage, sessionStorage, cookie)

4. CLIENT GÖR PROTECTED REQUEST
   GET /api/contacts
   Header: Authorization: Bearer {token}

5. VALIDATETOKEN MIDDLEWARE (KÖRS FÖRST)
   ↓
   Extrahera token från header
   Verifiera med ACCESS_TOKEN_SECRET
   Sett req.user = { id, email }
   next() → vidare

6. CONTROLLER (getContacts)
   ↓
   Använd req.user.id
   Hitta bara denna users kontakter
   Svar: kontakter

7. CLIENT FÅR SVAR
```

---

## ✅ Checklista för denna modul

- [ ] `npm install bcryptjs jsonwebtoken express-async-handler`
- [ ] Skapa `models/userModel.js`
- [ ] Skapa `controllers/userController.js` med registerUser, loginUser
- [ ] Skapa `routes/userRoutes.js`
- [ ] Uppdatera `server.js` för userRoutes
- [ ] Uppdatera `.env` med ACCESS_TOKEN_SECRET
- [ ] Skapa `middleware/validateTokenHandler.js`
- [ ] Uppdatera `models/contactModel.js` med userId
- [ ] Uppdatera `controllers/contactController.js` för req.user.id
- [ ] Uppdatera `routes/contactRoutes.js` med validateToken middleware
- [ ] `npm run dev`
- [ ] Test i Postman: register → login → create contact → get contacts (med token)

---

## 🚀 Nästa steg (ej i denna guide)
- Refresh tokens (stanna inloggad längre)
- Logout (blacklist tokens)
- Password reset (glömt lösenord)
- Email verification
- Rate limiting (förhindra brute force)
- CORS (cross-origin requests)
