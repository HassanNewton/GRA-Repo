// 04-looping-with-map.jsx
// Användning av map() för att loopa över array

import React from 'react';
import Person from './Person';

function App() {
  const people = [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 },
    { name: 'Cersei', age: 28 }
  ];

  return (
    <div>
      <h1>Lista över personer</h1>
      {people.map((person) => (
        <Person key={person.name} name={person.name} age={person.age} />
      ))}
    </div>
  );
}

export default App;
