// 05-inline-styling.jsx
// Inline CSS-styling i React

import React from 'react';

function StyledPerson(props) {
  const personStyle = {
    backgroundColor: '#e8f4f8',
    padding: '15px',
    margin: '10px',
    borderRadius: '5px',
    border: '2px solid #0066cc'
  };

  const nameStyle = {
    color: '#0066cc',
    fontSize: '20px',
    marginBottom: '10px'
  };

  const ageStyle = {
    color: '#666',
    fontSize: '16px'
  };

  return (
    <div style={personStyle}>
      <h2 style={nameStyle}>{props.name}</h2>
      <p style={ageStyle}>Ålder: {props.age}</p>
    </div>
  );
}

export default StyledPerson;
