'use client';

import React, { useEffect, useState } from 'react';

interface Product {
  id: number;
  title: string;
  description: string;
}

const LIMIT = 10;

export default function App() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Product[]>([]);
  const [pages, setPages] = useState<Record<number, Product[]>>({});
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPage(currentPage: number) {
      setError(null);

      const cached = pages[currentPage];
      if (cached) {
        setData(cached);
        setHasMore(cached.length === LIMIT);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://dummyjson.com/products?limit=${LIMIT}&skip=${(currentPage - 1) * LIMIT}`
        );

        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }

        const json = await res.json();
        if (cancelled) return;

        const products: Product[] = json.products ?? [];  
        const total: number = json.total ?? 0;

        setData(products);
        setPages(prev => ({ ...prev, [currentPage]: products }));
        setHasMore(currentPage * LIMIT < total);
      } catch (e) {
        if (cancelled) return;
        setError('Failed to load products. Please try again.');
        // In an interview you can also console.error(e);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPage(page);

    return () => {
      cancelled = true;
    };
  }, [page, pages]);

  const handlePrevious = () => {
    if (page === 1 || loading) return;
    setPage(prev => prev - 1);
  };

  const handleNext = () => {
    if (!hasMore || loading) return;
    setPage(prev => prev + 1);
  };

  return (
    <div className="p-4">
      <h1>Products</h1>
 
      {error && (
        <div className="mb-2 text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-2">
          Loading...
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="mb-2">
          No products found.
        </div>
      )}

      {data.length > 0 && (
        <table className="border-collapse border mb-4">
          <thead>
            <tr>
              <th className="border px-2 py-1">ID</th>
              <th className="border px-2 py-1">Title</th>
              <th className="border px-2 py-1">Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map(product => (
              <tr key={product.id}>
                <td className="border px-2 py-1">{product.id}</td>
                <td className="border px-2 py-1">{product.title}</td>
                <td className="border px-2 py-1">{product.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex items-center gap-2">
        <button
          disabled={page === 1 || loading}
          onClick={handlePrevious}
        >
          Previous
        </button>
        <div className="border rounded-lg px-3 py-1">
          Page {page}
        </div>
        <button
          disabled={!hasMore || loading}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
