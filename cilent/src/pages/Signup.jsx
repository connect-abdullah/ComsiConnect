import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaLock, FaUser, FaIdCard, FaEye, FaEyeSlash  } from 'react-icons/fa'

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle signup logic here
    console.log('Signup attempt with:', formData)
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
              <h2 className="text-2xl font-bold mb-2">Join COMSATS Connect</h2>
              <p className="text-indigo-200">Create your account to get started</p>
            </div>

            {/* Form Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name Field */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-zinc-300">Full Name</label>
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
                  <label htmlFor="rollNumber" className="block text-sm font-medium text-zinc-300">Roll Number (Username)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaIdCard className="text-zinc-500" />
                    </div>
                    <input
                      id="rollNumber"
                      name="rollNumber"
                      type="text"
                      required
                      value={formData.rollNumber}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 bg-zinc-700 border border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white"
                      placeholder="FA20-BCS-123"
                    />
                  </div>
                </div>

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
                      value={formData.email}
                      onChange={handleChange}
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
                      value={formData.password}
                      onChange={handleChange}
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

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-zinc-500" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
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
                      I agree to the <a href="#" className="text-indigo-400 hover:text-indigo-300">Terms of Service</a> and <a href="#" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</a>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium transition duration-300"
                  >
                    Create Account
                  </button>
                </div>
              </form>

              {/* Divider */}
              <div className="mt-6 flex items-center">
                <div className="flex-grow border-t border-zinc-600"></div>
                <span className="flex-shrink px-3 text-zinc-400 text-sm">Already have an account?</span>
                <div className="flex-grow border-t border-zinc-600"></div>
              </div>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                  Sign in instead
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

export default Signup