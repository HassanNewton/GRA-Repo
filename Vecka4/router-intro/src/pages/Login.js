import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pages.css';

/**
 * Login.js - Inloggningssidan
 * 
 * Denna komponent demonstrerar useNavigate hook
 * useNavigate låter oss navigera programmatiskt (med kod)
 * istället för bara genom att klicka på länkar
 * 
 * I det här exemplet navigerar vi bara efter verifiering
 */

function Login() {
  // State för lösenord
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  // State för att visa fel
  const [error, setError] = useState('');
  
  // State för loading
  const [loading, setLoading] = useState(false);
  
  // useNavigate returnerar en funktion vi kan använda för att navigera
  const navigate = useNavigate();

  /**
   * handleLogin()
   * Denna funktion körs när användaren klickar "Logga in"
   * 
   * VIKTIGT: Här använder vi navigate() för att navigera EFTER verifiering
   * Det är skillnaden från Link - vi kan köra kod innan navigering
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Rensa tidigare felmeddelanden
    setError('');
    setLoading(true);

    // Simulera API-anrop
    setTimeout(() => {
      // Enkel verifiering (i verkligheten skulle detta gå till en server)
      if (email && password === '1234') {
        // Om lösenordet stämmer, navigera till dashboard
        // navigate() tar en path som parameter
        navigate('/');
        // Du kan också navigera med options: navigate('/', { replace: true })
      } else if (!email || !password) {
        setError('Vänligen fyll i både email och lösenord');
      } else {
        setError('Felaktigt lösenord eller email');
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="page-container login-page">
      <div className="login-box">
        <h1>Logga in</h1>
        <p className="login-info">Använd lösenord: <strong>1234</strong> för test</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="din@email.se"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Lösenord:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ange lösenord"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="btn"
            disabled={loading}
          >
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>

        <div className="login-tips">
          <p>💡 <strong>Test-tips:</strong></p>
          <p>Använd vilket email som helst</p>
          <p>Lösenord: <code>1234</code></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
