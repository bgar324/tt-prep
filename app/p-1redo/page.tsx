// Prompt 1 — Autocomplete with API + Debounce + Keyboard Navigation

// This is the undisputed #1 TikTok FE R2 prompt.

// Requirements:

// Input box

// Calls fetchSuggestions(q)

// Debounce 300ms

// Show dropdown list

// Highlight active item with ↑ / ↓

// Select on Enter

// Hide dropdown when user clicks outside

// Handle empty + loading + error states

// Do not show stale responses

// https://dummyjson.com/products/search

"use client";

import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (data.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % data.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + data.length) % data.length);
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      setQuery(data[activeIndex].title);
      setData([]);
      setActiveIndex(-1);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    async function fetchSuggestions(q: string) {
      if (!q) {
        setData([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`https://dummyjson.com/products/search?q=${q}`, {signal : controller.signal});
        if (!res.ok) {
          throw new Error("API call not good.");
        }
        const json = await res.json();
        setData(json.products);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Error found.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchSuggestions(debouncedQuery);

    return () => controller.abort();
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e : MouseEvent){
      if(wrapperRef.current && !wrapperRef.current.contains(e.target as Node)){
        setData([]);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  })

  return (
    <div ref = {wrapperRef}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {loading ? <p>Loading...</p> : ""}
      {!error && data.length > 0 && !loading ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{product.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products match: {debouncedQuery}</p>
      )}
    </div>
  );
}
