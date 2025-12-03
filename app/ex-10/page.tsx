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

// Skill signals they look for:

// Async correctness

// Event handling depth

// Derived state

// UX correctness

// Clean code under pressure

// This is the flagship prompt for Product Infra FE.

// https://dummyjson.com/products/search

"use client"

import React, { useState, useEffect } from 'react'

interface Product{
  id : number;
  title : string;
  description : string;
}

function useDebounce<T>(value : T, delay : number) : T{
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay])
  return debouncedValue;
}

export default function App(){
  const [data, setData] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if(!debouncedQuery) {
      setData([]);
      return;
    }

    async function fetchProducts(){
      const res = await fetch(`https://dummyjson.com/products/search?q=${debouncedQuery}`);
      const json = await res.json();
      setData(json.products);
    }

    fetchProducts();
  }, [debouncedQuery]);

  const filtered = data.filter((product) => product.title.toLowerCase().includes(debouncedQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Search</h1>

        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {filtered.length > 0 && (
            <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-10">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <h2 className="font-semibold text-gray-900 mb-1">{product.title}</h2>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}