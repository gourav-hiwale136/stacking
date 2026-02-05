import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stack, setStack] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    fetchStack(parsedUser.id);
  }, [navigate]);

  const fetchStack = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:4444/api/stack/${userId}`
      );
      setStack(res.data.stack);
    } catch (error) {
      console.error(error);
      alert("Failed to load stack data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* USER INFO */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h1 className="text-2xl font-bold">
            Welcome, {user.username} 👋
          </h1>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard title="Balance" value={`₹${stack.balance}`} />
          <StatCard title="Total Earned" value={`₹${stack.totalEarned}`} />
          <StatCard title="Claimed" value={`₹${stack.claimedRewards}`} />
          <StatCard title="Unclaimed" value={`₹${stack.unclaimedRewards}`} />
        </div>

        {/* REWARDS HISTORY */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Reward History</h2>

          {stack.rewards.length === 0 ? (
            <p className="text-gray-500">No rewards yet</p>
          ) : (
            <ul className="space-y-2">
              {stack.rewards.map((reward, index) => (
                <li
                  key={index}
                  className="flex justify-between border-b pb-2"
                >
                  <span>
                    {new Date(reward.time).toLocaleString()}
                  </span>
                  <span className="font-semibold text-green-600">
                    +₹{reward.amount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          className="bg-red-600 text-white px-6 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow text-center">
    <p className="text-gray-500">{title}</p>
    <h3 className="text-xl font-bold">{value}</h3>
  </div>
);

export default Dashboard;
