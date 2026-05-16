const API_BASE = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
}
export function isAuthenticated() {
  return !!getToken();
}

async function request(path, options = {}) {
  const headers = options.headers || {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const err = (data && data.message) || res.statusText || "Request failed";
    throw new Error(err);
  }
  return data;
}

export async function register({ name, email, password }) {
  return request("/users/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function login({ email, password }) {
  return request("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getContacts() {
  return request("/contacts", { method: "GET" });
}

export async function createContact(contact) {
  return request("/contacts", {
    method: "POST",
    body: JSON.stringify(contact),
  });
}

export async function deleteContact(id) {
  return request(`/contacts/${id}`, { method: "DELETE" });
}

export async function updateContact(id, contact) {
  return request(`/contacts/${id}`, {
    method: "PUT",
    body: JSON.stringify(contact),
  });
}

export function logout() {
  localStorage.removeItem("token");
  try {
    window.dispatchEvent(new Event("authChange"));
  } catch (e) {}
}

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
