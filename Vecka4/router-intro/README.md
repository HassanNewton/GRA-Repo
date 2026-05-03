# React Router - Snabb Sammanfattning

En kort guide till de viktigaste koncepten i React Router.

---

## 🎯 Vad är React Router?

React Router låter dig skapa **flera "sidor"** i en React-app **utan att ladda om** hela sidan. 

Det är en SPA (Single Page Application) som beter sig som en vanlig multi-page webbplats.

---

## 🏗️ Arkitekturen - De 4 Viktigaste Delarna

### 1. **`<Router>`** - Omsluter ALLT
```javascript
<Router>
  {/* Allt som behöver routing går här */}
</Router>
```
**Vad den gör:**
- Håller koll på webbläsarens URL
- Gör att länkklick inte laddar om sidan
- Möjliggör navigation

---

### 2. **`<Routes>`** - Container för alla sidor
```javascript
<Routes>
  {/* Alla Route-element hamnar här */}
</Routes>
```
**Vad den gör:**
- Är en container för alla möjliga routes
- Matchar URL mot en Route och renderar komponenten
- Visar bara EN komponent åt gången

---

### 3. **`<Route>`** - Definierar EN sida
```javascript
<Route path="/produkter" element={<Products />} />
```
**Vad den gör:**
- Säger "Om URL är /produkter, visa Products-komponenten"
- `path` = URL:en
- `element` = Komponenten som visas

**Med parameter (dynamisk route):**
```javascript
<Route path="/produkter/:id" element={<ProductDetail />} />
```
- `:id` är en variabel som kan läsas med `useParams()`

---

### 4. **`<Link>`** - Navigeringslänk (INTE `<a>`!)
```javascript
<Link to="/produkter">Se alla produkter</Link>
```
**Vad den gör:**
- Är som en vanlig länk men laddar INTE om sidan
- Byter bara innehållet
- **VIKTIGT:** Använd alltid `to` inte `href`!