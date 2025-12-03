"use client";

// 5. FILTER + SORT LIST (EASY VERSION)

// Prompt:
// “Given an array of users (name, age), build a UI to:
// (1) filter by name substring
// (2) sort by age asc/desc.”

// Requirements:

// Search box

// Asc/desc toggle button

// Dynamic re-render

import React, { useState } from "react";

export const USERS = [
  { name: "Alice Johnson", age: 24 },
  { name: "Bob Martinez", age: 31 },
  { name: "Charlie Kim", age: 19 },
  { name: "Diana Patel", age: 28 },
  { name: "Ethan Chen", age: 35 },
  { name: "Fiona Garcia", age: 22 },
  { name: "George Smith", age: 40 },
  { name: "Hannah Nguyen", age: 27 },
  { name: "Ivan Rodriguez", age: 33 },
  { name: "Julia Thompson", age: 29 },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [asc, setAsc] = useState(true);

  const filtered = USERS.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  ).slice().sort((a, b) => {
      if (asc) return a.age - b.age;
      return b.age - a.age;
    });

  return (
    <>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
      />
      <button onClick={() => setAsc((prev) => !prev)}>
        Sort by age {asc ? "ASC" : "DESC"}
      </button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>  
          </tr>
        </thead>
        <tbody>
          {filtered.map((user) => (
            <tr key = {user.age}>
              <td>{user.name}</td>
              <td>{user.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
