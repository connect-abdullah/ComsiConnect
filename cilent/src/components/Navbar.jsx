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
      <span className="font-bold text-xl">COMSATS Connect</span>
    </a>
    
    {/* Feed Nav Links */}
    <div className="hidden md:flex items-center gap-8">
      <a href="/feed" className="text-white border-b-2 border-indigo-500 pb-1">Feed</a>
      <a href="/profile" className="text-zinc-300 hover:text-white transition">Profile</a>
    </div>
    
    {/* User Avatar */}
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer">
        <span className="font-medium text-sm">CU</span>
      </div>
    </div>
  </nav>
  </div>
  )
}

export default Navbar;