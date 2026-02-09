// pages/Admin.jsx
import { useState, useEffect } from "react";

export default function Admin() {
  const [stackedUsers, setStackedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState({});

  useEffect(() => {
    const fetchStackedUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No admin token found. Please login as admin.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:4444/api/stack/admin/staked-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          setError(`Access denied: ${text} (Are you logged in as admin?)`);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setStackedUsers(data.stackedUsers || []);
      } catch (err) {
        setError(`Network error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStackedUsers();
  }, []);

  const handleRemoveUser = async (userIdToDelete) => {
    if (
      !confirm(
        `🗑️ Remove ${userIdToDelete.slice(0, 8)}... from staking?\n\nThis will delete their entire stack data permanently.`
      )
    ) {
      return;
    }

    try {
      setIsDeleting((prev) => ({ ...prev, [userIdToDelete]: true }));

      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:4444/api/stack/delete/${userIdToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        // Re-fetch the full list so it matches the backend
        const updatedRes = await fetch(
          "http://localhost:4444/api/stack/admin/staked-users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (updatedRes.ok) {
          const data = await updatedRes.json();
          setStackedUsers(data.stackedUsers || []);
        }
        alert("✅ User stack removed successfully!");
      } else {
        const error = await res.text();
        alert(`❌ Error: ${error}`);
      }
    } catch (err) {
      alert(`❌ Network error: ${err.message}`);
    } finally {
      setIsDeleting((prev) => ({ ...prev, [userIdToDelete]: false }));
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="group relative bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 shadow-2xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="text-gray-300 text-lg">Loading admin data...</p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="group relative bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 shadow-2xl max-w-2xl">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚫</span>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-red-400">Admin Access Required</h1>
              <p className="text-gray-400">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="group relative px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Admin Panel
            </h1>
            <p className="text-gray-400">
              Manage staking users and monitor platform performance
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Stakers */}
          <div className="group relative bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/40 hover:border-indigo-400/40 transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 rounded-2xl blur opacity-60 group-hover:opacity-90 transition-all duration-500" />
            <div className="relative z-10 flex items-center space-x-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-1">Total Stakers</h3>
                <p className="text-3xl font-bold text-indigo-400">{stackedUsers.length}</p>
              </div>
            </div>
          </div>

          {/* Total Staked */}
          <div className="group relative bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/40 hover:border-emerald-400/40 transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl blur opacity-60 group-hover:opacity-90 transition-all duration-500" />
            <div className="relative z-10 flex items-center space-x-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-1">Total Staked</h3>
                <p className="text-3xl font-bold text-emerald-400">
                  {stackedUsers
                    .reduce((sum, u) => sum + (u.stake || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Total Earned */}
          <div className="group relative bg-slate-800/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/40 hover:border-purple-400/40 transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-2xl blur opacity-60 group-hover:opacity-90 transition-all duration-500" />
            <div className="relative z-10 flex items-center space-x-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-1">Total Earned</h3>
                <p className="text-3xl font-bold text-purple-400">
                  {stackedUsers
                    .reduce((sum, u) => sum + (u.totalEarned || 0), 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="group relative bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/40 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/30 to-transparent rounded-2xl" />
          <div className="relative z-10">
            <div className="p-6 border-b border-slate-700/50 bg-slate-800/30">
              <h2 className="text-2xl font-bold text-gray-100 flex items-center">
                Stacked Users ({stackedUsers.length})
                <span className="ml-2 px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full border border-indigo-500/30">
                  Live Data
                </span>
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-slate-700/50">
                <thead className="bg-slate-800/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Stake
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Claimable
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Earned
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {stackedUsers.length > 0 ? (
                    stackedUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="group hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-semibold text-sm">
                                {user.userId?.email?.charAt(0)?.toUpperCase() || "U"}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-100">
                                {user.userId?.email?.split("@")[0] || "Unknown User"}
                              </div>
                              <div className="text-xs text-gray-500">{user._id.slice(-6)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                          {user.balance?.toLocaleString() || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-sm font-semibold rounded-full border border-emerald-500/30">
                            {user.stake?.toLocaleString() || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100 font-medium">
                          {user.AvailableClaim?.toLocaleString() || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-semibold rounded-full border border-blue-500/30">
                            {user.totalEarned?.toLocaleString() || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleRemoveUser(user._id)}
                            disabled={isDeleting[user._id]}
                            className="group relative px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            title="Permanently remove user stack"
                          >
                            <span className="relative z-10 flex items-center">
                              {isDeleting[user._id] ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Removing...
                                </>
                              ) : (
                                "🗑️ Remove"
                              )}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/50 to-red-700/50 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl text-gray-400">🚀</span>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-200 mb-2">
                            No users staking yet
                          </h3>
                          <p className="text-gray-400 mb-6">
                            First users will appear here when they stake
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
