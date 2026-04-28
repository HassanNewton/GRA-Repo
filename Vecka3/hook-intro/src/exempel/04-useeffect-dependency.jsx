import React, { useState, useEffect } from "react";

export default function DependencyArray() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  // Körs varje gång 'count' ändras
  useEffect(() => {
    console.log("Count ändrades till:", count);
  }, [count]);

  // Körs varje gång 'name' ändras
  useEffect(() => {
    console.log("Namn ändrades till:", name);
  }, [name]);

  // Körs när ANTINGEN count eller name ändras
  useEffect(() => {
    console.log("Något ändrades!");
  }, [count, name]);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Skriv ditt namn"
      />
    </div>
  );
}
