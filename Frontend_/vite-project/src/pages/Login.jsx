// pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ refreshUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4444/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);

        const payload = JSON.parse(atob(data.token.split(".")[1]));
        const userRole = payload.role;

        setEmail("");
        setPassword("");

        if (refreshUser) {
          refreshUser();
        }

        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="group relative w-full max-w-md">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl blur-xl -z-10 animate-pulse" />

        {/* Main card */}
        <div className="relative bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-slate-700/50 hover:border-indigo-400/50 shadow-2xl group-hover:shadow-3xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-transparent rounded-2xl" />

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="flex justify-center space-x-4 mb-4">
                {/* <span className="text-4xl animate-bounce">🚀</span> */}
                <span className="text-4xl animate-pulse">🔐</span>
                {/* <span className="text-4xl animate-bounce delay-1000">👋</span> */}
              </div>
              <h2 className="text-xl font-semibold text-gray-200 mb-1">Ready to dive in?</h2>
              <p className="text-sm text-gray-400">Sign in to access your staking dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-slate-700/50 border border-slate-600/50 p-4 rounded-xl text-gray-100 placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full bg-slate-700/50 border border-slate-600/50 p-4 rounded-xl text-gray-100 placeholder-gray-500 backdrop-blur-sm focus:outline-none focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/register")}
                  className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                >
                  Create one
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
