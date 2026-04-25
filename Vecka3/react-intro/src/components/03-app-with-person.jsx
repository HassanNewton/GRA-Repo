// 03-app-with-person.jsx
// Parent-komponent som renderar Person två gånger

import React from 'react';
import Person from './Person';

function App() {
  return (
    <div>
      <h1>Mina personer</h1>
      <Person name="Alice" age="25" />
      <Person name="Bob" age="30" />
    </div>
  );
}

export default App;
