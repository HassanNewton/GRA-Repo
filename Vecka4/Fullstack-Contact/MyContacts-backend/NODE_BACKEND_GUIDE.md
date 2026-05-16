# Node.js Backend - Pedagogisk Guide
## Contacts API utan Auth

---

## 🎯 Vad vi bygger
REST API för kontakter. CRUD-operationer (Create, Read, Update, Delete).

---

## 📊 Arkitektur Overview

```
CLIENT (t.ex. Postman)
    ↓
SERVER.JS (Express app)
    ↓
ROUTES (vilka endpoints finns?)
    ↓
CONTROLLERS (vad gör vi för varje request?)
    ↓
MODELS (hur ser data ut i databasen?)
    ↓
MONGODB (lagrar allt)
```

**Varför denna struktur?**
- **Modulär** = lätt att hitta kod
- **Återanvändbar** = controllers använder modeller
- **Testbar** = varje del gör en sak

---

## 🔧 MODUL 1: Grundsetup (30 min)

### Mål
Express server som startar. Inget databas än.

### Steg 1.1: Initiera projekt
```bash
mkdir contacts-backend
cd contacts-backend
npm init -y
```

**Vad händer:** npm skapar `package.json` (lista över beroenden).

### Steg 1.2: Installera dependencies
```bash
npm install express dotenv
npm install --save-dev nodemon
```

**Vad betyder:**
- `express` = webbramverk för routes
- `dotenv` = läser miljövariabler från .env-fil
- `nodemon` = startar om servern när du ändrar kod (dev only)

### Steg 1.3: Uppdatera package.json scripts
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

**Varför:** `npm run dev` startar servern med auto-reload.

### Steg 1.4: Skapa .env-fil
```
PORT=3000
```

**Varför:** PORT sparas här, inte hardcodad i koden.

### Steg 1.5: Skapa server.js
```javascript
const express = require("express");
const dotenv = require("dotenv").config();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON från requests

// Routes (placeholder)
app.get("/api/contacts", (req, res) => {
  res.status(200).json({ message: "Hello from contacts endpoint" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

**Test:** `npm run dev` → Gå till `http://localhost:3000/api/contacts`

---

## 🛣️ MODUL 2: Routes & Controllers (30 min)

### Mål
Flytta logik från server.js. Skapa separate routes och controllers.

### Varför separate files?
```
DÅLIGT (allt i server.js):
- Serverfilen blir 500 rader
- Svårt att hitta vad som gör vad
- Måste ändra server.js för varje ny route

BRA (modulärt):
- server.js = bara setup
- contactRoutes.js = vilka endpoints?
- contactController.js = vad gör varje endpoint?
```

### Steg 2.1: Skapa mapp structure
```bash
mkdir routes controllers models middleware
```

### Steg 2.2: Skapa routes/contactRoutes.js
```javascript
const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

// Alla GET/POST på /api/contacts
router.route("/").get(getContacts).post(createContact);

// Alla GET/PUT/DELETE på /api/contacts/:id
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;
```

**Vad betyder:**
- `router.route("/")` = `/api/contacts` (root)
- `.get()` = HTTP GET request
- `.post()` = HTTP POST request
- `:id` = parameter (t.ex. `/api/contacts/123`)

### Steg 2.3: Skapa controllers/contactController.js (utan databas än)
```javascript
// @desc Get all contacts
// @route GET /api/contacts
// @access Public
const getContacts = async (req, res) => {
  try {
    res.status(200).json({ message: "Get all contacts" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create contact
// @route POST /api/contacts
// @access Public
const createContact = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return res.status(400).json({ message: "All fields required" });
  }

  res.status(201).json({ 
    message: "Contact created", 
    data: { name, email, phone } 
  });
};

// @desc Get single contact
// @route GET /api/contacts/:id
// @access Public
const getContact = async (req, res) => {
  res.status(200).json({ message: `Get contact ${req.params.id}` });
};

// @desc Update contact
// @route PUT /api/contacts/:id
// @access Public
const updateContact = async (req, res) => {
  res.status(200).json({ message: `Update contact ${req.params.id}` });
};

// @desc Delete contact
// @route DELETE /api/contacts/:id
// @access Public
const deleteContact = async (req, res) => {
  res.status(200).json({ message: `Delete contact ${req.params.id}` });
};

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
```

**Vad är detta?**
- Varje funktion = en route handler
- Comments `@desc`, `@route`, `@access` = dokumentation
- `req.body` = data från POST request
- `req.params.id` = värde från URL-parameter

### Steg 2.4: Uppdatera server.js
```javascript
const express = require("express");
const dotenv = require("dotenv").config();
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/contacts", contactRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

**Vad ändrade:**
- Importera `contactRoutes`
- `app.use("/api/contacts", contactRoutes)` = "alla routes börjar med /api/contacts"

**Test med Postman/Thunder Client:**
- GET `http://localhost:3000/api/contacts` ✅
- POST `http://localhost:3000/api/contacts` med body `{"name":"John","email":"john@test.com","phone":"123456"}` ✅
- GET `http://localhost:3000/api/contacts/1` ✅

---

## 🗄️ MODUL 3: Database & Models (30 min)

### Mål
Ansluta MongoDB. Skapa Contact-modell. Spara och hämta riktiga data.

### Steg 3.1: Installera Mongoose
```bash
npm install mongoose
```

