// 08-child-components.jsx
// Komponenter kan innehålla andra komponenter

import React from 'react';

// Enkel kort-komponent
function Card({ title, content }) {
  const cardStyle = {
    border: '1px solid #ddd',
    padding: '20px',
    margin: '10px',
    borderRadius: '5px'
  };

  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
}

// Använd Card flera gånger
function App() {
  return (
    <div>
      <h1>Kort-exempel</h1>
      <Card title="React" content="Ett JavaScript-ramverk" />
      <Card title="Props" content="Skicka data mellan komponenter" />
      <Card title="JSX" content="HTML-syntaxen i JavaScript" />
    </div>
  );
}

export default App;
