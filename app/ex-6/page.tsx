"use client";

import React, { useState, useEffect, useRef } from "react";
import '../globals.css'

interface Product {
  id: number;
  title: string;
  description: string;
}

export default function App() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `https://dummyjson.com/products?limit=10&skip=${(page - 1) * 10}`
      );
      const json = await res.json();

      setData(json.products);
      setHasMore(json.products.length > 0);
    }

    fetchData();
  }, [page]);

  return (
    <div>
      <button
        disabled={page === 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
      >
        Previous
      </button>
      <button disabled={!hasMore} onClick={() => setPage((p) => p + 1)}>
        Next
      </button>
      <div>
        <p>Page : {page}</p>
      </div>
      {data.map((p) => (
        <div key={p.id} className = "flex flex-col gap-4">
          <p>{p.title}</p>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}
