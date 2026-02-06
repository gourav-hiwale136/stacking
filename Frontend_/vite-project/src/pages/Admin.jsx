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
    if (!confirm(`🗑️ Remove ${userIdToDelete.slice(0, 8)}... from staking?\n\nThis will delete their entire stack data permanently.`)) {
      return;
    }

    try {
      setIsDeleting(prev => ({ ...prev, [userIdToDelete]: true }));
      
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:4444/api/stack/delete/${userIdToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setStackedUsers(prev => prev.filter(user => user._id !== userIdToDelete));
        alert('✅ User stack removed successfully!');
      } else {
        const error = await res.text();
        alert(`❌ Error: ${error}`);
      }
    } catch (err) {
      alert(`❌ Network error: ${err.message}`);
    } finally {
      setIsDeleting(prev => ({ ...prev, [userIdToDelete]: false }));
    }
  };

  if (loading) return (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <p className="text-lg text-gray-600">Loading admin data...</p>
    </div>
  );

  if (error) return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚫</span>
        </div>
        <h1 className="text-2xl font-bold text-red-800 mb-2">Admin Access Required</h1>
        <p className="text-red-700 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          🔄 Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600">Manage staking users and monitor platform performance</p>
        </div>
        <div className="text-sm text-gray-500">
          Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Stakers</h3>
              <p className="text-3xl font-bold text-indigo-600">{stackedUsers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-xl">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Staked</h3>
              <p className="text-3xl font-bold text-green-600">
                {stackedUsers.reduce((sum, u) => sum + (u.stake || 0), 0).toLocaleString()} 
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-xl">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Total Earned</h3>
              <p className="text-3xl font-bold text-blue-600">
                {stackedUsers.reduce((sum, u) => sum + (u.totalEarned || 0), 0).toLocaleString()} 
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            Stacked Users ({stackedUsers.length})
            <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-semibold rounded-full">
              Live Data
            </span>
          </h2>
          <p className="text-gray-600 mt-1">Click "Remove" to delete user stacks (admin action only)</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stake</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claimable</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earned</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stackedUsers.length > 0 ? (
                stackedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-semibold text-sm">
                            {user.userId?.email?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.userId?.email?.split('@')[0] || 'Unknown User'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {user._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.balance?.toLocaleString() || 0} 
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full">
                        {user.stake?.toLocaleString() || 0} 
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {user.AvailableClaim?.toLocaleString() || 0} 
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
                        {user.totalEarned?.toLocaleString() || 0} 
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveUser(user._id)}
                        disabled={isDeleting[user._id]}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        title="Permanently remove user stack"
                      >
                        {isDeleting[user._id] ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Removing...
                          </>
                        ) : (
                          '🗑️ Remove'
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl text-gray-400">🚀</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No users staking yet</h3>
                      <p className="text-gray-500 mb-6">First users will appear here when they stake HC</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
