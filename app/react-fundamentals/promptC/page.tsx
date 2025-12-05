// Prompt C — Password Visibility Toggle

// Input + button that toggles between type="password" and type="text".

// Tests understanding of rerender triggers + boolean state.

'use client'

import React, { useState } from 'react'

export default function App(){
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("")

  return(
    <div>
      <input 
        value = {password}
        type = {show ? "text" : "password"}
        onChange = {(e) => setPassword(e.target.value)}
      />
      <button 
        onClick = {() => setShow(prev => !prev)}
      >
        Show Password
      </button>
    </div>
  )
}