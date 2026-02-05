import { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4444/api/auth/register", form);
      alert("Registered successfully 🎉");
      navigate("/login");
    } catch (err) {
     alert(
    err.response?.data?.error ||
    err.response?.data?.message ||
    "Registration failed"
  );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />

          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
            Register
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?
          <span
            className="text-blue-600 cursor-pointer ml-1"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
