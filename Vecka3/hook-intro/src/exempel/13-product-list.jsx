import React, { useState } from "react";

export default function ProductList() {
  const [products, setProducts] = useState([
    { id: 1, name: "Laptop", price: 10000 },
    { id: 2, name: "Mouse", price: 200 },
    { id: 3, name: "Keyboard", price: 800 },
  ]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "" });
  const [filter, setFilter] = useState("");

  function addProduct(e) {
    e.preventDefault();
    if (newProduct.name && newProduct.price) {
      setProducts([
        ...products,
        {
          id: Date.now(),
          name: newProduct.name,
          price: parseInt(newProduct.price),
        },
      ]);
      setNewProduct({ name: "", price: "" });
    }
  }

  function deleteProduct(id) {
    setProducts(products.filter((p) => p.id !== id));
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1>Produkter</h1>

      <form onSubmit={addProduct}>
        <input
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          placeholder="Produktnamn"
        />
        <input
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          placeholder="Pris"
        />
        <button type="submit">Lägg till</button>
      </form>

      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filtrera produkter..."
      />

      <ul>
        {filtered.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price} kr
            <button onClick={() => deleteProduct(product.id)}>Radera</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
