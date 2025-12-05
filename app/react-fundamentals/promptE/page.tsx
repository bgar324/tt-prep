// Prompt E — Sortable List (Client-Side Only)

// Given an array of items in state, implement:

// A list of items

// Two buttons: Sort Asc / Sort Desc

// Ensure stable keys and no re-renders bugs

// No external library

// Tests: pure state updates, immutability, keys discipline.

"use client";

import React, { useState } from "react";

const initialItems = [
  { id: 1, label: "Banana" },
  { id: 2, label: "Apple" },
  { id: 3, label: "Orange" },
  { id: 4, label: "Grape" },
  { id: 5, label: "Mango" },
];

export default function App() {
  const sortAsc = () => {
    setData((prev) => [...prev].sort((a,b) => b.label.localeCompare(a.label)))
  }

  const sortDesc = () => {
    setData((prev) => [...prev].sort((a, b) => b.label.localeCompare(a.label)));
  };
  const [data, setData] = useState([...initialItems]);
  return (
    <div>
      {data.map((fruit) => (
        <h1 key={fruit.id}>{fruit.label}</h1>
      ))}
      <button onClick = {sortAsc}>Sort Asc</button>
      <button onClick = {sortDesc}>Sort Desc</button>
    </div>
  );
}
