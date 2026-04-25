/**
 * KRAV CHECKLISTOR:
 * ✓ 1. Visa användarens input direkt (två-vägs binding med useState)
 * ✓ 2. Sign Up-knapp med validering (aktiveras endast om formulär är giltigt)
 * ✓ 3. Visa alla registrerade användare (.map() looping)
 * ✓ 4. Styling med className/inline styles (dynamisk CSS baserat på state)
 * ✓ 5. Inputvalidering (namn 3+ chars, giltig email, inga tomma fält)
 * ✓ 6. Ta bort användare (Delete-knapp med filter())
 * ✓ 7. Bonus: Redigera, localStorage, animationer
 */

import React, { useState, useEffect } from "react";
import "./SignupForm.css"; // Vi använder extern CSS för styling
import UserCard from "./UserCard"; // Separat komponent för varje användare

function SignupForm() {
  // ================================
  // 1. STATE FÖR FORMULÄR
  // ================================
  // Vi behöver hålla reda på vad användaren skriver i formulären
  // "form" är ett objekt med firstName, lastName och email
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // ================================
  // 2. STATE FÖR FELMEDDELANDEN
  // ================================
  // Vi sparar vilka fält som har fel
  // Ex: { firstName: "Måste vara minst 3 tecken", email: "Ogiltig email" }
  const [errors, setErrors] = useState({});

  // ================================
  // 3. STATE FÖR REGISTRERADE ANVÄNDARE
  // ================================
  // Denna array sparar alla användare som signat upp
  // Varje användare är ett objekt med { firstName, lastName, email, id }
  const [users, setUsers] = useState([]);

  // ================================
  // 4. STATE FÖR REDIGERING (BONUS)
  // ================================
  // När användaren klickar "Edit" lagrar vi ID:t på användaren som redigeras
  const [editingId, setEditingId] = useState(null);

  // ================================
  // USEEFFECT - HÄMTA FRÅN LOCALSTORAGE VID SIDLADDNING
  // ================================
  // BONUS: Vi laddar sparade användare från localStorage när sidan laddar
  // Denna körs bara EN gång på mount (tom dependency array [])
  useEffect(() => {
    const savedUsers = localStorage.getItem("signupUsers");
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error("Fel vid laddning från localStorage:", error);
      }
    }
  }, []);

  // ================================
  // USEEFFECT - SPARA TILL LOCALSTORAGE
  // ================================
  // BONUS: Varje gång 'users' ändras, sparar vi till localStorage
  // Denna körs när 'users' ändras (users i dependency array)
  useEffect(() => {
    localStorage.setItem("signupUsers", JSON.stringify(users));
  }, [users]);

  // ================================
  // VALIDERINGSFUNKTION
  // ================================
  // Krav 5: Vi validerar formulären enligt reglerna:
  // - Ingen kan vara tom
  // - Namn måste vara minst 3 tecken
  // - Email måste innehålla @
  // 
  // Returnerar ett objekt med felmeddelanden
  // Om allt är okej, returnar vi en tom object {}
  function validateForm(formData) {
    const newErrors = {};

    // Validera förnamn
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Förnamn är obligatoriskt";
    } else if (formData.firstName.trim().length < 3) {
      newErrors.firstName = "Förnamn måste vara minst 3 tecken";
    }

    // Validera efternamn
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Efternamn är obligatoriskt";
    } else if (formData.lastName.trim().length < 3) {
      newErrors.lastName = "Efternamn måste vara minst 3 tecken";
    }

    // Validera email
    // Vi använder en enkel regex för att kontrollera email-format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "E-postadress är obligatorisk";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "E-postadressen är ogiltig";
    }

    return newErrors;
  }

  // ================================
  // HANTERA INPUT-ÄNDRINGAR
  // ================================
  // Krav 1: Två-vägs binding - vad användaren skriver syns direkt
  // 
  // Denna funktion körs varje gång användaren skriver i ett input-fält
  // Vi uppdaterar 'form' state och rensar felmeddelanden för det fältet
  function handleInputChange(e) {
    const { name, value } = e.target;
    // Uppdatera form-state
    setForm({
      ...form,       // Behåll gamla värden
      [name]: value, // Uppdatera bara detta fält (firstName, lastName eller email)
    });
    // Rensa felmeddelandet för detta fält (så användaren ser det är rätt om de skriver om)
    setErrors({
      ...errors,
      [name]: "", // Sätt felets meddelande till tom sträng
    });
  }

  // ================================
  // VALIDERA OCH SPARA ANVÄNDARE
  // ================================
  // Krav 2 & 5: Knappen klickas, vi validerar och sparar
  // 
  // Denna funktion:
  // 1. Validerar formulären
  // 2. Om fel -> visa felmeddelanden
  // 3. Om okej -> lägg till i users array
  // 4. Rensa formulären
  function handleSubmit(e) {
    e.preventDefault(); // Stoppa vanlig form submit (page reload)

    // Validera
    const validationErrors = validateForm(form);

    // Om det finns fel, visa dem och returnera (stoppa spara)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Om vi redigerar en befintlig användare
    if (editingId) {
      setUsers(
        users.map((user) =>
          user.id === editingId
            ? { ...form, id: editingId } // Uppdatera den här användaren
            : user // Behåll övriga användare
        )
      );
      setEditingId(null); // Sluta redigera
    } else {
      // Om vi lägger till ny användare
      const newUser = {
        ...form,
        id: Date.now(), // Unikt ID baserat på tiden (enkelt men funkar för denna uppgift)
      };
      setUsers([...users, newUser]); // Lägg till i users array
    }

    // Rensa formulären för nästa användare
    setForm({
      firstName: "",
      lastName: "",
      email: "",
    });
    setErrors({});
  }

  // ================================
  // BÖRJA REDIGERA ANVÄNDARE (BONUS)
  // ================================
  // Denna funktion kallas när man klickar "Edit" på en användare
  // Vi fyller formulären med användarens nuvarande data
  function handleEdit(user) {
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
    setEditingId(user.id); // Spara att vi redigerar denna användare
  }

  // ================================
  // TA BORT ANVÄNDARE
  // ================================
  // Krav 6: Denna funktion kallas när man klickar "Delete"
  // Vi använder filter() för att ta bort användaren med matchande ID
  function handleDelete(id) {
    setUsers(users.filter((user) => user.id !== id));
  }

  // ================================
  // KONTROLLERA OM FORMULÄR ÄR GILTIGT
  // ================================
  // Krav 2: Knappen ska endast vara aktiv om formulären är giltigt
  // Vi validerar och kollar om det finns några fel
  const isFormValid = Object.keys(validateForm(form)).length === 0;

  // ================================
  // RENDERERING
  // ================================
  return (
    <div className="signup-container">
      <h1>Registrera dig här! 🚀</h1>

      {/* FORMULÄR */}
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>{editingId ? "Redigera användare" : "Skapa ett konto"}</h2>

        {/* FÖRNAMN INPUT */}
        <div className="form-group">
          <label htmlFor="firstName">Förnamn:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleInputChange}
            // Krav 4: Styling - röd kant om fel
            className={`form-input ${errors.firstName ? "input-error" : ""}`}
            placeholder="Skriv ditt förnamn"
          />
          {/* Krav 5: Visa felmeddelande om det finns */}
          {errors.firstName && (
            <p className="error-message">{errors.firstName}</p>
          )}
        </div>

        {/* EFTERNAMN INPUT */}
        <div className="form-group">
          <label htmlFor="lastName">Efternamn:</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleInputChange}
            // Krav 4: Styling - röd kant om fel
            className={`form-input ${errors.lastName ? "input-error" : ""}`}
            placeholder="Skriv ditt efternamn"
          />
          {/* Krav 5: Visa felmeddelande om det finns */}
          {errors.lastName && (
            <p className="error-message">{errors.lastName}</p>
          )}
        </div>

        {/* EMAIL INPUT */}
        <div className="form-group">
          <label htmlFor="email">E-postadress:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            // KVar 4: Styling - röd kant om fel
            className={`form-input ${errors.email ? "input-error" : ""}`}
            placeholder="namn@exempel.com"
          />
          {/* Krav 5: Visa felmeddelande om det finns */}
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        {/* SUBMIT-KNAPP */}
        {/* Krav 2: Knappen är bara aktiv (enabled) om formulären är giltigt */}
        <button
          type="submit"
          className="submit-button"
          disabled={!isFormValid} // Inaktiv om formulären inte är giltigt
        >
          {editingId ? "Uppdatera användare" : "Skapa konto"}
        </button>

        {/* Avbryt redigering-knapp */}
        {editingId && (
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setEditingId(null);
              setForm({ firstName: "", lastName: "", email: "" });
              setErrors({});
            }}
          >
            Avbryt
          </button>
        )}
      </form>

      {/* LISTA MED REGISTRERADE ANVÄNDARE */}
      <div className="users-section">
        <h2>Registrerade användare ({users.length})</h2>

        {/* Krav 3: Visa alla användare med .map() */}
        {users.length === 0 ? (
          <p className="no-users">Ingen har registrerat sig än. Var först!</p>
        ) : (
          <div className="users-grid">
            {users.map((user) => (
              // Vi använder en separat komponent för varje användare (bästa praktik)
              // Tips: Skapa en UserCard.jsx fil
              <UserCard
                key={user.id}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isEditing={editingId === user.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SignupForm;
