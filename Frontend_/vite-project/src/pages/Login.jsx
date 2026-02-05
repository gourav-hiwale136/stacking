import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:4444/api/auth/login",
        { email, password }
      );

      // ✅ SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // ✅ SAVE USER (THIS WAS MISSING)
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful ✅");

      // ✅ REDIRECT
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Don’t have an account?
          <span
            className="text-green-600 cursor-pointer ml-1"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
