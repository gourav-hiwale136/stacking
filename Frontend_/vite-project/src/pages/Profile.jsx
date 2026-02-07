// pages/Profile.jsx
import { useState, useEffect } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          name: payload.name,
          email: payload.email,
          joinDate: new Date(payload.iat * 1000).toLocaleDateString(),
        });
      } catch (err) {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4444/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (res.ok) {
        setMessage("Password changed successfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to change password");
      }
    } catch (err) {
      setMessage("Network error");
    }
  };

  if (!user) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Join Date:</strong> {user.joinDate}
        </p>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-4">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Old password"
          className="w-full border p-3 rounded-lg"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          className="w-full border p-3 rounded-lg"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full border p-3 rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
        >
          Change Password
        </button>
        {message && <p className="text-sm text-red-600 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default Profile;
