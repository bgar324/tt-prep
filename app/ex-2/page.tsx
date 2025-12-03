'use client'

import { useState } from "react";

export default function App() {
  // TypeScript union type for state
  const [active, setActive] = useState<"one" | "two" | "three">("one");

  // Base style for all buttons
  const baseButtonStyle = {
    padding: '10px 20px',
    border: '1px solid #ccc',
    cursor: 'pointer',
    backgroundColor: '#f0f0f0',
    marginRight: '5px',
    borderBottom: 'none',
    borderRadius: '4px 4px 0 0',
  };

  // Style for the container holding the content
  const contentStyle = {
    padding: '20px',
    border: '1px solid #ccc',
    marginTop: '-1px', // Pull up to meet the tab borders
    borderRadius: '0 4px 4px 4px',
    minHeight: '100px',
    backgroundColor: '#fff',
  };

  // Function to get the style for a specific tab button
  const getTabStyle = (tabName: "one" | "two" | "three") => ({
    ...baseButtonStyle,
    // Apply active styles if the tab matches the current state
    ...(active === tabName && {
      backgroundColor: '#fff',
      fontWeight: 'bold',
      borderBottom: '1px solid #fff', // Hide the bottom border to blend with content
    }),
  });

  function renderContent() {
    switch (active) {
      case "one":
        return <div>👋 Welcome to Tab One! This is the default content.</div>;
      case "two":
        return <div>💡 Tab Two contains important information.</div>;
      case "three":
        return <div>⚙️ Tab Three is reserved for settings or configuration.</div>;
      default:
        return null;
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto' }}>
      {/* Tab Buttons Container */}
      <div style={{ display: 'flex' }}>
        <button 
          onClick={() => setActive("one")} 
          style={getTabStyle("one")}
        >
          Tab One
        </button>
        <button 
          onClick={() => setActive("two")} 
          style={getTabStyle("two")}
        >
          Tab Two
        </button>
        <button 
          onClick={() => setActive("three")} 
          style={getTabStyle("three")}
        >
          Tab Three
        </button>
      </div>

      {/* Content Area */}
      <div style={contentStyle}>
        {renderContent()}
      </div>
    </div>
  );
}