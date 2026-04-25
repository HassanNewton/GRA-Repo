// 06-classname-styling.jsx
// Styling med className - koppla till en CSS-fil

import React from 'react';
import './Person.css';

function PersonWithClass(props) {
  return (
    <div className="person-card">
      <h2 className="person-name">{props.name}</h2>
      <p className="person-age">Ålder: {props.age}</p>
    </div>
  );
}

export default PersonWithClass;

/* 
Motsvarande CSS i Person.css:

.person-card {
  background-color: #e8f4f8;
  padding: 15px;
  margin: 10px;
  border-radius: 5px;
  border: 2px solid #0066cc;
}

.person-name {
  color: #0066cc;
  font-size: 20px;
  margin-bottom: 10px;
}

.person-age {
  color: #666;
  font-size: 16px;
}
*/
