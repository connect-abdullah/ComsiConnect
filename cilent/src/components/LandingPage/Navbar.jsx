import React from 'react'
import { motion } from 'framer-motion'
const Navbar = () => {
  return (
    <div>
        <nav className="sticky top-0 z-50 bg-zinc-800/80 backdrop-blur-sm px-6 py-4 flex justify-between items-center border-b border-zinc-700">
    {/* Logo */}
    <a href="/" className="flex items-center gap-2">
      <motion.div
        initial={{ rotate: -10 }}
        animate={{ rotate: 10 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="bg-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center"
      >
        <span className="font-bold">C</span>
      </motion.div>
      <span className="font-bold text-xl">ComsiConnect</span>
    </a>
    
    {/* Auth Buttons */}
    <div className="flex gap-4">
      <a href="/login" className="px-4 py-2 rounded-md bg-transparent border border-zinc-600 hover:bg-zinc-800 transition duration-300">
        Log In
      </a>
      <a href="/signup" className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition duration-300">
        Sign Up
      </a>
    </div>
  </nav>
  </div>
  )
}

export default Navbar;