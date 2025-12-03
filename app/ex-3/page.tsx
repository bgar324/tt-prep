"use client"
import '../globals.css'

import { useState } from 'react'

const NAMES = ["Alice", "Bob", "Charlie", "David", "Evelyn", "Frank"];

export default function App(){
  const [query, setQuery] = useState("")

  const filtered = NAMES.filter(name => 
    name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input 
        value = {query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder = "Search..."
      />

      <div>
        {filtered.map((name) => (
          <div key = {name}>{name}</div>
        ))}
      </div>
    </div>
  )
}