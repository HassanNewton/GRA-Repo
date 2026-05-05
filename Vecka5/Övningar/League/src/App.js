import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Parent from './Components/Parent';
import CharacterDetail from './Components/CharacterDetail';
import RegionDetail from './Components/RegionDetail'

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Parent />} />
        <Route path="/character/:id" element={<CharacterDetail />} />
        <Route path="/region/:id" element={<RegionDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