**Vad är Mongoose?** Gör det enkelt att arbeta med MongoDB.

### Steg 3.2: Uppdatera .env
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/contactsdb
```

**Varför:** Anslutningssträngen sparas här.

### Steg 3.3: Skapa models/contactModel.js
```javascript
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
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
    timestamps: true, // createdAt, updatedAt automatic
  }
);

module.exports = mongoose.model("Contact", contactSchema);
```

**Vad är detta?**
- Schema = struktur för en kontakt
- `required: [true, "message"]` = validering
- `timestamps: true` = auto-created och updated fields

### Steg 3.4: Skapa dbConnection.js
```javascript
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1); // Stop server om connection fails
  }
};

module.exports = connectDB;
```

**Vad gör denna?**
- Ansluter till MongoDB
- Visar ett meddelande om anslutningen lyckades
- Avslutar processen om det misslyckas

### Steg 3.5: Uppdatera server.js för databas
```javascript
const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./dbConnection");
const contactRoutes = require("./routes/contactRoutes");

connectDB(); // Connect to database FIRST

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/contacts", contactRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

---

## 🎬 MODUL 4: Controllers med Databas (30 min)

### Mål
Uppdatera controllers för att faktiskt använda MongoDB.

### Steg 4.1: Uppdatera controllers/contactController.js
```javascript
const Contact = require("../models/contactModel");

// @desc Get all contacts
// @route GET /api/contacts
// @access Public
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create contact
// @route POST /api/contacts
// @access Public
const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    const contact = await Contact.create({ name, email, phone });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single contact
// @route GET /api/contacts/:id
// @access Public
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update contact
// @route PUT /api/contacts/:id
// @access Public
const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return updated document
    );

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete contact
// @route DELETE /api/contacts/:id
// @access Public
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json({ message: "Contact deleted", data: contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
};
```

**Viktig del:**
- `Contact.find()` = alla kontakter
- `Contact.create()` = skapa ny
- `Contact.findById()` = hämta en
- `Contact.findByIdAndUpdate()` = uppdatera
- `Contact.findByIdAndDelete()` = ta bort

### Test i Postman:
1. **POST** `http://localhost:3000/api/contacts`
   ```json
   {
     "name": "John Doe",
     "email": "john@test.com",
     "phone": "0701234567"
   }
   ```
   Svar: Contact sparad i MongoDB med ID

2. **GET** `http://localhost:3000/api/contacts`
   Svar: Alla kontakter

3. **GET** `http://localhost:3000/api/contacts/{ID}`
   Svar: En specifik kontakt

4. **PUT** `http://localhost:3000/api/contacts/{ID}`
   ```json
   {
     "name": "Jane Doe",
     "phone": "0701234568"
   }
   ```
   Svar: Uppdaterad kontakt

5. **DELETE** `http://localhost:3000/api/contacts/{ID}`
   Svar: Borttagen

---

## ⚠️ MODUL 5: Error Handling (15 min)

### Mål
Bättre felhantering. Centraliserad error middleware.

### Steg 5.1: Skapa middleware/errorHandler.js
```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;
```

### Steg 5.2: Uppdatera server.js
```javascript
const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./dbConnection");
const contactRoutes = require("./routes/contactRoutes");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();

app.use(express.json());
app.use("/api/contacts", contactRoutes);

// Error handler SIST
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

---

## 📋 Vad gör varje del?

| Fil | Ansvar |
|-----|--------|
| `server.js` | Setup, middleware, start |
| `dbConnection.js` | Anslut MongoDB |
| `routes/contactRoutes.js` | Vilka endpoints? (GET, POST, etc) |
| `controllers/contactController.js` | Vad gör varje endpoint? |
| `models/contactModel.js` | Hur ser data ut? |
| `middleware/errorHandler.js` | Hantera fel |

---

## 🔗 Hur data flödar

```
1. Client skickar request
   POST /api/contacts
   Body: { name: "John", email: "john@test", phone: "123" }

2. server.js tar emot → routes
   
3. routes/contactRoutes.js matchar URL → anropar controller

4. controllers/contactController.js → createContact()
   - Hämtar data från req.body
   - Validerar data
   - Anropar Contact.create()

5. models/contactModel.js → Mongoose
   - Validerar mot schema
   - Sparar i MongoDB

6. Mongoose returnerar sparat objekt

7. Controller skickar JSON-svar tillbaka

8. Client får svar med ny kontakt + ID
```

---

## 💾 Nästa steg (ej i denna guide)
- Authentication (JWT)
- Input validation (joi, zod)
- Rate limiting
- Caching
- Testing

---

## ✅ Checklista

- [ ] `npm init -y`
- [ ] `npm install express mongoose dotenv`
- [ ] `npm install --save-dev nodemon`
- [ ] Skapa `.env` med PORT och MONGO_URI
- [ ] Skapa `server.js`
- [ ] Skapa mappar: `routes/`, `controllers/`, `models/`, `middleware/`
- [ ] Skapa `routes/contactRoutes.js`
- [ ] Skapa `controllers/contactController.js`
- [ ] Skapa `models/contactModel.js`
- [ ] Skapa `dbConnection.js`
- [ ] Skapa `middleware/errorHandler.js`
- [ ] `npm run dev`
- [ ] Testa i Postman (GET, POST, PUT, DELETE)
