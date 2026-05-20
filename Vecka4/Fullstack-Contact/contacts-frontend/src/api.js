// Bas-URL till vårt backend API.
// Alla requests kommer börja med denna adress.
const API_BASE = "http://localhost:3000/api";

// Hämtar token från browserns localStorage.
// localStorage används för att spara data permanent i webbläsaren.
function getToken() {
  // Hämtar värdet som sparats under nyckeln "token".
  return localStorage.getItem("token");
}

// Kollar om användaren är inloggad.
// !! gör om värdet till true eller false.
export function isAuthenticated() {
  // Om token finns -> true
  // Om token är null -> false
  return !!getToken();
}

// Generell request-funktion.
// ALLA API-anrop går genom denna funktion.
async function request(path, options = {}) {
  // Hämtar headers från options om de finns.
  // Annars skapas ett tomt objekt.
  const headers = options.headers || {};

  // Hämtar användarens token.
  const token = getToken();

  // Om token finns:
  // lägg till Authorization-header automatiskt.
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Talar om för backend att vi skickar JSON-data.
  headers["Content-Type"] = "application/json";

  // Skickar själva HTTP-requesten.
  const res = await fetch(`${API_BASE}${path}`, {
    // Kopierar in allt från options.
    // Exempel:
    // method, body osv.
    ...options,

    // Skickar med våra headers.
    headers,
  });

  // Läser svaret från servern som text.
  const text = await res.text();

  // Variabel som senare ska innehålla vår data.
  let data = null;

  try {
    // Om text finns:
    // försök göra om texten till JSON.
    data = text ? JSON.parse(text) : null;
  } catch {
    // Om JSON.parse kraschar:
    // använd vanlig text istället.
    data = text;
  }

  // res.ok är false om statuskoden är fel.
  // Exempel:
  // 404
  // 401
  // 500
  if (!res.ok) {
    // Försöker hitta ett bra felmeddelande.
    const err =
      // Om backend skickade:
      // { message: "Fel" }
      (data && data.message) ||
      // Annars använd HTTP-status.
      res.statusText ||
      // Fallback om inget annat finns.
      "Request failed";

    // Skapar ett JavaScript Error.
    throw new Error(err);
  }

  // Returnerar datan om allt gick bra.
  return data;
}

// ======================
// USER REQUESTS
// ======================

// Registrerar en ny användare.
export async function register({ name, email, password }) {
  // Skickar POST-request till backend.
  return request("/users/register", {
    // HTTP-metod.
    method: "POST",

    // Gör om JavaScript-objekt till JSON-sträng.
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

// Loggar in användaren.
export async function login({ email, password }) {
  return request("/users/login", {
    method: "POST",

    // Skickar email + lösenord till backend.
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

// Hämtar alla kontakter.
export async function getContacts() {
  // GET används för att hämta data.
  return request("/contacts", {
    method: "GET",
  });
}

// Skapar en ny kontakt.
export async function createContact(contact) {
  return request("/contacts", {
    method: "POST",

    // Skickar kontakt-objektet som JSON.
    body: JSON.stringify(contact),
  });
}

// Tar bort en kontakt via ID.
export async function deleteContact(id) {
  // Exempel:
  // /contacts/5
  return request(`/contacts/${id}`, {
    method: "DELETE",
  });
}

// Uppdaterar en kontakt.
export async function updateContact(id, contact) {
  return request(`/contacts/${id}`, {
    // PUT används ofta för uppdatering.
    method: "PUT",

    // Skickar nya kontaktuppgifter.
    body: JSON.stringify(contact),
  });
}

// ======================
// AUTH FUNCTIONS
// ======================

// Loggar ut användaren.
export function logout() {
  // Tar bort token från localStorage.
  localStorage.removeItem("token");

  try {
    // Skickar ett custom event.
    // Detta säger till appen:
    // "Authentication har ändrats"
    window.dispatchEvent(new Event("authChange"));
  } catch (e) {
    // Ignorerar eventuella fel.
  }
}

// Sparar token när användaren loggat in.
export function saveToken(token) {
  // Sparar token i browsern.
  localStorage.setItem("token", token);

  try {
    // Trigger auth-event så UI kan uppdateras direkt.
    window.dispatchEvent(new Event("authChange"));
  } catch (e) {
    // Ignorerar eventuella fel.
  }
}

// Exporterar alla funktioner som ett objekt.
// Gör det möjligt att importera hela API:t enklare.
export default {
  register,
  login,
  getContacts,
  createContact,
  deleteContact,
  updateContact,
  logout,
  saveToken,
};
