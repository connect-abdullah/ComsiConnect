import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle login logic here
    console.log('Login attempt with:', { email, password })
  }

  return (
    <div className="bg-zinc-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-zinc-800/80 backdrop-blur-sm px-6 py-4 flex justify-between items-center border-b border-zinc-700">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 10 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center"
          >
            <span className="font-bold">C</span>
          </motion.div>
          <span className="font-bold text-xl">COMSATS Connect</span>
        </Link>
      </nav>

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
              <p className="text-indigo-200">Sign in to your COMSATS Connect account</p>
            </div>

            {/* Form Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-300">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-zinc-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      placeholder="you@example.com"
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
                  <Link to="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300">
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition duration-300"
                  >
                    Sign In
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
            <p>© 2025 COMSATS Connect. All rights reserved.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
