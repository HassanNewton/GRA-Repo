import React, { useState } from "react";

export default function ToggleExample() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div>
      <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? "Stäng meny" : "Öppna meny"}
      </button>

      {isMenuOpen && (
        <nav>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </nav>
      )}

      <div>
        <button onClick={() => setActiveTab("home")}>Home</button>
        <button onClick={() => setActiveTab("about")}>About</button>
        <button onClick={() => setActiveTab("contact")}>Contact</button>
      </div>

      {activeTab === "home" && <p>Välkommen till Home!</p>}
      {activeTab === "about" && <p>Vi är ett fantastiskt företag</p>}
      {activeTab === "contact" && <p>Email: info@example.com</p>}
    </div>
  );
}
