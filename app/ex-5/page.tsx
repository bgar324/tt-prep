"use client";

import React, { useState, useEffect, useMemo } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
}

function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timer: any;
  return function (...args: Parameters<T>) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function App() {
  const [data, setData] = useState<Product[]>([]);
  const [query, setQuery] = useState("");       // debounced
  const [inputValue, setInputValue] = useState(""); // immediate

  const debouncedSetQuery = useMemo(
    () => debounce((value: string) => setQuery(value), 300),
    []
  );

  useEffect(() => {
    if (!query) {
      setData([]);
      return;
    }

    async function fetchData() {
      const res = await fetch(
        `https://dummyjson.com/products/search?q=${query}`
      );
      const json = await res.json();
      setData(json.products || []);
    }

    fetchData();
  }, [query]);

  const filtered = data.filter((product) =>
    product.title.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);       // immediate
          debouncedSetQuery(e.target.value);   // debounced API call
        }}
      />

      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>description</th>
            <th>price</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
