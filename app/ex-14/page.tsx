"use client";

import React, { useState, useEffect, useRef } from "react";

interface Product {
  id: number;
  title: string;
}

export default function Autocomplete() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const [activeIndex, setActiveIndex] = useState(-1); // for keyboard highlight
  const lastFetchId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce the query
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);


  // Fetch when debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchId = ++lastFetchId.current;

    async function search() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `https://dummyjson.com/products/search?q=${debouncedQuery}`
        );

        // stale response guard
        if (fetchId !== lastFetchId.current) return;

        if (!res.ok) throw new Error("Failed to fetch");

        const json = await res.json();
        setResults(json.products || []);
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      } finally {
        if (fetchId === lastFetchId.current) {
          setLoading(false);
          setOpen(true);
        }
      }
    }

    search();
  }, [debouncedQuery]);


  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : 0
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : results.length - 1
      );
    }

    if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < results.length) {
        setQuery(results[activeIndex].title);
        setOpen(false);
      }
    }
  };


  // Click-outside to close
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);


  return (
    <div ref={containerRef} style={{ width: 320, margin: "40px auto" }}>
      <input
        style={{ width: "100%", padding: "8px" }}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(-1);
          setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search products..."
      />

      {open && (
        <div
          style={{
            border: "1px solid #ccc",
            borderTop: "none",
            position: "absolute",
            width: 320,
            background: "white",
            zIndex: 10,
          }}
        >
          {loading && <div style={{ padding: 8 }}>Loading...</div>}
          {error && <div style={{ padding: 8 }}>Error: {error}</div>}
          {!loading && results.length === 0 && (
            <div style={{ padding: 8 }}>No results</div>
          )}

          {!loading &&
            results.map((p, idx) => (
              <div
                key={p.id}
                onMouseDown={() => {
                  setQuery(p.title);
                  setOpen(false);
                }}
                style={{
                  padding: "8px",
                  background: idx === activeIndex ? "#eee" : "white",
                  cursor: "pointer",
                }}
              >
                {p.title}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
