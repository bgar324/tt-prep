// Prompt F — Todo List

// Implement:

// Input → adds item

// Remove button for each item

// Toggle complete

// Tests: list management, mapping, filtering, immutability.

"use client";

import React, { useState } from "react";

interface Todo {
  id: number;
  label: string;
  done: boolean;
}

export default function App() {
  const [todo, setTodo] = useState<Todo[]>([]);
  const [completed, setCompleted] = useState([]);
  const [item, setItem] = useState("");

  const handleSubmit = () => {
    if (!item.trim()) return;

    const newTodo = {
      id: Date.now(),
      label: item,
      done: false,
    };

    setTodo((prev) => [...prev, newTodo]);
    setItem("");
  };

  return (
    <div>
      <input value={item} onChange={(e) => setItem(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>

      {todo.map((todo) => (
        <div key={todo.id}>
          <input
            key={todo.id}
            type="checkbox"
            checked={todo.done}
            onChange={() =>
              setTodo((prev) =>
                prev.map((t) =>
                  t.id === todo.id ? { ...t, done: !t.done } : t
                )
              )
            }
          />

          <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
            {todo.label}
          </span>

          <button
            onClick={() =>
              setTodo((prev) => prev.filter((t) => t.id !== todo.id))
            }
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
