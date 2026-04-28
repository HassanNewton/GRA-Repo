import React, { useState } from "react";

export default function StateExamples() {
  const [name, setName] = useState("Alice");
  const [isVisible, setIsVisible] = useState(true);
  const [user, setUser] = useState({ age: 25, city: "Stockholm" });

  return (
    <div>
      <p>Namn: {name}</p>
      <button onClick={() => setName("Bob")}>Byt namn</button>

      {isVisible && <p>Du ser denna text!</p>}
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "Göm" : "Visa"}
      </button>

      <p>
        {user.name} är {user.age} år gammal
      </p>
      <button onClick={() => setUser({ ...user, age: user.age + 1 })}>
        Bli äldre
      </button>
    </div>
  );
}
