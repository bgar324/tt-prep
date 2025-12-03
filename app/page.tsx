'use client'

import React, { useState, useEffect, useRef } from "react";

const OPTIONS = ["Apple", "Banana", "Orange"];

export default function App() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  function handleSelect(option: string) {
    setSelected(option);
    setOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: 200 }}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        style={{
          width: "100%",
          padding: "8px",
          border: "1px solid #ccc",
          background: "white",
          textAlign: "left",
        }}
      >
        {selected ?? "Select..."}
      </button>
      {open && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {OPTIONS.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              style={{
                padding: "8px",
                cursor: "pointer",
                background: selected === option ? "#eee" : "white",
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
