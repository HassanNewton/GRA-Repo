import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

// useAuth() importeras från Context istället för att importera logout direkt från api.js.
import { useAuth } from "./AuthContext";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const navigate = useNavigate();

  // logout-funktionen kommer från AuthContext.
  // Den kör apiLogout() + setAuthed(false) inuti sig.
  const { logout } = useAuth();

  useEffect(() => {
    setLoading(true);
    api.getContacts()
      .then(data => {
        setContacts(data || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const created = await api.createContact(form);
      setContacts(prev => [created, ...prev]);
      setForm({ name: "", email: "", phone: "" });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteContact(id);
      setContacts(prev => prev.filter(c => c._id !== id && c.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  function doLogout() {
    // Tidigare: logout()  ← importerades direkt från api.js
    // Nu:       logout()  ← kommer från AuthContext
    //
    // Skillnaden: Context sätter setAuthed(false) direkt.
    // App.js och navbaren uppdateras automatiskt utan window-events.
    logout();

    navigate("/");
  }

  return (
    <div className="contacts-page">
      <header className="contacts-header">
        <h2>Your Contacts</h2>
        <button onClick={doLogout}>Logout</button>
      </header>

      <section className="create-contact">
        <h3>Create Contact</h3>
        <form onSubmit={handleCreate}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            type="email"
            required
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
          <button type="submit">Add</button>
        </form>
      </section>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <section className="contacts-list">
        {contacts.length === 0 && !loading ? (
          <p>No contacts yet.</p>
        ) : (
          contacts.map(c => (
            <div key={c._id || c.id} className="contact-card">
              <div>
                <strong>{c.name}</strong>
                <div>{c.email}</div>
                <div>{c.phone}</div>
              </div>
              <div>
                <button onClick={() => handleDelete(c._id || c.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
