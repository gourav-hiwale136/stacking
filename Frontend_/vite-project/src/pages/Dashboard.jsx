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

  const handleAddBalance = async () => {
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
      }
    } catch (err) {
      console.error(err);
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
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!stack) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-blue-400 text-lg">Controls By User Only</div>
      </div>
    );
  }

  const stakeRatio = stack.balance > 0 ? (stack.stake / stack.balance) * 100 : 0;

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Staking Portal
        </h1>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Blue card */}
            <div className="group relative bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/40 hover:border-blue-400/40 transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl blur opacity-60 group-hover:opacity-90 transition-all duration-500" />
              <h3 className="text-gray-200 text-sm font-medium mb-2 relative z-10">💰 Balance</h3>
              <p className="text-2xl font-bold text-blue-400 relative z-10">{stack.balance}</p>
            </div>

            {/* Green card */}
            <div className="group relative bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/40 hover:border-emerald-400/40 transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl blur opacity-60 group-hover:opacity-90 transition-all duration-500" />
              <h3 className="text-gray-200 text-sm font-medium mb-2 relative z-10">📊 Staked</h3>
              <p className="text-2xl font-bold text-emerald-400 relative z-10">{stack.stake}</p>
            </div>

            {/* Purple card */}
            <div className="group relative bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/40 hover:border-purple-400/40 transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-2xl blur opacity-60 group-hover:opacity-90 transition-all duration-500" />
              <h3 className="text-gray-200 text-sm font-medium mb-2 relative z-10">🎯 Claimable</h3>
              <p className="text-2xl font-bold text-purple-400 relative z-10">{stack.AvailableClaim}</p>
            </div>

            {/* Teal card */}
            <div className="group relative bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/40 hover:border-cyan-400/40 transition-all duration-300 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 rounded-2xl blur opacity-60 group-hover:opacity-90 transition-all duration-500" />
              <h3 className="text-gray-200 text-sm font-medium mb-2 relative z-10">📈 Total Earned</h3>
              <p className="text-2xl font-bold text-cyan-400 relative z-10">{stack.totalEarned}</p>
            </div>
          </div>

          {/* Stake form */}
          <div className="group relative bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/40 hover:border-indigo-400/40">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl" />
            <div className="relative z-10">
              <h3 className="text-gray-100 font-semibold mb-4">Stake Tokens</h3>
              <form onSubmit={handleStake} className="space-y-3">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-slate-700/30 border border-slate-600/40 p-3 rounded-xl text-gray-100 placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/40 transition-all duration-300 text-sm"
                  min="1"
                  max={stack.balance}
                  required
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 text-sm disabled:opacity-50"
                  disabled={loading || !stakeAmount || Number(stakeAmount) > stack.balance}
                >
                  {loading ? "Processing..." : "Stake Now"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right column - Progress & Actions */}
        <div className="space-y-6">
          {/* CIRCULAR Progress Bar */}
          <div className="group relative bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/40 hover:border-indigo-400/40 flex flex-col items-center">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-purple-500/10 rounded-2xl" />
            <div className="relative z-10 space-y-3 w-full text-center">
              <h3 className="text-gray-100 font-medium">Stake Ratio</h3>
              
              {/* Full Circle Progress */}
              <div className="relative w-24 h-24 mx-auto">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90 origin-center" viewBox="0 0 36 36">
                  <path
                    d="M 18,2.0845 a 15.9155,15.9155 0 0 1 0,31.831 a 15.9155,15.9155 0 0 1 0,-31.831"
                    fill="none"
                    stroke="url(#gradientBg)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <defs>
                    <linearGradient id="gradientBg" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(75, 85, 99, 0.3)" />
                      <stop offset="100%" stopColor="rgba(51, 65, 85, 0.3)" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Progress Circle */}
                <svg className="w-full h-full absolute top-0 left-0 transform -rotate-90 origin-center" viewBox="0 0 36 36">
                  <path
                    d="M 18,2.0845 a 15.9155,15.9155 0 0 1 0,31.831 a 15.9155,15.9155 0 0 1 0,-31.831"
                    fill="none"
                    stroke="url(#gradientProgress)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="50, 50"
                    strokeDashoffset={Math.max(0, 50 - (stakeRatio / 100 * 50))}
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradientProgress" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#031648" />
                      <stop offset="50%" stopColor="#A78BFA" />
                      <stop offset="100%" stopColor="#C084FC" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-lg font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {Math.round(stakeRatio)}%
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{stack.stake}/{stack.balance}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="group relative bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/40 hover:border-emerald-400/40 space-y-3">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl" />
            <div className="relative z-10">
              <h3 className="text-gray-100 font-medium mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handleClaim}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-2.5 px-4 rounded-xl font-medium hover:from-emerald-600 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all duration-300 text-sm disabled:opacity-50"
                  disabled={stack.AvailableClaim === 0}
                >
                  Claim {stack.AvailableClaim}
                </button>
                <button
                  onClick={handleAddBalance}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2.5 px-4 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                >
                  Add Balance
                </button>
                <button
                  onClick={handleWithdraw}
                  className="w-full bg-gradient-to-r from-rose-400 to-pink-400 text-white py-2.5 px-4 rounded-xl font-medium hover:from-rose-500 hover:to-pink-500 shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
