import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Pages.css";

/**
 * Products.js - Produktlistsidan
 *
 * Denna komponent:
 * 1. Hämtar produkter från ett API när komponenten laddar (useEffect)
 * 2. Visar en loading-state medan data hämtas
 * 3. Visar en lista av produkter i ett grid-format
 * 4. Länkar till detaljsidan för varje produkt med produktens ID
 */

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulera API-anrop
    setLoading(true);
    fetch("https://dummyjson.com/products?limit=8")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Laddar produkter...</p>;
  }

  return (
    <div>
      <h1>Våra Produkter</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.title}</h3>
            <p>Pris: {product.price} kr</p>

            {/* Länka till denna specifika produkts detaljesida */}
            <Link to={`/products/${product.id}`} className="btn-small">
              Se detaljer
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
