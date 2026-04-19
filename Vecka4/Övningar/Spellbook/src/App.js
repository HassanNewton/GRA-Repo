import "./App.css";
import Spell from "./components/Spell";
import SpellBook from "./components/SpellBook";
import AddSpellForm from "./components/AddSpellForm";

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <h1>Welcome to the Spellbook</h1>
      <SpellBook /> {/* Rendera SpellBook-komponenten */}
    </div>
  );
}

export default App;
