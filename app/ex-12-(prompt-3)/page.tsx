// Prompt 3 — Search + Filter + Highlight

// TikTok uses this to test UI correctness and derived state.

// Requirements:

// Data array from API

// Search bar filters items

// Highlight matching substring visually

// Click item → show detail pane

// Handle no results

// Case-insensitive matching

// Skill signals:

// Clean derived state

// Efficient filtering

// UI polish

// Good separation of concerns

// This tests whether you can ship real product UI.

// https://dummyjson.com/products?limit=200

"use client";

import React, { useState, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  description: string;
}

function highlight(text: string, query: string): (string | JSX.Element)[] {
  if (!query) return [text];

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const parts: (string | JSX.Element)[] = [];

  let start = 0;

  while (true) {
    const index = lowerText.indexOf(lowerQuery, start);
    if (index === -1) break;

    if (index > start) {
      parts.push(text.slice(start, index));
    }

    parts.push(
      <span key={index} style={{ backgroundColor: "yellow" }}>
        {text.slice(index, index + query.length)}
      </span>
    );

    start = index + query.length;
  }

  if (start < text.length) {
    parts.push(text.slice(start));
  }

  return parts;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const showNoResults = query && !loading && data.length === 0;
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      // if (!query) {
      //   setData([]);
      //   return;
      // }

      setLoading(true);

      try {
        const res = await fetch("https://dummyjson.com/products?limit=200");

        if (!res.ok) {
          throw new Error("Failed to fetch products.");
        }

        const json = await res.json();
        setData(json.products);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unknown error.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filtered = data.filter((product) =>
    product.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-10 items-center flex flex-col">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        className="mx-auto mb-4 self-center items-center w-full"
      />
      {error && <div className="mb-2 text-red-600">{error}</div>}

      {loading && <div className="mb-2">Loading...</div>}

      {selected && (
        <div className="mt-4 border p-4 w-full bg-gray-50 mb-10 rounded-2xl">
          <h2 className="text-xl font-bold mb-2">Details</h2>
          <p>
            <strong>ID:</strong> {selected.id}
          </p>
          <p>
            <strong>Title:</strong> {selected.title}
          </p>
          <p>
            <strong>Description:</strong> {selected.description}
          </p>

          <button
            className="mt-4 px-3 py-1 bg-black text-white rounded"
            onClick={() => setSelected(null)}
          >
            Close
          </button>
        </div>
      )}

      {data.length > 0 && (
        <table className="border-collapse border mb-4">
          <thead>
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Title</th>
              <th className="border px-2 py-1">Description</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr
                key={product.id}
                onClick={() => setSelected(product)}
                className="cursor-pointer"
              >
                <td className="border px-2 py-1">{product.id}</td>
                <td className="border px-2 py-1">
                  {highlight(product.title, query)}
                </td>
                <td className="border px-2 py-1">
                  {highlight(product.description, query)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showNoResults && (
        <div className="mb-2 text-gray-600">No products found.</div>
      )}
    </div>
  );
}
