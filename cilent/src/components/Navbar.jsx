import React from 'react'
import { motion } from 'framer-motion'
import { useLocation, Link } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Determine if a path is active
  const isActive = (path) => {
    if (path === '/') {
      return currentPath === '/';
    }
    // Check if currentPath starts with the given path (handles nested routes)
    return currentPath.startsWith(path);
  };

  return (
    <div>
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
        
        {/* Main Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/feed" 
            className={`transition duration-200 ${isActive('/feed') 
              ? 'text-white border-b-2 border-indigo-500 pb-1' 
              : 'text-zinc-300 hover:text-white'}`}
          >
            Feed
          </Link>
          <Link 
            to="/explore" 
            className={`transition duration-200 ${isActive('/explore') 
              ? 'text-white border-b-2 border-indigo-500 pb-1' 
              : 'text-zinc-300 hover:text-white'}`}
          >
            Explore
          </Link>
          <Link 
            to="/profile" 
            className={`transition duration-200 ${isActive('/profile') 
              ? 'text-white border-b-2 border-indigo-500 pb-1' 
              : 'text-zinc-300 hover:text-white'}`}
          >
            Profile
          </Link>
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Link to="/notifications" className="text-zinc-300 hover:text-white transition">
            <span className="sr-only">Notifications</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </Link>
          
          {/* User Avatar with Dropdown Menu */}
          <div className="relative group">
            <Link to="/profile" className="block">
              <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition duration-200">
                <span className="font-medium text-sm">CU</span>
              </div>
            </Link>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-zinc-800 rounded-md overflow-hidden shadow-lg border border-zinc-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
              <div className="py-1">
                <Link to="/profile" className="block px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700">Your Profile</Link>
                {/* <Link to="/edit-profile" className="block px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700">Edit Profile</Link> */}
                {/* <Link to="/settings" className="block px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-700">Settings</Link> */}
                <hr className="border-zinc-700 my-1" />
                <button className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-700">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;