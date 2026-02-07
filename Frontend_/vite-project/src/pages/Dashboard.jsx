// pages/Dashboard.jsx
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [stack, setStack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stakeAmount, setStakeAmount] = useState("");
  const [addBalanceAmount, setAddBalanceAmount] = useState("");

  useEffect(() => {
    fetchStack();
  }, []);

  const fetchStack = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

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
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId || payload.id;

      const res = await fetch("http://localhost:4444/api/stack/stake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, amount }),
      });

      if (res.ok) {
        fetchStack();
        setStakeAmount("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBalance = async (e) => {
    e.preventDefault();
    const amount = Number(addBalanceAmount);
    if (!amount || amount <= 0) return;

    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId || payload.id;

      const res = await fetch("http://localhost:4444/api/stack/update-balance", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, newBalance: amount }),
      });

      if (res.ok) {
        fetchStack();
        setAddBalanceAmount("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWithdraw = async () => {
  try {
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.userId || payload.id;

    const res = await fetch("http://localhost:4444/api/stack/withdraw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (res.ok) {
      fetchStack();
    } else {
      const data = await res.json().catch(() => ({}));
      console.error("Withdraw error:", data);
    }
  } catch (err) {
    console.error("Network error:", err);
  }
};


  const handleClaim = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId || payload.id;

      const res = await fetch(`http://localhost:4444/api/stack/claim/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchStack();
      } else {
        const data = await res.json().catch(() => ({}));
        console.error("Claim error:", data);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  if (!stack) {
    return (
      <div className="p-6 text-center text-red-500">
        Controls By User Only
      </div>
    );
  }

  const dailyRate = 0.01; // 1% per day
  const monthlyEstimate = stack.balance * dailyRate * 30;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-700 font-semibold mb-2">💰 Balance</h3>
          <p className="text-3xl font-bold text-indigo-600">{stack.balance}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-700 font-semibold mb-2">📊 Staked</h3>
          <p className="text-3xl font-bold text-green-600">{stack.stake}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-700 font-semibold mb-2">🎯 Claimable</h3>
          <p className="text-3xl font-bold text-blue-600">{stack.AvailableClaim}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-gray-700 font-semibold mb-2">📈 Total Earned</h3>
          <p className="text-3xl font-bold text-purple-600">{stack.totalEarned}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="font-semibold mb-2">Stake vs Balance</h3>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(100, (stack.stake / stack.balance) * 100)}%`,
            }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {stack.stake} / {stack.balance}
        </p>
      </div>

      {/* Interest / APY */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h3 className="font-semibold mb-2">Interest</h3>
        <p className="text-sm text-gray-600">Daily Interest: {dailyRate * 100}%</p>
        <p className="text-sm text-gray-600">
          Estimated earnings this month: {monthlyEstimate.toFixed(2)}
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* STAKE FORM */}
        <form onSubmit={handleStake} className="space-y-4">
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Enter amount to stake"
            className="w-full border p-3 rounded-lg"
            min="1"
            max={stack.balance}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
            disabled={loading || !stakeAmount || Number(stakeAmount) > stack.balance}
          >
            {loading ? "Processing..." : "Stake"}
          </button>
        </form>

        {/* ADD BALANCE FORM */}
        <form onSubmit={handleAddBalance} className="space-y-4">
          <input
            type="number"
            value={addBalanceAmount}
            onChange={(e) => setAddBalanceAmount(e.target.value)}
            placeholder="Enter amount to add"
            className="w-full border p-3 rounded-lg"
            min="1"
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Processing..." : "Add Balance"}
          </button>
        </form>
      </div>

      {/* Claim Rewards */}
      <div className="bg-white p-6 rounded-xl shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Claim Rewards</h2>
        <p className="text-gray-600 mb-4">
          Available:{" "}
          <span className="font-bold text-blue-600">{stack.AvailableClaim}</span>
        </p>
        <button
          onClick={handleClaim}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-semibold disabled:bg-gray-400"
          disabled={stack.AvailableClaim === 0}
        >
          Claim {stack.AvailableClaim}
        </button>
      </div>

      {/* Withdraw */}
<div className="bg-white p-6 rounded-xl shadow-md mt-6">
  <h2 className="text-xl font-semibold mb-4">Withdraw</h2>
  <p className="text-gray-600 mb-4">
    Withdraw all claimed rewards and staked amount.
  </p>
  <button
    onClick={handleWithdraw}
    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-semibold"
  >
    Withdraw 
  </button>
</div>

    </div>

    
  );
};

export default Dashboard;
