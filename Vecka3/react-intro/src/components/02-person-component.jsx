// 02-person-component.jsx
// Enkel komponent som tar emot props

import React from 'react';

function Person(props) {
  return (
    <div>
      <h2>Namn: {props.name}</h2>
      <p>Ålder: {props.age}</p>
    </div>
  );
}

export default Person;
