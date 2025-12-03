// 1. Autocomplete Search (Debounced, Keyboard Navigation)

// Already requested — here is your working API:

// API:

// https://dummyjson.com/products/search?q=<query>

// Drill Requirements

// Controlled input

// Debounce by 300ms

// Fetch suggestions from API

// Highlight active item with ↑/↓

// Enter selects the item

// Blur closes the menu

// Loading + empty states

// Build it twice:

// Raw React state

// With useCallback + useRef cleanup patterns

"use client";

import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function App() {
  const [data, setData] = useState<Product[]>([]);
  const [input, setInput] = useState("");
  const [active, setActive] = useState<number | null>(null);

  const handleRowClick = (id: number) => {
    setActive((prev) => (prev === id ? null : id));
  };

  const debouncedInput = useDebounce(input, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    if (!debouncedInput) {
      setData([]);
    }

    async function fetchData() {
      const res = await fetch(
        `https://dummyjson.com/products/search?q=${debouncedInput}`
      );
      const json = await res.json();
      setData(json.products || []);
    }

    fetchData();
  }, [debouncedInput]);

  const filtered = data.filter((product) =>
    product.title.toLowerCase().includes(debouncedInput.toLowerCase())
  );

  return (
    <div>
      <input
        value={input}
        onChange={handleChange}
        placeholder="Type to search..."
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
          {filtered.map((product) => {
            const isActive = product.id === active;
            return (
              <tr
                key={product.id}
                style={{ color: isActive ? "green" : "black" }}
                onClick={() => handleRowClick(product.id)}
              >
                <td>{product.category}</td>
                <td>{product.title}</td>
                <td>{product.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
