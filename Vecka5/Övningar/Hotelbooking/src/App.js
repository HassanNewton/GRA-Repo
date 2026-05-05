import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchHotel from './pages/SearchHotel';
import BookHotel from './pages/BookHotel';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <h1>Välkommen till Hotellbokningen</h1>
        <Routes>
          <Route path="/" element={<SearchHotel />} />
          <Route path="/hotels/:hotelId" element={<BookHotel />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
