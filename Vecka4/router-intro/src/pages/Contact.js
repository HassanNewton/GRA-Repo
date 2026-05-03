import React, { useState } from 'react';
import './Pages.css';

/**
 * Contact.js - Kontaktsidan
 * 
 * Denna komponent visar en enkel kontaktform.
 * Den använder useState för att hantera formulärdata.
 */

function Contact() {
  // State för formulärdata
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  // State för att visa bekräftelse
  const [submitted, setSubmitted] = useState(false);

  /**
   * handleChange()
   * Denna funktion körs när användaren skriver i ett inputfält
   * Den uppdaterar state med det som användaren skriver
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Uppdatera state - behåll gamla värden och uppdatera bara det som ändrades
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * handleSubmit()
   * Denna funktion körs när användaren klickar "Skicka"
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Förhindra sida-omladdning
    
    // I en riktig app skulle vi skicka detta till en server här
    console.log('Formulär skickat:', formData);
    
    // Visa bekräftelse
    setSubmitted(true);
    
    // Rensa formuläret
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    
    // Dölj bekräftelse efter 5 sekunder
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="page-container contact-page">
      <h1>Kontakta oss</h1>
      <p className="section-intro">Vi svarar normalt inom 24 timmar</p>

      <div className="contact-content">
        {/* Kontaktinformation */}
        <div className="contact-info">
          <h3>Kontaktinformation</h3>
          
          <div className="info-item">
            <h4>📧 Email</h4>
            <p>hej@minbutik.se</p>
          </div>
          
          <div className="info-item">
            <h4>📞 Telefon</h4>
            <p>+46 (0) 8 123 45 67</p>
          </div>
          
          <div className="info-item">
            <h4>📍 Adress</h4>
            <p>Huvudvägen 1<br/>100 00 Stockholm</p>
          </div>
          
          <div className="info-item">
            <h4>🕐 Öppettider</h4>
            <p>Mån-Fre: 09:00 - 17:00<br/>Lör-Sön: Stängt</p>
          </div>
        </div>

        {/* Kontaktformulär */}
        <div className="contact-form">
          <h3>Skicka ett meddelande</h3>
          
          {submitted ? (
            <div className="form-success">
              <p>✓ Tack för ditt meddelande! Vi återkommer så snart vi kan.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Namn:</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ditt namn"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="din@email.se"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Meddelande:</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Skriv ditt meddelande här..."
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn">
                Skicka meddelande
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;
