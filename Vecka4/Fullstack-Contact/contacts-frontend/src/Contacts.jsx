import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { logout } from "./api";

export default function Contacts() {

  // useState skapar state-variabler.
  // State används för data som kan ändras medan appen körs.

  // Lista med alla kontakter.
  const [contacts, setContacts] = useState([]);

  // Håller koll på om data fortfarande laddas.
  const [loading, setLoading] = useState(true);

  // Sparar eventuella felmeddelanden.
  const [error, setError] = useState("");

  // State för formuläret.
  // Objektet innehåller input-fältens värden.
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // useNavigate används för att byta route/sida programmatiskt.
  const navigate = useNavigate();


  // useEffect körs efter att komponenten renderats.
  // [] betyder:
  // "kör bara EN gång när komponenten startar"
  useEffect(() => {

    // Startar loading-state.
    setLoading(true);

    // Hämtar kontakter från API.
    api.getContacts()

      // .then körs om request lyckades.
      .then(data => {

        // Om data är null:
        // använd tom array istället.
        setContacts(data || []);

        // Stoppar loading.
        setLoading(false);
      })

      // .catch körs om något gick fel.
      .catch(err => {

        // Sparar felmeddelandet i state.
        setError(err.message);

        // Stoppar loading även vid error.
        setLoading(false);
      });

  }, []);


  // Körs när formuläret skickas.
  async function handleCreate(e) {

    // Förhindrar att sidan refreshas.
    e.preventDefault();

    try {

      // Skapar kontakt via API.
      const created = await api.createContact(form);

      // prev = gamla contacts-arrayen.
      // Skapar NY array med nya kontakten först.
      setContacts(prev => [created, ...prev]);

      // Återställer formuläret.
      setForm({
        name: "",
        email: "",
        phone: ""
      });

    } catch (err) {

      // Visar fel om request misslyckas.
      setError(err.message);
    }
  }


  // Tar bort kontakt.
  async function handleDelete(id) {

    try {

      // Skickar delete request till backend.
      await api.deleteContact(id);

      // filter skapar en NY array.
      // Behåller alla kontakter som INTE matchar id.
      setContacts(prev =>
        prev.filter(c =>
          c._id !== id && c.id !== id
        )
      );

    } catch (err) {

      setError(err.message);
    }
  }


  function doLogout() {

    // Tar bort token från localStorage.
    logout();

    // Skickar användaren till startsidan.
    navigate("/");
  }


  return (
    <div className="contacts-page">

      <header className="contacts-header">
        <h2>Your Contacts</h2>

        {/* onClick kör funktionen när knappen klickas */}
        <button onClick={doLogout}>
          Logout
        </button>
      </header>


      <section className="create-contact">

        <h3>Create Contact</h3>

        {/* onSubmit körs när formuläret skickas */}
        <form onSubmit={handleCreate}>

          <input
            placeholder="Name"

            // value kopplar input-fältet till state.
            value={form.name}

            // onChange körs varje gång användaren skriver.
            onChange={e =>

              // ...form kopierar gamla objektet.
              // Sedan uppdateras bara name.
              setForm({
                ...form,
                name: e.target.value
              })
            }

            required
          />


          <input
            placeholder="Email"
            value={form.email}

            onChange={e =>
              setForm({
                ...form,
                email: e.target.value
              })
            }

            type="email"
            required
          />


          <input
            placeholder="Phone"
            value={form.phone}

            onChange={e =>
              setForm({
                ...form,
                phone: e.target.value
              })
            }
          />

          <button type="submit">
            Add
          </button>
        </form>
      </section>


      {/* && används för conditional rendering.
          Om loading är true:
          visa Loading... */}
      {loading && <p>Loading...</p>}


      {/* Om error innehåller text:
          visa error-meddelandet */}
      {error && (
        <p className="error">
          {error}
        </p>
      )}


      <section className="contacts-list">

        {/* Ternary operator:
            condition ? true : false */}

        {contacts.length === 0 && !loading

          // Om inga kontakter finns.
          ? (
            <p>No contacts yet.</p>
          )

          // Annars rendera alla kontakter.
          : (
            contacts.map(c => (

              // key hjälper React identifiera element.
              <div
                key={c._id || c.id}
                className="contact-card"
              >

                <div>
                  <strong>{c.name}</strong>

                  <div>{c.email}</div>
                  <div>{c.phone}</div>
                </div>

                <div>

                  {/* Arrow function behövs här.
                      Annars skulle funktionen köras DIREKT. */}
                  <button
                    onClick={() =>
                      handleDelete(c._id || c.id)
                    }
                  >
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