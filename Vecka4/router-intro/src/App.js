import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";

import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        {/* Navigation - denna syns på alla sidor */}
        <nav className="navbar">
          <h2>Min Butik</h2>
          <div className="nav-links">
            <Link to="/">Hem</Link>
            <Link to="/products">Produkter</Link>
          </div>
        </nav>

        {/* Huvudinnehål - ändras baserat på route */}
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:productId" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer - denna syns också på alla sidor */}
        <footer className="footer">
          <p>&copy; 2024 Min Butik. Alla rättigheter reserverade.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
