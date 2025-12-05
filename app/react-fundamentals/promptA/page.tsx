// 1. State + Controlled Components
// Prompt A — Basic Counter

// Implement a <Counter /> component with:

// A number displayed

// “+” and “–” buttons

// A prop initial that sets the default value

// A reset button restoring the counter to initial

// This tests: controlled state, re-renders, props vs state.

'use client'

import React, { useState } from 'react'

export default function App(){
  const [count, setCount] = useState(0);

  return (
    <div className = "flex flex-col gap-4">
      <h1>{count}</h1>
      <div className = "flex flex-row gap-2">
        <button onClick = {() => setCount((prev) => Math.max(0, prev - 1))}>
          -
        </button>
        <button onClick = {() => setCount((prev) => prev + 1)}>
          +
        </button>
        <button onClick = {() => setCount(0)}>Reset Counter</button>
      </div>
    </div>

  )
}