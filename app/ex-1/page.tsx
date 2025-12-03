"use client";

import React, { useState, useEffect } from "react";
import "./App.css"; // Import the CSS file

export default function App() {
  const [open, setOpen] = useState(false);

  // 1. ESCAPE KEY EFFECT
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
    }
    //useeffect requires a return function
    // react receives the return function and has the cleanup function
    // cleanup function happens on component death or dependency change
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // 2. CLOSES MODAL: Triggered by clicking the backdrop.
  function handleOverlayClick() {
    console.log("❌ [BACKDROP] Click received. Closing Modal.");
    setOpen(false);
  }

  // 2. CONTENT HANDLER (The Inner Modal) - NO STOP PROPAGATION!
  function handleModalClick(e: React.MouseEvent) {
    // This function runs, but does nothing to stop the event from continuing!
    console.log(
      "⚠️ [MODAL CONTENT] Click received. Event continues to bubble up!"
    );
    // e.stopPropagation() is GONE!
  }

  return (
    <div className="app-container">
      <button onClick={() => setOpen(true)}>Open Modal Demo (Bubbling)</button>

      {open && (
        // OUTER DIV (The Backdrop) - Closable Area
        <div className="modal-overlay" onClick={handleOverlayClick}>
          {/* INNER DIV (The Content) - The Problem Area */}
          <div className="modal-content-bubbling" onClick={handleModalClick}>
            <h3 className="modal-title">UNCONTROLLED BUBBLING DEMO</h3>

            <p>
              Click **ANYWHERE** on this **WHITE BOX**.
              <br />
              The click event will:
            </p>

            <ol>
              <li>Trigger **handleModalClick** (Inner function runs).</li>
              <li>Bubble up to the parent div.</li>
              <li>Trigger **handleOverlayClick** (Outer function runs).</li>
            </ol>

            <p className="warning-text">
              Result: The modal closes even though you clicked inside!
            </p>

            <button className="close-button" onClick={() => setOpen(false)}>
              Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
