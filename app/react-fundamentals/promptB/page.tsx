// Prompt B — Form Input With Live Preview

// Build a component with:

// A text input (controlled)

// A preview div displaying whatever the user types

// A “Clear” button that resets to empty

// This tests controlled components, onChange, value binding.

'use client'

import React, { useState } from "react";

export default function App() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState(0);

  return (
    <div>
      <form>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input 
        value={lastName} 
        onChange={(e) => setLastName(e.target.value)} />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
      </form>
      <div>
        <p>Your name is: {firstName} {lastName} and you are {age}</p>
      </div>
    </div>
  );
}
