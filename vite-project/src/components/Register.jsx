import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const rvceEmailRegex = /^[a-zA-Z0-9._%+-]+@rvce\.edu\.in$/;
    if (!rvceEmailRegex.test(email)) {
      setMessage("Only RVCE email IDs are allowed.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });

      setMessage(`Registration successful: ${response.data.message}`);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      if (error.response) {
        setMessage(`Error: ${error.response.data.message}`);
      } else {
        setMessage("Error: Could not connect to the server.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-600">Join the RVCE community</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form onSubmit={handleRegister} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 
                    rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                RVCE Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 
                    rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="your.name@rvce.edu.in"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Only RVCE email addresses are allowed</p>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 
                    rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Create a strong password"
                />
              </div>
            </div>

            {/* Error/Success Message */}
            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.startsWith("Error")
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent 
                rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-blue-500 transform transition-all duration-200 ease-in-out 
                hover:scale-[1.02]"
            >
              Create Account
            </button>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="font-medium text-white-600 hover:text-white-500 
                    transition-colors duration-200"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;