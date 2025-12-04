'use client'

import React, { useState, useEffect, useRef } from "react";

export default function App() {
  const [dark, setDark] = useState(false);
  const [party, setParty] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const toggleDark = () => setDark((prev) => !prev);

  useEffect(() => {
    if(party){
      intervalRef.current = window.setInterval(() => {
        setDark((prev) => !prev);
      }, 1000)
    } else {
      if(intervalRef.current !== null){
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if(intervalRef.current !== null){
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [party])

  return (
    <div style={{
      background : dark ? "black" : "white",
      color: dark ? "white" : "black"
    }}>
      <button onClick = {toggleDark}>{dark ? <div>Set Light</div> : <div>Set Dark</div>}</button>
      <button onClick = {() => setParty((prev) => !prev)}>
        {party ? <div>Turn off party</div> : <div>Turn on party</div>}
      </button>
    </div>
  );
}
