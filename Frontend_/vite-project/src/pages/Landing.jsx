// pages/Landing.jsx
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      {/* Hero */}
      <div className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Earn passive income by staking your balance
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Stake your balance and earn daily interest. Start earning rewards with just a few clicks.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="px-8 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 text-indigo-600 border border-indigo-600 hover:bg-indigo-50 rounded-lg"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-8">Platform Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="text-sm text-gray-500">Total Staked</p>
              <p className="text-2xl font-bold text-indigo-600">4</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-green-600">4</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <p className="text-sm text-gray-500">Total Rewards</p>
              <p className="text-2xl font-bold text-purple-600">3006</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
