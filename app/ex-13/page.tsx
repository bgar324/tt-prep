"use client";

import React, { useState, useEffect } from "react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  university: string;
}

export default function App() {
  const [data, setData] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(new Set<number>());
  const allSelected = active.size === data.length;

  const handleActive = (id: number) => {
    setActive((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setActive((prev) => {
      if (prev.size === data.length) return new Set();

      return new Set(data.map((u) => u.id));
    });
  };

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch("https://dummyjson.com/users?limit=50");
        if (!res.ok) {
          throw new Error("Error Fetching");
        }
        const json = await res.json();
        setData(json.users);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Unknown Error");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>University</th>
            <th>Checkbox</th>
            <th>
              <div className="flex flex-row">
                Select All
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>{user.university}</td>
              <td>
                <input
                  type="checkbox"
                  checked={active?.has(user.id)}
                  onChange={() => handleActive(user.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1>Active Rows: {Array.from(active).sort().join(", ")}</h1>
    </div>
  );
}
