import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Pages.css";

/**
 * ProductDetail.js - Produktdetaljer-sidan
 *
 * Denna komponent använder DYNAMISK ROUTING med URL-parametrar
 *
 * Exempel URL: /products/1
 * Här är "1" en parameter som vi kan läsa med useParams()
 *
 * Flödet:
 * 1. useParams() läser produktens ID från URL:en
 * 2. useEffect() hämtar denna specifika produkts data från API:t
 * 3. Vi visar produkten när den är laddad
 */

function ProductDetail() {
  // useParams() läser parametrarna från URL:en
  // I App.js skapade vi roueten: path="/products/:productId"
  // Så productId är namnet på vår parameter
  const { productId } = useParams(); // Läs productId från URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  /**
   * useEffect med dependency array [productId]
   * Detta betyder: "Kör denna funktion när komponenten laddar,
   * och igen om productId ändras"
   *
   * Det är viktigt! Om användaren går från /products/1 till /products/2,
   * behöver vi hämta nya data för produkt 2.
   */

  useEffect(() => {
    // Hämta denna specifika produkts data
    setLoading(true);
    fetch(`https://dummyjson.com/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [productId]); // Kör igen om productId ändras

  if (loading) {
    return <p>Laddar produktdetaljer...</p>;
  }

  if (!product) {
    return <p>Produkten hittades inte.</p>;
  }

  const handleAddToCart = () => {
    alert(`Du la till ${quantity} st ${product.title} i kundvagnen!`);
    setQuantity(1); // Återställ kvantitet
  };

  return (
    <div className="product-detail">
      <Link to="/products">&larr; Tillbaka till produkter</Link>

      <h1>{product.title}</h1>
      <p className="price">{product.price} kr</p>
      <p className="description">{product.description}</p>
      <p className="rating">Betyg: {product.rating} ⭐</p>

      <div className="purchase-section">
        <label>
          Kvantitet:
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </label>
        <button onClick={handleAddToCart} className="btn">
          Lägg i kundvagn
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
