/**
 * USERCARD KOMPONENT
 * 
 * PEDAGOGISK FÖRKLARING:
 * Det är bäst att dela upp stora komponenter i mindre, återanvändbara delar.
 * Varje användare får sin egen UserCard komponent.
 * 
 * FÖRDELAR:
 * - Lättare att läsa och underhålla
 * - Kan återanvändas på andra ställen
 * - Animationer fungerar bättre på enskilda kort
 * - Lättare att testa
 * 
 * PROPS vi får från förälder (SignupForm):
 * - user: Objektet med firstName, lastName, email, id
 * - onEdit: Funktion för att redigera
 * - onDelete: Funktion för att ta bort
 * - isEditing: Boolean - visar om denna användare redigeras
 */

import React from "react";
import "./UserCard.css";

function UserCard({ user, onEdit, onDelete, isEditing }) {
  return (
    <div className={`user-card ${isEditing ? "editing" : ""}`}>
      {/* 
        ANVÄNDARES INFORMATION
        Vi visar firstName, lastName och email från user-objektet
      */}
      <div className="user-info">
        <h3 className="user-name">
          {user.firstName} {user.lastName}
        </h3>
        <p className="user-email">
          <strong>E-post:</strong> {user.email}
        </p>
      </div>

      {/* 
        ÅTGÄRDS-KNAPPAR
        Två knappar: Redigera och Ta bort
        
        Krav 6: Ta bort knapp
        - Anropar onDelete() med användarens ID
        - Tar bort användaren från listan
        
        BONUS: Redigera knapp
        - Anropar onEdit() med användarens data
        - Fyller formulären med användarens nuvarande info
      */}
      <div className="user-actions">
        <button 
          className="edit-button"
          onClick={() => onEdit(user)}
          title="Redigera denna användare"
        >
         Redigera
        </button>

        <button
          className="delete-button"
          onClick={() => onDelete(user.id)}
          title="Ta bort denna användare"
        >
         Ta bort
        </button>
      </div>
    </div>
  );
}

export default UserCard;
