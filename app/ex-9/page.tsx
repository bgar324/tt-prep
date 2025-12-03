"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface Product {
  id: number;
  title: string;
}

// ----------------------------------------------------
// 1. useDebounce Hook (Unchanged)
// ----------------------------------------------------
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ----------------------------------------------------
// 2. Autocomplete Component
// ----------------------------------------------------
export default function AutocompleteSearch() {
  const [input, setInput] = useState("");
  const [data, setData] = useState<Product[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // useRef to link the input element for focus management
  const inputRef = useRef<HTMLInputElement>(null);
  // useRef to hold the DOM element of the currently active row
  const activeRowRef = useRef<HTMLTableRowElement>(null); 

  const debouncedInput = useDebounce(input, 300);

  // --- Core Handlers ---

  // 3. Select Item Handler (useCallback for stability)
  const selectItem = useCallback((title: string) => {
    setInput(title);       // Set input to the selected item's title
    setData([]);           // Clear suggestions
    setIsVisible(false);   // Hide the menu
    setActiveId(null);     // Clear highlight
    inputRef.current?.focus(); // Keep focus on input
  }, []);

  // 4. Input Change Handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    // Show menu as soon as the user starts typing
    if (e.target.value.length > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
    setActiveId(null);
  };
  
  // 5. Blur Handler (Escape closes, Blur closes)
  const handleBlur = (e: React.FocusEvent) => {
    // Use a short delay to allow the selectItem/onClick event to fire first
    setTimeout(() => {
        // If focus has moved *outside* the entire container (e.g., body), close the list
        if (!e.currentTarget.contains(document.activeElement)) {
            setIsVisible(false);
            setActiveId(null);
        }
    }, 100);
  };

  // 6. Keyboard Navigation Handler (up/down/enter/escape)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isVisible || data.length === 0) return;

    // Get the index of the currently active item
    const currentIndex = data.findIndex(p => p.id === activeId);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowDown') {
      e.preventDefault(); // Prevent cursor movement
      nextIndex = (currentIndex === data.length - 1) ? 0 : currentIndex + 1;
      
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); // Prevent cursor movement
      nextIndex = (currentIndex <= 0) ? data.length - 1 : currentIndex - 1;

    } else if (e.key === 'Enter') {
      e.preventDefault();
      const product = data.find(p => p.id === activeId);
      if (product) {
        selectItem(product.title); // Select the highlighted item
      }
      return;

    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsVisible(false); // Close menu
      setActiveId(null);
      return;
    }

    if (nextIndex !== currentIndex) {
      setActiveId(data[nextIndex].id);
    }
  }, [data, activeId, isVisible, selectItem]);

  // --- Data Fetching Effect ---
  useEffect(() => {
    if (debouncedInput.length === 0) {
      setData([]);
      return;
    }

    async function fetchData() {
      try {
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${debouncedInput}`
        );
        const json = await res.json();
        const productData = (json.products || []).map((p: any) => ({
             id: p.id, 
             title: p.title
        }));
        setData(productData);
        if (productData.length > 0) {
            setIsVisible(true);
        }
      } catch (error) {
         console.error("Fetch failed:", error);
      }
    }

    fetchData();
  }, [debouncedInput]);
  
  // --- Accessibility/Scroll Effect ---
  // Ensure the highlighted row is always visible when navigating
  useEffect(() => {
      if (activeRowRef.current) {
          activeRowRef.current.scrollIntoView({
              block: 'nearest'
          });
      }
  }, [activeId]);

  // --- Rendering ---
  return (
    // The container manages the blur event for closing the menu
    <div style={{ position: 'relative', width: '300px' }} onBlur={handleBlur} tabIndex={-1}> 
      <input
        ref={inputRef}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search products..."
        type="text"
        // Ensure the component handles the focus visually
        style={{ width: '100%', padding: '10px', border: '1px solid #ccc' }}
      />

      {/* Suggestion Dropdown */}
      {isVisible && debouncedInput.length > 0 && (
        <div 
            style={{
                position: 'absolute',
                width: '100%',
                maxHeight: '200px',
                overflowY: 'auto',
                border: '1px solid #ccc',
                borderTop: 'none',
                backgroundColor: 'white',
                zIndex: 10
            }}
        >
          {data.length === 0 ? (
            <div style={{ padding: '10px', color: 'gray' }}>No results found.</div>
          ) : (
            data.map((product) => {
              const isActive = product.id === activeId;
              return (
                <div
                  key={product.id}
                  // 7. Attach ref only to the active element for scrollIntoView
                  ref={isActive ? activeRowRef : null} 
                  onClick={() => selectItem(product.title)}
                  // Highlight active row
                  onMouseEnter={() => setActiveId(product.id)} // Mouse hover updates highlight
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#f0f0f0' : 'white',
                    borderBottom: '1px solid #eee'
                  }}
                >
                  {product.title}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}