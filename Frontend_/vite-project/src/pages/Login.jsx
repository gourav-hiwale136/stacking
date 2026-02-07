import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();
console.log("Form Submitted");

  try {
    const res = await fetch("http://localhost:4444/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (data.token) {
      // Save token
      localStorage.setItem("token", data.token);
      

      // Decode JWT to read role
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      const userRole = payload.role;

      // Redirect based on role
      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
        window.location.reload();
      }
    }
  } catch (err) {
    console.error(err);
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
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
