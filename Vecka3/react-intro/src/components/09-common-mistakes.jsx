// 09-common-mistakes.jsx
// Vanliga misstag att undvika i React

import React from 'react';

// ❌ MISSTAG 1: Glömma parenteser runt JSX när det går över flera rader
// function BadComponent() {
//   return
//     <div>
//       <h1>Detta fungerar inte!</h1>
//     </div>;
// }

// ✅ RÄTT: Parenteser runt JSX
function GoodComponent() {
  return (
    <div>
      <h1>Detta fungerar!</h1>
    </div>
  );
}

// ❌ MISSTAG 2: Använda class istället för className
// function BadClass() {
//   return <div class="my-class">Fel attribut!</div>;
// }

// ✅ RÄTT: Använd className
function GoodClass() {
  return <div className="my-class">Rätt attribut!</div>;
}

// ❌ MISSTAG 3: Använda onclick istället för onClick
// function BadClick() {
//   return <button onclick={() => console.log('Klick')}>Klick mig</button>;
// }

// ✅ RÄTT: camelCase för event handlers
function GoodClick() {
  return <button onClick={() => console.log('Klick')}>Klick mig</button>;
}

// ❌ MISSTAG 4: Glömma key när man använder map()
// function BadList() {
//   const items = ['Alice', 'Bob', 'Cersei'];
//   return (
//     <ul>
//       {items.map((item) => (
//         <li>{item}</li>  // Saknar key!
//       ))}
//     </ul>
//   );
// }

// ✅ RÄTT: Alltid key när man loopat
function GoodList() {
  const items = ['Alice', 'Bob', 'Cersei'];
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

// ❌ MISSTAK 5: Använda för många props (svårt att läsa)
// function TooManyProps(props) {
//   return <div>{props.a}{props.b}{props.c}{props.d}</div>;
// }

// ✅ RÄTT: Destrukturera props
function GoodProps({ name, age, city, job }) {
  return (
    <div>
      <p>{name}, {age} år från {city}</p>
      <p>Jobbar som: {job}</p>
    </div>
  );
}

export default GoodComponent;
