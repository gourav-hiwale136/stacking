// components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar({currentUser}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
const name = currentUser?.name || currentUser?.email || "User";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode JWT to check role
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          id: payload.userId || payload.id,
          role: payload.role || payload.userRole,
          email: payload.email
        });
      } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              💰 StakingApp
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              /* 👇 LOGGED IN - Shows Admin + Dashboard + Logout */
              <>
                {currentUser.role === "admin" && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    👑 Admin
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  📊 Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                >
                  🚪 Logout
                </button>

                {/* Optional: show user name */}
                <span className="text-sm text-gray-600">
                  Hi, {name}!
                </span>
              </>
            ) : (
              /* 👇 NOT LOGGED IN - Shows Login + Register */
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  🔑 Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  📝 Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
  
}
