/**
 * API-SIMPLE.JS
 *
 * PEDAGOGISK UTGÅNGSPUNKT - Visar "den gamla/längre sättet"
 * Här har varje metod sin egen fetch-logic (repeterad kod)
 *
 * JÄMFÖR MED api.js för att se skillnaden och varför
 * en wrapper-funktion (request()) är bättre!
 *
 * PROBLEM MED DENNA APPROACH:
 * ❌ Mycket repeterad kod (Copy-Paste överallt)
 * ❌ Svårt att ändra error-handling på ett ställe
 * ❌ Svårt att lägga till nya features (t.ex. retry-logik)
 * ❌ Token-hantering duplicerad i varje funktion
 * ❌ Headers-setup duplicerad överallt
 */

const API_BASE = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!getToken();
}

// ============================================
// REGISTER - Helt egen fetch-implementering
// ============================================
export async function register({ name, email, password }) {
  const url = `${API_BASE}/users/register`;
  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ name, email, password }),
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const errorMessage =
      (data && data.message) || response.statusText || "Request failed";
    throw new Error(errorMessage);
  }

  return data;
}

// ============================================
// LOGIN - Helt egen fetch-implementering
// ============================================
export async function login({ email, password }) {
  const url = `${API_BASE}/users/login`;
  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ email, password }),
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const errorMessage =
      (data && data.message) || response.statusText || "Request failed";
    throw new Error(errorMessage);
  }

  return data;
}

// ============================================
// GET CONTACTS - Helt egen fetch-implementering
// ============================================
export async function getContacts() {
  const url = `${API_BASE}/contacts`;
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };

  // Lägga till token i header om det finns
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const errorMessage =
      (data && data.message) || response.statusText || "Request failed";
    throw new Error(errorMessage);
  }

  return data;
}

// ============================================
// CREATE CONTACT - Helt egen fetch-implementering
// ============================================
export async function createContact(contact) {
  const url = `${API_BASE}/contacts`;
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };

  // Lägga till token i header om det finns
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(contact),
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const errorMessage =
      (data && data.message) || response.statusText || "Request failed";
    throw new Error(errorMessage);
  }

  return data;
}

// ============================================
// DELETE CONTACT - Helt egen fetch-implementering
// ============================================
export async function deleteContact(id) {
  const url = `${API_BASE}/contacts/${id}`;
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };

  // Lägga till token i header om det finns
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "DELETE",
    headers: headers,
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const errorMessage =
      (data && data.message) || response.statusText || "Request failed";
    throw new Error(errorMessage);
  }

  return data;
}

// ============================================
// UPDATE CONTACT - Helt egen fetch-implementering
// ============================================
export async function updateContact(id, contact) {
  const url = `${API_BASE}/contacts/${id}`;
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };

  // Lägga till token i header om det finns
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(contact),
  });

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const errorMessage =
      (data && data.message) || response.statusText || "Request failed";
    throw new Error(errorMessage);
  }

  return data;
}

// ============================================
// LOGOUT
// ============================================
export function logout() {
  localStorage.removeItem("token");
  try {
    window.dispatchEvent(new Event("authChange"));
  } catch (e) {}
}

// ============================================
// SAVE TOKEN
// ============================================
export function saveToken(token) {
  localStorage.setItem("token", token);
  try {
    window.dispatchEvent(new Event("authChange"));
  } catch (e) {}
}

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
