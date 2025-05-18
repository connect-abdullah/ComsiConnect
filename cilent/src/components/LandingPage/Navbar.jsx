import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaBars, FaTimes } from 'react-icons/fa'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
        <nav className="sticky top-0 z-50 bg-zinc-800/80 backdrop-blur-sm px-4 sm:px-6 py-4 flex justify-between items-center border-b border-zinc-700">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="bg-indigo-600 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center"
            >
              <span className="font-bold text-sm sm:text-base">C</span>
            </motion.div>
            <span className="font-bold text-lg sm:text-xl">ComsiConnect</span>
          </a>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex gap-4">
            <a href="/login" className="px-4 py-2 rounded-md bg-transparent border border-zinc-600 hover:bg-zinc-800 transition duration-300">
              Log In
            </a>
            <a href="/signup" className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition duration-300">
              Sign Up
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-zinc-800 border-b border-zinc-700">
            <div className="flex flex-col px-4 py-2 space-y-2">
              <a 
                href="/login" 
                className="px-4 py-2 rounded-md bg-transparent border border-zinc-600 hover:bg-zinc-700 transition duration-300 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </a>
              <a 
                href="/signup" 
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 transition duration-300 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </a>
            </div>
          </div>
        )}
    </div>
  )
}

export default Navbar;