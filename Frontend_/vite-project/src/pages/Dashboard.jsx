// pages/Dashboard.jsx - COMPLETE VERSION
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [stack, setStack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stakeAmount, setStakeAmount] = useState("");

  useEffect(() => {
    fetchStack();
  }, []);

  const fetchStack = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId || payload.id;

      const res = await fetch(`http://localhost:4444/api/stack/get/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setStack(data.stack);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async (e) => {
    e.preventDefault();
    const amount = Number(stakeAmount);
    if (!amount || amount <= 0) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4444/api/stack/stake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      if (res.ok) {
        fetchStack(); // refresh data
        setStakeAmount("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClaim = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4444/api/stack/claim", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchStack(); // refresh data
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!stack) return <div className="p-6 text-center text-red-500">Controls By User Only</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      {/* DISPLAY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-700 font-semibold mb-2">Balance</h3>
          <p className="text-3xl font-bold text-indigo-600">{stack.balance}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-700 font-semibold mb-2">Staked</h3>
          <p className="text-3xl font-bold text-green-600">{stack.stake}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-700 font-semibold mb-2">Claimable</h3>
          <p className="text-3xl font-bold text-blue-600">{stack.AvailableClaim}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-700 font-semibold mb-2">Total Earned</h3>
          <p className="text-3xl font-bold text-purple-600">{stack.totalEarned}</p>
        </div>
      </div>

      {/* ACTION SECTION - Stake + Claim */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* STAKE FORM */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Stake </h2>
          <form onSubmit={handleStake} className="space-y-4">
            <input
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Enter amount to stake"
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
              min="1"
              max={stack.balance}
              required
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 font-semibold"
              disabled={!stakeAmount || Number(stakeAmount) > stack.balance}
            >
              Stake
            </button>
          </form>
        </div>

        {/* CLAIM BUTTON */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Claim Rewards</h2>
          <p className="text-gray-600 mb-4">
            Available: <span className="font-bold text-blue-600">{stack.AvailableClaim} </span>
          </p>
          <button
            onClick={handleClaim}
            className="w-full bg-green-600 text-white py-3 px-4 mt-6 rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400"
            disabled={stack.AvailableClaim === 0}
          >
            Claim {stack.AvailableClaim} 
          </button>
        </div>
      </div>
    </div>
  );
}
