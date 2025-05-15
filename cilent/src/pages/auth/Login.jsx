import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { loginUser } from '../../api/api'
import Navbar from '../../components/LandingPage/Navbar'

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Check for success message from redirect (like after signup)
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      
      // Clear the success message from location state
      window.history.replaceState({}, document.title);
      
      // Auto-hide the success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
        const credentials = { username: username.toUpperCase(), password };
      // Make login request to your API
      const response = await loginUser(credentials);
      
      console.log('Login successful:', response);
      
      // Store the token
      if (response?.data?.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      // Store user information if needed
      if (response?.data?.user) {
        localStorage.setItem('user', JSON.stringify(response?.user));
      }
      

      navigate('/profile');
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle error responses
      if (err) {
        setError(err?.response?.data?.message || 'Invalid username or password');
      } else if (err.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Login Form Section */}
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
              <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
              <p className="text-indigo-200">Sign in to your ComsiConnect Connect account</p>
            </div>

            {/* Form Body */}
            <div className="p-6">
              {/* Success Message */}
              {successMessage && (
                <div className="mb-6 p-3 bg-green-600/20 border border-green-500 rounded-md text-green-200 text-center">
                  {successMessage}
                </div>
              )}
              
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-200 text-center">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-zinc-300">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-zinc-500" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toUpperCase())}
                      className="block w-full pl-10 pr-3 py-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-zinc-300">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-zinc-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                {/* Forgot Password Link */}
                <div className="flex items-center justify-end">
                  <Link to="/forgot-pass" className="text-sm text-indigo-400 hover:text-indigo-300">
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit Button with Loading State */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 ${
                      isLoading ? 'bg-indigo-700 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                    } rounded-md font-medium transition duration-300 flex items-center justify-center`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                  
                </div>
              </form>

              {/* Divider */}
              <div className="mt-6 flex items-center">
                <div className="flex-grow border-t border-zinc-600"></div>
                <span className="flex-shrink px-3 text-zinc-400 text-sm">Don't have an account?</span>
                <div className="flex-grow border-t border-zinc-600"></div>
              </div>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  Create an account
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="mt-8 text-center text-zinc-500 text-sm">
            <p>© 2025 ComsiConnect Connect. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
