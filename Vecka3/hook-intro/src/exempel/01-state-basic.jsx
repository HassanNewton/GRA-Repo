import React, { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  function incrementCount() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Räknare: {count}</h1>
      <button onClick={incrementCount}>Öka</button>
    </div>
  );
}
