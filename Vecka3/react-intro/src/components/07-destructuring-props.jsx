// 07-destructuring-props.jsx
// Destrukturering gör koden renare

// INNAN - Utan destrukturering
function PersonBefore(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Ålder: {props.age}</p>
    </div>
  );
}

// EFTER - Med destrukturering
function PersonAfter({ name, age }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Ålder: {age}</p>
    </div>
  );
}

export default PersonAfter;
