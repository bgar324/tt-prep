"use client";

import React, { useState } from "react";

export default function App() {
  const items = [
    {
      q: "What is React?",
      a: "A library for building UI using components."
    },
    {
      q: "What is state?",
      a: "State is data that persists across rerenders and triggers updates."
    },
    {
      q: "What is a component?",
      a: "A reusable piece of UI that returns JSX."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = openIndex === i;

        return (
          <div key={i}>
            <button onClick={() =>
              setOpenIndex(isOpen ? null : i)
            }>
              {item.q}
            </button>

            {isOpen && (
              <div>
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
