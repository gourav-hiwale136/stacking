// components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const name = currentUser?.name || currentUser?.email || "User";

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center text-xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-blue-400 bg-clip-text text-transparent hover:scale-105 transition-all duration-300"
            >
              💰 StakingApp
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              /* LOGGED IN */
              <>
                {currentUser.role === "admin" && (
                  <Link
                    to="/admin"
                    className="group relative px-4 py-2 text-sm font-semibold text-gray-100 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 hover:border-orange-400/50 hover:bg-slate-800/70 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
                  >
                    <span>👑 Admin</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 hover:scale-105"
                >
                  📊 Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="group relative px-4 py-2 text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 backdrop-blur-sm rounded-xl border border-rose-500/30 hover:border-rose-400/50 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <span>🚪 Logout</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />
                </button>

                <span className="text-sm text-gray-400 bg-slate-800/30 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-700/50">
                  Hi, {name}!
                </span>
              </>
            ) : (
              /* NOT LOGGED IN */
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 hover:scale-105"
                >
                  🔑 Sign In
                </Link>
                <Link
                  to="/register"
                  className="group relative px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 backdrop-blur-sm rounded-xl border border-indigo-500/50 hover:border-indigo-400/70 hover:from-indigo-600 hover:to-purple-600 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <span>📝 Sign Up</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-xl blur opacity-75 -z-10" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
