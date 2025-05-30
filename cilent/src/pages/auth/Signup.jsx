import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaIdCard,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import Navbar from "../../components/LandingPage/Navbar";
import { signupUser } from "../../api/api";
import Aurora from '../../components/Aurora';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData?.email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      // Use the API service function
      const data = await signupUser(formData);

      // Store token
      if (data?.token) {
        localStorage.setItem("authToken", data?.token);
      }

      // Redirect to login
      navigate("/login", {
        state: {
          successMessage: "Account created successfully! Please log in.",
        },
      });
    } catch (err) {
      console.error("Signup error:", err);

      // Handle error responses
      if (err) {
        // console.log('--> Error:', err);
        if (
          err?.response?.data ===
          "E11000 duplicate key error collection: comsatsconnect.users index: rollNumber_1 dup key: { rollNumber: null }"
        ) {
          setError("Email already exists");
        } else if (err?.response?.data) {
          setError(err?.response?.data || "Failed to create account");
        }
      } else if (err?.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-zinc-900 text-white min-h-screen flex flex-col">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Aurora
          colorStops={["#3A29FF", "#4F46E5", "#FF3232"]}
          blend={0.8}
          amplitude={1.3}
          speed={0.9}
        />
      </div>
      
      {/* Navbar */}
      <div className="relative z-10">
        <Navbar />


      {/* Signup Form Section */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="bg-zinc-800 rounded-xl border border-zinc-700 shadow-xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 px-6 py-8 text-center">
              <h2 className="text-2xl font-bold mb-2">Join ComsiConnect</h2>
              <p className="text-indigo-200">
                Create your account to get started
              </p>
            </div>

            {/* Form Body */}
            <div className="p-6">
              {/* Error Message Display */}
              {error && (
                <div className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-200 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-zinc-300"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-zinc-500" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Roll Number Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-zinc-300"
                  >
                    Roll Number (Username)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIdCard className="text-zinc-500" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData?.username?.toUpperCase()}
                      onChange={handleChange}
                      pattern="^(FA|SP)(2[0-4])-(BSE|BCS|BAI|BDS|BBA|BCE|BIT|BSE|BSCS|BSIT|BME|BCE|BEE|BBA|BSAI|BPHY|BCY|BEN|BENV)-[0-9]{3}$"
                      title="Format: FA24-BSE-042 (use FA or SP, valid year, valid dept code, and 3-digit roll)"
                      className="block w-full pl-10 pr-3 py-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      placeholder="FA20-BCS-123"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-zinc-300"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-zinc-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-zinc-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-zinc-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      minLength={8}
                      className="block w-full pl-10 pr-3 py-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        className="text-zinc-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-zinc-600 rounded bg-zinc-700"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-zinc-400">
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>

                {/* Submit Button with Loading State */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 ${
                      isLoading
                        ? "bg-indigo-700 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } rounded-md font-medium transition duration-300 flex items-center justify-center`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="mt-6 flex items-center">
                <div className="flex-grow border-t border-zinc-600"></div>
                <span className="flex-shrink px-3 text-zinc-400 text-sm">
                  Already have an account?
                </span>
                <div className="flex-grow border-t border-zinc-600"></div>
              </div>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Sign in instead
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="mt-8 text-center text-zinc-500 text-sm">
            <p>© 2025 ComsiConnect. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
      </div>
    </div>
  );
};

export default Signup;
