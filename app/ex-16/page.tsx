// Sortable list (client-side sort + stable keys)

"use client";

import React, { useState } from "react";

interface User {
  id: number;
  name: string;
  age: number;
}

const initialData: User[] = [
  { id: 1, name: "Alice", age: 26 },
  { id: 2, name: "Bob", age: 22 },
  { id: 3, name: "Charlie", age: 30 },
];

export default function App() {
  const [items] = useState<User[]>(initialData);
  const [sortBy, setSortBy] = useState<keyof User>("id");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const sorted = [...items].sort((a, b) => {
    const x = a[sortBy];
    const y = b[sortBy];

    if (x < y) return direction === "asc" ? -1 : 1;
    if (x > y) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (field: keyof User) => {
    if (sortBy === field) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setDirection("asc");
    }
  };
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th onClick={() => toggleSort("id")}>ID</th>
            <th onClick={() => toggleSort("name")}>Name</th>
            <th onClick={() => toggleSort("age")}>Age</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
