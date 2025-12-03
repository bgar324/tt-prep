"use client";

import React, { useState, useEffect } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function App() {
  const [data, setData] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch(
        `https://dummyjson.com/posts?limit=10&skip=${(page - 1) * 10}`
      );
      const json = await res.json();
      setData(json.posts);
      setHasMore(json.posts.length - 1 > 0);
    }
    fetchPosts();
  }, [page]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>title</th>
            <th>body</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.title}</td>
              <td>{item.body}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <button onClick={() => setPage((p) => p + 1)} disabled= {!hasMore}>Next</button>
        <h1>Page: {page}</h1>
      </div>
    </div>
  );
}
