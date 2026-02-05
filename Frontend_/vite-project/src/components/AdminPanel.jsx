import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const AdminPanel = () => {
  const { token } = useAuth();
  const [stackedUsers, setStackedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const api = async (url, options = {}) => {
    const res = await fetch(`/stack${url}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  };

  useEffect(() => {
    const fetchStackedUsers = async () => {
      try {
        const res = await api("/admin/stacked-users");
        setStackedUsers(res.stackedUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStackedUsers();
  }, [token]);

  const deleteStack = async (userId) => {
    try {
      await api(`/delete/${userId}`, { method: "DELETE" });
      setStackedUsers((prev) => prev.filter((u) => u.userId._id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin – Stacked Users</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {stackedUsers.length === 0 ? (
        <p>No stacked users found.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Balance</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stackedUsers.map((item) => (
              <tr key={item._id}>
                <td className="border px-4 py-2">{item.userId.username}</td>
                <td className="border px-4 py-2">{item.userId.email}</td>
                <td className="border px-4 py-2">{item.balance}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => deleteStack(item.userId._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete Stack
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
