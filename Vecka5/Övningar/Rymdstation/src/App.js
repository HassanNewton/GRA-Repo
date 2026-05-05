import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SectionDetails from './Components/SectionDetail';
import Portal from './Components/Portal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/section/:id" element={<SectionDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
